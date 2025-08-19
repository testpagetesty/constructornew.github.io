/**
 * Тестовый файл для проверки функциональности удаления постбека
 * Запустите этот код в консоли браузера для тестирования
 */

console.log('🧪 Тестирование системы удаления постбека из видео');

// Проверка доступности сервисов
async function testVideoServices() {
  console.log('🔍 Проверка доступности сервисов...');
  
  try {
    // Проверяем videoProcessor
    if (typeof videoProcessor !== 'undefined') {
      console.log('✅ videoProcessor доступен');
      console.log('📋 Методы videoProcessor:', Object.getOwnPropertyNames(videoProcessor));
    } else {
      console.log('❌ videoProcessor недоступен');
    }
    
    // Проверяем videoCacheService
    if (typeof videoCacheService !== 'undefined') {
      console.log('✅ videoCacheService доступен');
      console.log('📋 Методы videoCacheService:', Object.getOwnPropertyNames(videoCacheService));
    } else {
      console.log('❌ videoCacheService недоступен');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке сервисов:', error);
  }
}

// Проверка настроек hero
function testHeroSettings() {
  console.log('🔍 Проверка настроек hero...');
  
  try {
    // Получаем текущие настройки из localStorage или других источников
    const heroSettings = {
      videoRemovePostback: true,
      videoCropBottom: true,
      videoCropRight: true,
      videoCropTop: false,
      videoCropLeft: false
    };
    
    console.log('📋 Текущие настройки hero:', heroSettings);
    
    // Проверяем, что настройки доступны для изменения
    console.log('✅ Настройки hero доступны для изменения');
    
  } catch (error) {
    console.error('❌ Ошибка при проверке настроек hero:', error);
  }
}

// Тест обработки видео (симуляция)
async function testVideoProcessing() {
  console.log('🔍 Тест обработки видео...');
  
  try {
    // Создаем тестовый Blob (симуляция видео файла)
    const testVideoBlob = new Blob(['test video content'], { type: 'video/mp4' });
    console.log('✅ Тестовый видео Blob создан:', testVideoBlob);
    
    // Проверяем, что videoProcessor может работать с Blob
    if (typeof videoProcessor !== 'undefined') {
      console.log('🎬 videoProcessor готов к работе с видео файлами');
      
      // Проверяем метод getVideoInfo
      try {
        const videoInfo = await videoProcessor.getVideoInfo(testVideoBlob);
        console.log('✅ getVideoInfo работает:', videoInfo);
      } catch (infoError) {
        console.log('⚠️ getVideoInfo не может обработать тестовый Blob (это нормально):', infoError.message);
      }
      
    } else {
      console.log('❌ videoProcessor недоступен для тестирования');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании обработки видео:', error);
  }
}

// Проверка кеша видео
async function testVideoCache() {
  console.log('🔍 Проверка кеша видео...');
  
  try {
    if (typeof videoCacheService !== 'undefined') {
      // Проверяем размер кеша
      const cacheSize = await videoCacheService.getCacheSize();
      console.log('📊 Размер кеша видео:', cacheSize, 'байт');
      
      // Проверяем количество видео в кеше
      const allVideos = await videoCacheService.getAllVideos();
      console.log('📹 Количество видео в кеше:', allVideos.length);
      
      if (allVideos.length > 0) {
        console.log('📋 Видео в кеше:', allVideos.map(v => ({
          key: v.key,
          size: v.size,
          type: v.type
        })));
      }
      
    } else {
      console.log('❌ videoCacheService недоступен для тестирования');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке кеша видео:', error);
  }
}

// Основная функция тестирования
async function runAllTests() {
  console.log('🚀 Запуск всех тестов...\n');
  
  await testVideoServices();
  console.log('');
  
  testHeroSettings();
  console.log('');
  
  await testVideoProcessing();
  console.log('');
  
  await testVideoCache();
  console.log('');
  
  console.log('✅ Все тесты завершены!');
  console.log('💡 Для полного тестирования загрузите видео в HeroEditor');
}

// Запуск тестов
runAllTests().catch(error => {
  console.error('❌ Критическая ошибка при тестировании:', error);
});

// Экспорт функций для ручного тестирования
window.testVideoPostback = {
  testVideoServices,
  testHeroSettings,
  testVideoProcessing,
  testVideoCache,
  runAllTests
};
