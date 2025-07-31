import { REQUEST_CONFIGS } from '../config/openai.js';

class OpenAIService {
  constructor() {
    // Используем локальный API роут вместо прямого обращения к OpenAI
    this.apiUrl = '/api/openai';
  }

  /**
   * Базовый метод для отправки запроса к OpenAI API с retry логикой
   * @param {string} prompt - Промпт для AI
   * @param {string} type - Тип запроса (FULL_SITE, SECTION, LEGAL)
   * @param {number} retryCount - Количество попыток (по умолчанию 3)
   * @returns {Promise<string>} - Ответ от AI
   */
  async sendRequest(prompt, type = 'SECTION', retryCount = 3) {
    const config = REQUEST_CONFIGS[type] || REQUEST_CONFIGS.SECTION;
    
    try {
      console.log('🚀 Отправка запроса к OpenAI...', { type, promptLength: prompt.length });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          type: type
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.details || errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.content) {
        throw new Error('Неверный формат ответа от API');
      }

      const result = data.content.trim();
      console.log('✅ Получен ответ от OpenAI', { 
        responseLength: result.length,
        tokensUsed: data.usage?.total_tokens || 'N/A'
      });

      return result;

    } catch (error) {
      console.error('❌ Ошибка при запросе к OpenAI:', error);
      
      // Если ошибка 500 (серверная) или 408 (тайм-аут) и есть попытки повтора
      if ((error.message.includes('500') || error.message.includes('408')) && retryCount > 0) {
        console.log(`🔄 Повторная попытка... Осталось попыток: ${retryCount - 1}`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Ждем 3 секунды
        return this.sendRequest(prompt, type, retryCount - 1);
      }
      
      if (error.name === 'AbortError') {
        throw new Error('Время ожидания ответа истекло. Попробуйте еще раз или уменьшите размер промпта.');
      }
      
      if (error.message.includes('408')) {
        throw new Error('Время ожидания ответа истекло. Сервер OpenAI не отвечает. Попробуйте позже.');
      }
      
      if (error.message.includes('401')) {
        throw new Error('Неверный API ключ OpenAI. Проверьте настройки.');
      }
      
      if (error.message.includes('429')) {
        throw new Error('Превышен лимит запросов. Попробуйте позже.');
      }
      
      if (error.message.includes('quota')) {
        throw new Error('Исчерпан лимит использования API OpenAI.');
      }
      
      if (error.message.includes('500')) {
        throw new Error('Серверная ошибка OpenAI. Попробуйте позже или уменьшите размер промпта.');
      }
      
      if (error.message.includes('503')) {
        throw new Error('Сервис OpenAI временно недоступен. Попробуйте позже.');
      }

      throw error;
    }
  }

  /**
   * Генерация контента для полного сайта
   * @param {string} prompt - Промпт для генерации полного сайта
   * @returns {Promise<string>} - Сгенерированный контент
   */
  async generateFullSite(prompt) {
    return this.sendRequest(prompt, 'FULL_SITE');
  }

  /**
   * Генерация контента для отдельной секции
   * @param {string} prompt - Промпт для генерации секции
   * @returns {Promise<string>} - Сгенерированный контент
   */
  async generateSection(prompt) {
    return this.sendRequest(prompt, 'SECTION');
  }

  /**
   * Генерация правовых документов
   * @param {string} prompt - Промпт для генерации правовых документов
   * @returns {Promise<string>} - Сгенерированные документы
   */
  async generateLegalDocuments(prompt) {
    return this.sendRequest(prompt, 'LEGAL');
  }

  /**
   * Проверка доступности API
   * @returns {Promise<boolean>} - Доступен ли API
   */
  async checkConnection() {
    try {
      const testPrompt = 'Ответьте одним словом: "Работает"';
      const response = await this.sendRequest(testPrompt, 'SECTION');
      return response.toLowerCase().includes('работает') || response.toLowerCase().includes('works');
    } catch (error) {
      console.error('Ошибка проверки соединения с OpenAI:', error);
      return false;
    }
  }
}

// Создаем единственный экземпляр сервиса
const openaiService = new OpenAIService();
export default openaiService;