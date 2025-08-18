# Система экспорта видео из кеша

## Обзор

Система экспорта видео была обновлена для работы аналогично системе экспорта изображений. Теперь видео экспортируются из кеша IndexedDB с использованием метаданных, сохраненных в localStorage.

## Как это работает

### 1. Сохранение видео в кеш

При загрузке видео в HeroEditor:

```javascript
// В HeroEditor.jsx
const processVideo = async (file) => {
  // ... обработка файла ...
  
  // Сохранение в кэш
  await videoCacheService.saveVideo(filename, file);
  
  // Сохранение метаданных
  const videoMetadata = {
    filename,
    type: file.type,
    size: file.size,
    lastModified: new Date().toISOString()
  };
  
  await videoCacheService.saveMetadata('heroVideoMetadata', videoMetadata);
};
```

### 2. Экспорт из кеша

При экспорте сайта в `siteExporter.js`:

```javascript
// Получаем метаданные видео из localStorage
const videoMetadata = JSON.parse(localStorage.getItem('heroVideoMetadata') || '{}');

if (videoMetadata.filename) {
  // Получаем видео из кэша по имени файла из метаданных
  const videoFile = await videoCacheService.getVideo(videoMetadata.filename);
  if (videoFile) {
    videosDir.file(videoMetadata.filename, videoFile);
    assetsDir.file(videoMetadata.filename, videoFile);
  }
}
```

### 3. Экспорт дополнительных видео

Система также автоматически экспортирует все дополнительные видео из кеша:

```javascript
// Получаем все видео из кэша
const allVideos = await videoCacheService.getAllVideos();

// Фильтруем hero видео (уже обработано)
const otherVideos = allVideos.filter(video => 
  video.key !== 'hero.mp4' && video.key !== 'hero'
);

// Экспортируем каждое видео
for (const video of otherVideos) {
  videosDir.file(video.key, video.value);
  assetsDir.file(video.key, video.value);
}
```

## Структура файлов

### В экспортируемом архиве:

```
site-export.zip
├── assets/
│   ├── videos/
│   │   ├── hero.mp4 (или другое имя из метаданных)
│   │   ├── additional-video.mp4
│   │   ├── VIDEO-EXPORT-SUCCESS.txt
│   │   └── ADDITIONAL-VIDEOS-EXPORT.txt
│   ├── hero.mp4 (дублируется в корне assets для совместимости)
│   └── additional-video.mp4
└── index.html
```

### Файлы информации:

- **VIDEO-EXPORT-SUCCESS.txt** - информация об успешном экспорте hero видео
- **ADDITIONAL-VIDEOS-EXPORT.txt** - список всех дополнительных видео
- **README-VIDEO.txt** - инструкции по ручному добавлению (если видео не найдено)
- **VIDEO-EXPORT-ERROR.txt** - информация об ошибках экспорта

## API сервисов

### VideoCacheService

```javascript
// Основные методы
await videoCacheService.saveVideo(key, file);
await videoCacheService.getVideo(key);
await videoCacheService.deleteVideo(key);

// Новые методы для экспорта
await videoCacheService.getAllVideos();        // Все видео с ключами
await videoCacheService.getAllVideoKeys();     // Только ключи
await videoCacheService.getCacheSize();        // Размер кеша
await videoCacheService.clearCache();          // Очистка кеша

// Метаданные
await videoCacheService.saveMetadata(key, metadata);
videoCacheService.getMetadata(key);
videoCacheService.deleteMetadata(key);
```

### ImageCacheService

```javascript
// Аналогичные методы для изображений
await imageCacheService.getAllImages();
await imageCacheService.getAllImageKeys();
await imageCacheService.getCacheSize();
await imageCacheService.clearCache();
```

## Преимущества новой системы

1. **Консистентность** - видео экспортируются так же, как изображения
2. **Надежность** - использование метаданных для точного поиска файлов
3. **Автоматизация** - все видео из кеша экспортируются автоматически
4. **Отказоустойчивость** - fallback на стандартные имена файлов
5. **Информативность** - подробные логи и файлы с информацией об экспорте

## Обработка ошибок

Система включает несколько уровней обработки ошибок:

1. **Проверка метаданных** - если метаданные не найдены
2. **Fallback на стандартные имена** - попытка найти видео по стандартному имени
3. **Инструкции по ручному добавлению** - если видео не найдено автоматически
4. **Подробные логи** - для отладки проблем

## Пример использования

```javascript
// В HeroEditor
const handleVideoSelect = async (event) => {
  const file = event.target.files[0];
  const { url, filename, file: videoFile } = await processVideo(file);
  
  // Видео автоматически сохраняется в кеш с метаданными
  // При экспорте сайта оно будет автоматически включено в архив
};
```

## Совместимость

Система полностью совместима с существующим кодом и добавляет новую функциональность без нарушения работы старых функций.
