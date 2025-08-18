// Отладка экспорта видео - запустите в консоли браузера
console.log('🔍 ОТЛАДКА ЭКСПОРТА ВИДЕО');

// 1. Проверяем доступность сервисов
console.log('\n1️⃣ Проверка сервисов:');
console.log('videoCacheService доступен:', typeof videoCacheService !== 'undefined');
console.log('imageCacheService доступен:', typeof imageCacheService !== 'undefined');

// 2. Проверяем localStorage
console.log('\n2️⃣ Проверка localStorage:');
const allKeys = Object.keys(localStorage);
console.log('Все ключи localStorage:', allKeys);

const videoKeys = allKeys.filter(key => key.includes('video') || key.includes('Video'));
console.log('Ключи связанные с видео:', videoKeys);

videoKeys.forEach(key => {
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value);
});

// 3. Проверяем IndexedDB
console.log('\n3️⃣ Проверка IndexedDB:');
if (typeof videoCacheService !== 'undefined') {
  videoCacheService.getAllVideos().then(videos => {
    console.log('Все видео в кеше:', videos);
    console.log('Количество видео:', videos.length);
    
    if (videos.length > 0) {
      videos.forEach((video, index) => {
        console.log(`Видео ${index + 1}:`, {
          key: video.key,
          size: video.size,
          type: video.type,
          hasValue: !!video.value,
          hasBlob: !!video.blob
        });
      });
    } else {
      console.log('❌ В кеше нет видео!');
    }
  }).catch(error => {
    console.error('❌ Ошибка при получении видео из кеша:', error);
  });
  
  // Проверяем размер кеша
  videoCacheService.getCacheSize().then(size => {
    console.log('Размер кеша видео:', size, 'байт');
  }).catch(error => {
    console.error('❌ Ошибка при получении размера кеша:', error);
  });
} else {
  console.log('❌ videoCacheService недоступен!');
}

// 4. Проверяем изображения для сравнения
console.log('\n4️⃣ Проверка изображений для сравнения:');
if (typeof imageCacheService !== 'undefined') {
  imageCacheService.getAllImages().then(images => {
    console.log('Все изображения в кеше:', images);
    console.log('Количество изображений:', images.length);
  }).catch(error => {
    console.error('❌ Ошибка при получении изображений из кеша:', error);
  });
} else {
  console.log('❌ imageCacheService недоступен!');
}

// 5. Создаем тестовые данные если их нет
console.log('\n5️⃣ Создание тестовых данных:');
const heroVideoMetadata = localStorage.getItem('heroVideoMetadata');
if (!heroVideoMetadata) {
  console.log('⚠️ Метаданные видео не найдены, создаем тестовые...');
  
  const testMetadata = {
    filename: 'test-video.mp4',
    type: 'video/mp4',
    size: 1024 * 1024,
    lastModified: new Date().toISOString()
  };
  
  localStorage.setItem('heroVideoMetadata', JSON.stringify(testMetadata));
  console.log('✅ Тестовые метаданные созданы:', testMetadata);
} else {
  console.log('✅ Метаданные видео уже есть:', heroVideoMetadata);
}

console.log('\n🎉 Отладка завершена! Проверьте результаты выше.');
