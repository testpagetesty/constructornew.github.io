// API роут для проксирования запросов к OpenAI
import { OPENAI_CONFIG } from '../../config/openai.js';

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Принимаем только POST запросы
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt, type = 'SECTION' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Конфигурация в зависимости от типа запроса
    const configs = {
      FULL_SITE: {
        max_tokens: 4000, // Максимум для GPT-4 Turbo completion
        temperature: 0.7,
        timeout: 120000 // 2 минуты для больших запросов
      },
      SECTION: {
        max_tokens: 3000,
        temperature: 0.7,
        timeout: 90000 // 1.5 минуты
      },
      LEGAL: {
        max_tokens: 4000,
        temperature: 0.5,
        timeout: 100000 // 1 минута 40 секунд
      }
    };

    const config = configs[type] || configs.SECTION;

    console.log('🚀 API Proxy: Отправка запроса к OpenAI...', { 
      type, 
      promptLength: prompt.length,
      maxTokens: config.max_tokens 
    });

    // Создаем контроллер для таймаута
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    // Отправляем запрос к OpenAI API
    const response = await fetch(OPENAI_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.max_tokens,
        temperature: config.temperature
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ OpenAI API Error:', response.status, errorData);
      
      // Возвращаем более детальную информацию об ошибке
      res.status(response.status).json({
        error: `OpenAI API Error: ${response.status}`,
        details: errorData.error?.message || 'Unknown error',
        code: errorData.error?.code || 'unknown'
      });
      return;
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid OpenAI response format:', data);
      res.status(500).json({ error: 'Invalid response format from OpenAI' });
      return;
    }

    const result = data.choices[0].message.content.trim();
    
    console.log('✅ API Proxy: Успешный ответ от OpenAI', { 
      responseLength: result.length,
      tokensUsed: data.usage?.total_tokens || 'N/A'
    });

    // Возвращаем успешный результат
    res.status(200).json({
      success: true,
      content: result,
      usage: data.usage || null
    });

  } catch (error) {
    console.error('❌ API Proxy error:', error);

    // Обработка различных типов ошибок
    if (error.name === 'AbortError') {
      res.status(408).json({ 
        error: 'Request timeout', 
        details: 'Время ожидания ответа истекло' 
      });
      return;
    }

    if (error.message.includes('fetch')) {
      res.status(503).json({ 
        error: 'Service unavailable', 
        details: 'Не удается подключиться к OpenAI API' 
      });
      return;
    }

    // Общая ошибка
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}