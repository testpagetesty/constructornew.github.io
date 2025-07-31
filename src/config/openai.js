// Конфигурация OpenAI API
export const OPENAI_CONFIG = {
  API_KEY: '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',
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-4-turbo', // GPT-4 Turbo - быстрее и стабильнее
  MAX_TOKENS: 8000,
  TEMPERATURE: 0.7,
  TIMEOUT: 30000 // 30 секунд
};

// Настройки для разных типов запросов
export const REQUEST_CONFIGS = {
  FULL_SITE: {
    model: OPENAI_CONFIG.MODEL,
    max_tokens: 4000, // Максимум для GPT-4 Turbo completion
    temperature: 0.7,
    timeout: 120000 // 2 минуты для больших запросов
  },
  SECTION: {
    model: OPENAI_CONFIG.MODEL,
    max_tokens: 3000,
    temperature: 0.7,
    timeout: 90000 // 1.5 минуты
  },
  LEGAL: {
    model: OPENAI_CONFIG.MODEL,
    max_tokens: 4000,
    temperature: 0.5, // Более консервативная температура для юридических документов
    timeout: 100000 // 1 минута 40 секунд
  }
};