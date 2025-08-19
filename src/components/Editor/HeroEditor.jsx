import React, { useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  IconButton,
  Stack,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Collapse,
  Divider,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ColorPicker from '../ColorPicker/ColorPicker';
import { styled } from '@mui/material/styles';
import imageCompression from 'browser-image-compression';
import { imageCacheService } from '../../utils/imageCacheService';
import { videoCacheService } from '../../utils/videoCacheService';
import { videoProcessor } from '../../utils/videoProcessor';

// Функция для очистки медиафайлов hero из кэша
const clearHeroMediaFromCache = async (...mediaTypes) => {
  for (const mediaType of mediaTypes) {
    try {
      if (mediaType === 'image') {
        const metadata = JSON.parse(localStorage.getItem('heroImageMetadata') || '{}');
        if (metadata.filename) {
          await imageCacheService.deleteImage(metadata.filename);
          console.log(`🗑️ Удален hero image из кэша: ${metadata.filename}`);
        }
        localStorage.removeItem('heroImageMetadata');
      } else if (mediaType === 'video') {
        const metadata = JSON.parse(localStorage.getItem('heroVideoMetadata') || '{}');
        if (metadata.filename) {
          await videoCacheService.deleteVideo(metadata.filename);
          console.log(`🗑️ Удален hero video из кэша: ${metadata.filename}`);
        }
        localStorage.removeItem('heroVideoMetadata');
      } else if (mediaType === 'gif') {
        const metadata = JSON.parse(localStorage.getItem('heroGifMetadata') || '{}');
        if (metadata.filename) {
          await imageCacheService.deleteImage(metadata.filename);
          console.log(`🗑️ Удален hero GIF из кэша: ${metadata.filename}`);
        }
        localStorage.removeItem('heroGifMetadata');
      }
    } catch (error) {
      console.error(`❌ Ошибка при удалении ${mediaType} из кэша:`, error);
    }
  }
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const HERO_BACKGROUND_TYPES = {
  SOLID: 'solid',
  GRADIENT: 'gradient',
  IMAGE: 'image',
  VIDEO: 'video',
  GIF: 'gif'
};

const HERO_BACKGROUND_LABELS = {
  [HERO_BACKGROUND_TYPES.SOLID]: 'Сплошной цвет',
  [HERO_BACKGROUND_TYPES.GRADIENT]: 'Градиент',
  [HERO_BACKGROUND_TYPES.IMAGE]: 'Изображение',
  [HERO_BACKGROUND_TYPES.VIDEO]: 'Видео',
  [HERO_BACKGROUND_TYPES.GIF]: 'GIF'
};

const ANIMATION_TYPES = {
  NONE: 'none',
  ZOOM: 'zoom',
  PAN: 'pan',
  FADE: 'fade',
  PULSE: 'pulse'
};

const ANIMATION_LABELS = {
  [ANIMATION_TYPES.NONE]: 'Без анимации',
  [ANIMATION_TYPES.ZOOM]: 'Масштабирование',
  [ANIMATION_TYPES.PAN]: 'Панорамирование',
  [ANIMATION_TYPES.FADE]: 'Затухание',
  [ANIMATION_TYPES.PULSE]: 'Пульсация'
};

const HeroEditor = ({ heroData = {}, onHeroChange, expanded, onToggle }) => {
  const defaultHeroData = {
    title: 'Добро пожаловать',
    subtitle: 'Наш сайт предлагает лучшие решения',
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    gradientColor1: '#ffffff',
    gradientColor2: '#f5f5f5',
    gradientDirection: 'to right',
    backgroundImage: '',
    backgroundVideo: '',
    backgroundGif: '',
    titleColor: '#000000',
    subtitleColor: '#666666',
    animationType: 'none',
    enableOverlay: false,
    overlayOpacity: 0.1,
    enableBlur: false,
    blurAmount: 0.1,
    // Новые настройки для видео
    videoAutoplay: true,
    videoLoop: true,
    videoMuted: true,
    videoControls: false
  };

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const gifInputRef = useRef(null);

  const handleChange = (field, value) => {
    if (field === 'backgroundImage' && value) {
      // Убедимся, что URL начинается с /assets/images/
      if (!value.startsWith('/assets/images/')) {
        console.warn('Image URL should start with /assets/images/');
        value = `/assets/images/${value}`;
      }
    }

    // Очищаем другие поля при смене типа фона
    let updatedData = {
      ...defaultHeroData,
      ...heroData,
      [field]: value
    };

    if (field === 'backgroundType') {
      if (value === 'image') {
        updatedData.backgroundVideo = '';
        updatedData.backgroundGif = '';
        // Очищаем метаданные и файлы видео и GIF
        clearHeroMediaFromCache('video', 'gif');
      } else if (value === 'video') {
        updatedData.backgroundImage = '';
        updatedData.backgroundGif = '';
        // Очищаем метаданные и файлы изображения и GIF
        clearHeroMediaFromCache('image', 'gif');
      } else if (value === 'gif') {
        updatedData.backgroundImage = '';
        updatedData.backgroundVideo = '';
        // Очищаем метаданные и файлы изображения и видео
        clearHeroMediaFromCache('image', 'video');
      } else if (value === 'solid' || value === 'gradient') {
        // При выборе сплошного цвета или градиента очищаем все медиафайлы
        updatedData.backgroundImage = '';
        updatedData.backgroundVideo = '';
        updatedData.backgroundGif = '';
        clearHeroMediaFromCache('image', 'video', 'gif');
      }
    }

    onHeroChange(updatedData);

    // Обновление превью при изменении настроек
    const previewHero = document.querySelector('#hero');
    if (previewHero) {
      // Очистка превью при смене типа фона
      if (field === 'backgroundType') {
        const heroVideo = previewHero.querySelector('.hero-video');
        const heroGif = previewHero.querySelector('.hero-gif');
        const heroImage = previewHero.querySelector('.hero-background');
        
        if (value === 'image') {
          if (heroVideo) heroVideo.remove();
          if (heroGif) heroGif.remove();
        } else if (value === 'video') {
          if (heroImage) heroImage.remove();
          if (heroGif) heroGif.remove();
        } else if (value === 'gif') {
          if (heroVideo) heroVideo.remove();
          if (heroImage) heroImage.remove();
        }
        
        // Сбрасываем фоновое изображение
        previewHero.style.backgroundImage = 'none';
      }

      // Обновление размытия
      const heroOverlay = previewHero.querySelector('.hero-overlay');
      if (heroOverlay) {
        if (field === 'enableBlur') {
          heroOverlay.style.backdropFilter = value ? `blur(${heroData.blurAmount || 0.1}px)` : 'none';
        } else if (field === 'blurAmount') {
          heroOverlay.style.backdropFilter = heroData.enableBlur ? `blur(${value}px)` : 'none';
        }
      }

      // Обновление оверлея
      if (field === 'enableOverlay') {
        if (value) {
          if (!heroOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'hero-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.zIndex = '1';
            overlay.style.pointerEvents = 'none'; // Чтобы оверлей не блокировал взаимодействие
            previewHero.style.position = 'relative'; // Убедимся, что hero имеет position: relative
            previewHero.appendChild(overlay);
          }
        } else if (heroOverlay) {
          heroOverlay.remove();
        }
      } else if (field === 'overlayOpacity' && heroOverlay) {
        heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${value / 100})`;
      }
    }
  };

  const processImage = async (file) => {
    try {
      // Сжатие изображения
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

      // Конвертация в Blob
      const blob = new Blob([compressedFile], { type: 'image/jpeg' });
      
      // Всегда используем hero.jpg как имя файла
      const filename = 'hero.jpg';

      // Сохранение в кэш
      await imageCacheService.saveImage(filename, blob);

      // Создание URL для превью
      const url = URL.createObjectURL(blob);

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: 'image/jpeg',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в кэш
      await imageCacheService.saveMetadata('heroImageMetadata', imageMetadata);
      console.log('✓ Метаданные hero изображения сохранены в кэш:', imageMetadata);

      return { url, filename, blob };
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Очищаем предыдущие медиафайлы перед загрузкой нового изображения
      await clearHeroMediaFromCache('video', 'gif');
      
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      const { url, filename, blob } = await processImage(file);

      // Обновление данных hero
      handleChange('backgroundImage', `/assets/images/${filename}`);

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: file.type,
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в кэш вместо localStorage
      await imageCacheService.saveMetadata('heroImageMetadata', imageMetadata);
      console.log('✓ Метаданные hero изображения сохранены в кэш:', imageMetadata);

      // Показ уведомления
      alert('Изображение успешно обработано и сохранено в кэш');

      // Принудительное обновление превью
      const heroImage = document.querySelector('.hero-background');
      if (heroImage) {
        heroImage.style.backgroundImage = `url(${url})`;
      }

      // Обновление превью на странице
      const previewHero = document.querySelector('#hero');
      if (previewHero) {
        // Обновляем фоновое изображение
        previewHero.style.backgroundImage = `url(${url})`;
        
        // Создаем или обновляем оверлей
        let heroOverlay = previewHero.querySelector('.hero-overlay');
        if (!heroOverlay) {
          heroOverlay = document.createElement('div');
          heroOverlay.className = 'hero-overlay';
          heroOverlay.style.position = 'absolute';
          heroOverlay.style.top = '0';
          heroOverlay.style.left = '0';
          heroOverlay.style.right = '0';
          heroOverlay.style.bottom = '0';
          heroOverlay.style.zIndex = '1';
          heroOverlay.style.pointerEvents = 'none'; // Чтобы оверлей не блокировал взаимодействие
          previewHero.style.position = 'relative'; // Убедимся, что hero имеет position: relative
          previewHero.appendChild(heroOverlay);
        }

        // Применяем размытие и оверлей
        if (heroData.enableBlur) {
          heroOverlay.style.backdropFilter = `blur(${heroData.blurAmount || 0.1}px)`;
        } else {
          heroOverlay.style.backdropFilter = 'none';
        }

        if (heroData.enableOverlay) {
          heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${heroData.overlayOpacity / 100})`;
        } else {
          heroOverlay.style.backgroundColor = 'transparent';
        }
      }

      // Принудительное обновление компонента
      setTimeout(() => {
        const event = new CustomEvent('heroImageUpdated', {
          detail: { 
            imageUrl: url,
            blur: heroData.enableBlur ? heroData.blurAmount : 0,
            overlay: heroData.enableOverlay ? heroData.overlayOpacity : 0
          }
        });
        window.dispatchEvent(event);
      }, 100);
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Ошибка при обработке изображения: ' + error.message);
    }
  };

  const processVideo = async (file) => {
    try {
      // Проверяем размер видео (максимум 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Размер видео не должен превышать 50MB');
      }

      // Проверяем формат видео
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Поддерживаются только форматы: MP4, WebM, OGG');
      }

      // Показываем уведомление о начале обработки
      console.log('🎬 Начинаю обработку видео для удаления постбека...');
      
      // Обрабатываем видео для удаления постбека (если включено)
      let processedVideo = file;
      if (heroData.videoRemovePostback !== false) {
        try {
          console.log('🎬 Применяю настройки обрезки постбека...');
          
          const cropOptions = {
            cropBottom: heroData.videoCropBottom !== false ? 80 : 0,
            cropRight: heroData.videoCropRight !== false ? 80 : 0,
            cropTop: heroData.videoCropTop !== false ? 0 : 0,
            cropLeft: 0
          };
          
          processedVideo = await videoProcessor.processVideoForPostback(file, cropOptions);
          console.log('✅ Постбек успешно удален из видео с настройками:', cropOptions);
        } catch (processingError) {
          console.warn('⚠️ Не удалось обработать видео, используем оригинал:', processingError);
          processedVideo = file;
        }
      } else {
        console.log('ℹ️ Обработка постбека отключена, используем оригинальное видео');
      }

      // Всегда используем hero.mp4 как имя файла
      const filename = 'hero.mp4';

      // Сохранение обработанного видео в кэш
      await videoCacheService.saveVideo(filename, processedVideo);

      // Создание URL для превью
      const url = URL.createObjectURL(processedVideo);

      // Сохранение метаданных видео
      const videoMetadata = {
        filename,
        type: processedVideo.type,
        size: processedVideo.size,
        lastModified: new Date().toISOString(),
        originalSize: file.size,
        processed: processedVideo !== file
      };

      // Сохранение метаданных в кэш
      await videoCacheService.saveMetadata('heroVideoMetadata', videoMetadata);
      console.log('✓ Метаданные hero видео сохранены в кэш:', videoMetadata);

      return { url, filename, file: processedVideo };
    } catch (error) {
      console.error('Ошибка при обработке видео:', error);
      throw error;
    }
  };

  const handleVideoSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Очищаем предыдущие медиафайлы перед загрузкой нового видео
      await clearHeroMediaFromCache('image', 'gif');
      
      // Проверка формата
      if (!file.type.startsWith('video/')) {
        throw new Error('Пожалуйста, выберите видео файл');
      }

      const { url, filename, file: videoFile } = await processVideo(file);

      // Обновление данных hero
      handleChange('backgroundVideo', `/assets/videos/${filename}`);

      // Показ уведомления
      alert('Видео успешно обработано и сохранено в кэш');

      // Принудительное обновление превью
      const previewHero = document.querySelector('#hero');
      if (previewHero) {
        // Создаем или обновляем видео элемент
        let heroVideo = previewHero.querySelector('.hero-video');
        if (!heroVideo) {
          heroVideo = document.createElement('video');
          heroVideo.className = 'hero-video';
          heroVideo.style.position = 'absolute';
          heroVideo.style.top = '0';
          heroVideo.style.left = '0';
          heroVideo.style.width = '100%';
          heroVideo.style.height = '100%';
          heroVideo.style.objectFit = 'cover';
          heroVideo.style.zIndex = '1';
          previewHero.appendChild(heroVideo);
        }

        // Обновляем источник видео
        heroVideo.src = url;
        heroVideo.autoplay = heroData.videoAutoplay || true;
        heroVideo.loop = heroData.videoLoop || true;
        heroVideo.muted = heroData.videoMuted || true;
        heroVideo.controls = heroData.videoControls || false;

        // Создаем или обновляем оверлей
        let heroOverlay = previewHero.querySelector('.hero-overlay');
        if (!heroOverlay) {
          heroOverlay = document.createElement('div');
          heroOverlay.className = 'hero-overlay';
          heroOverlay.style.position = 'absolute';
          heroOverlay.style.top = '0';
          heroOverlay.style.left = '0';
          heroOverlay.style.right = '0';
          heroOverlay.style.bottom = '0';
          heroOverlay.style.zIndex = '2';
          heroOverlay.style.pointerEvents = 'none';
          previewHero.style.position = 'relative';
          previewHero.appendChild(heroOverlay);
        }

        // Применяем размытие и оверлей
        if (heroData.enableBlur) {
          heroOverlay.style.backdropFilter = `blur(${heroData.blurAmount || 0.1}px)`;
        } else {
          heroOverlay.style.backdropFilter = 'none';
        }

        if (heroData.enableOverlay) {
          heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${heroData.overlayOpacity / 100})`;
        } else {
          heroOverlay.style.backgroundColor = 'transparent';
        }
      }

      // Принудительное обновление компонента
      setTimeout(() => {
        const event = new CustomEvent('heroVideoUpdated', {
          detail: { 
            videoUrl: url,
            blur: heroData.enableBlur ? heroData.blurAmount : 0,
            overlay: heroData.enableOverlay ? heroData.overlayOpacity : 0
          }
        });
        window.dispatchEvent(event);
      }, 100);
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error);
      alert('Ошибка при обработке видео: ' + error.message);
    }
  };

  const handleGifSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Очищаем предыдущие медиафайлы перед загрузкой нового GIF
      await clearHeroMediaFromCache('image', 'video');
      
      // Проверка формата
      if (file.type !== 'image/gif') {
        throw new Error('Пожалуйста, выберите GIF файл');
      }

      // Проверка размера (максимум 10MB для GIF)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Размер GIF не должен превышать 10MB');
      }

      // Всегда используем hero.gif как имя файла
      const filename = 'hero.gif';

      // Сохранение в кэш изображений (GIF это тоже изображение)
      await imageCacheService.saveImage(filename, file);

      // Создание URL для превью
      const url = URL.createObjectURL(file);

      // Обновление данных hero
      handleChange('backgroundGif', `/assets/images/${filename}`);

      // Сохранение метаданных GIF
      const gifMetadata = {
        filename,
        type: file.type,
        size: file.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в кэш
      await imageCacheService.saveMetadata('heroGifMetadata', gifMetadata);

      // Показ уведомления
      alert('GIF успешно обработан и сохранен в кэш');

      // Принудительное обновление превью
      const previewHero = document.querySelector('#hero');
      if (previewHero) {
        // Создаем или обновляем GIF элемент
        let heroGif = previewHero.querySelector('.hero-gif');
        if (!heroGif) {
          heroGif = document.createElement('img');
          heroGif.className = 'hero-gif';
          heroGif.style.position = 'absolute';
          heroGif.style.top = '0';
          heroGif.style.left = '0';
          heroGif.style.width = '100%';
          heroGif.style.height = '100%';
          heroGif.style.objectFit = 'cover';
          heroGif.style.zIndex = '1';
          previewHero.appendChild(heroGif);
        }

        // Обновляем источник GIF
        heroGif.src = url;

        // Создаем или обновляем оверлей
        let heroOverlay = previewHero.querySelector('.hero-overlay');
        if (!heroOverlay) {
          heroOverlay = document.createElement('div');
          heroOverlay.className = 'hero-overlay';
          heroOverlay.style.position = 'absolute';
          heroOverlay.style.top = '0';
          heroOverlay.style.left = '0';
          heroOverlay.style.right = '0';
          heroOverlay.style.bottom = '0';
          heroOverlay.style.zIndex = '2';
          heroOverlay.style.pointerEvents = 'none';
          previewHero.style.position = 'relative';
          previewHero.appendChild(heroOverlay);
        }

        // Применяем размытие и оверлей
        if (heroData.enableBlur) {
          heroOverlay.style.backdropFilter = `blur(${heroData.blurAmount || 0.1}px)`;
        } else {
          heroOverlay.style.backdropFilter = 'none';
        }

        if (heroData.enableOverlay) {
          heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${heroData.overlayOpacity / 100})`;
        } else {
          heroOverlay.style.backgroundColor = 'transparent';
        }
      }

      // Принудительное обновление компонента
      setTimeout(() => {
        const event = new CustomEvent('heroGifUpdated', {
          detail: { 
            gifUrl: url,
            blur: heroData.enableBlur ? heroData.blurAmount : 0,
            overlay: heroData.enableOverlay ? heroData.overlayOpacity : 0
          }
        });
        window.dispatchEvent(event);
      }, 100);
    } catch (error) {
      console.error('Ошибка при загрузке GIF:', error);
      alert('Ошибка при обработке GIF: ' + error.message);
    }
  };

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 2,
      backgroundColor: '#f0fff0'
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={onToggle}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Настройка hero
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ cursor: 'pointer' }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ExpandMore>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Основные настройки</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Заголовок"
              value={heroData.title || defaultHeroData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Подзаголовок"
              value={heroData.subtitle || defaultHeroData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет заголовка"
              type="color"
              value={heroData.titleColor || defaultHeroData.titleColor}
              onChange={(e) => handleChange('titleColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет подзаголовка"
              type="color"
              value={heroData.subtitleColor || defaultHeroData.subtitleColor}
              onChange={(e) => handleChange('subtitleColor', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки фона</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Тип фона</InputLabel>
              <Select
                value={heroData.backgroundType || defaultHeroData.backgroundType}
                label="Тип фона"
                onChange={(e) => handleChange('backgroundType', e.target.value)}
              >
                <MenuItem value="solid">Сплошной цвет</MenuItem>
                <MenuItem value="gradient">Градиент</MenuItem>
                <MenuItem value="image">Изображение</MenuItem>
                <MenuItem value="video">Видео</MenuItem>
                <MenuItem value="gif">GIF</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {heroData.backgroundType === 'solid' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Цвет фона"
                type="color"
                value={heroData.backgroundColor || defaultHeroData.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
            </Grid>
          )}

          {heroData.backgroundType === 'gradient' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Цвет 1"
                  type="color"
                  value={heroData.gradientColor1 || defaultHeroData.gradientColor1}
                  onChange={(e) => handleChange('gradientColor1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Цвет 2"
                  type="color"
                  value={heroData.gradientColor2 || defaultHeroData.gradientColor2}
                  onChange={(e) => handleChange('gradientColor2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Направление градиента</InputLabel>
                  <Select
                    value={heroData.gradientDirection || defaultHeroData.gradientDirection}
                    label="Направление градиента"
                    onChange={(e) => handleChange('gradientDirection', e.target.value)}
                  >
                    <MenuItem value="to right">Слева направо</MenuItem>
                    <MenuItem value="to left">Справа налево</MenuItem>
                    <MenuItem value="to bottom">Сверху вниз</MenuItem>
                    <MenuItem value="to top">Снизу вверх</MenuItem>
                    <MenuItem value="to bottom right">По диагонали</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {heroData.backgroundType === 'image' && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => fileInputRef.current.click()}
                  sx={{ minWidth: '200px' }}
                >
                  Выбрать изображение
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </Box>
            </Grid>
          )}

          {heroData.backgroundType === 'video' && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Button
                  variant="contained"
                  startIcon={<VideoLibraryIcon />}
                  onClick={() => videoInputRef.current.click()}
                  sx={{ minWidth: '200px' }}
                >
                  Выбрать видео
                </Button>
                <input
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  ref={videoInputRef}
                  onChange={handleVideoSelect}
                />
              </Box>
              
                              {/* Настройки видео */}
              <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Настройки видео</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={heroData.videoAutoplay || true}
                        onChange={(e) => handleChange('videoAutoplay', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Автовоспроизведение"
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '0.875rem',
                        fontWeight: 500
                      } 
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={heroData.videoLoop || true}
                        onChange={(e) => handleChange('videoLoop', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Зацикливание"
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '0.875rem',
                        fontWeight: 500
                      } 
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={heroData.videoMuted || true}
                        onChange={(e) => handleChange('videoMuted', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Без звука"
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '0.875rem',
                        fontWeight: 500
                      } 
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={heroData.videoControls || false}
                        onChange={(e) => handleChange('videoControls', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Показывать контролы"
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '0.875rem',
                        fontWeight: 500
                      } 
                    }}
                  />
                </Box>
                
                {/* Настройки обработки постбека */}
                <Box sx={{ 
                  mt: 3, 
                  p: 2.5, 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 1.5,
                  border: '1px solid #e3f2fd'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: 2, 
                    color: '#1976d2',
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    🎬 Обработка постбека (логотипа)
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mb: 2.5, 
                    color: '#555',
                    fontSize: '0.875rem',
                    lineHeight: 1.4
                  }}>
                    Автоматически удаляет логотипы и водяные знаки из видео при экспорте сайта
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={heroData.videoRemovePostback !== false}
                          onChange={(e) => handleChange('videoRemovePostback', e.target.checked)}
                          size="small"
                          color="primary"
                        />
                      }
                      label="Удалять постбек автоматически"
                      sx={{ 
                        '& .MuiFormControlLabel-label': { 
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#1976d2'
                        } 
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={heroData.videoCropBottom !== false}
                          onChange={(e) => handleChange('videoCropBottom', e.target.checked)}
                          size="small"
                          color="primary"
                        />
                      }
                      label="Обрезать снизу (80px)"
                      sx={{ 
                        '& .MuiFormControlLabel-label': { 
                          fontSize: '0.875rem',
                          fontWeight: 500
                        } 
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={heroData.videoCropRight !== false}
                          onChange={(e) => handleChange('videoCropRight', e.target.checked)}
                          size="small"
                          color="primary"
                        />
                      }
                      label="Обрезать справа (80px)"
                      sx={{ 
                        '& .MuiFormControlLabel-label': { 
                          fontSize: '0.875rem',
                          fontWeight: 500
                        } 
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={heroData.videoCropTop !== false}
                          onChange={(e) => handleChange('videoCropTop', e.target.checked)}
                          size="small"
                          color="primary"
                        />
                      }
                      label="Обрезать сверху (0px)"
                      sx={{ 
                        '& .MuiFormControlLabel-label': { 
                          fontSize: '0.875rem',
                          fontWeight: 500
                        } 
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    mt: 2.5, 
                    p: 1.5, 
                    backgroundColor: '#e8f4fd', 
                    borderRadius: 1,
                    border: '1px solid #bbdefb'
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: '#1565c0',
                      fontSize: '0.8rem',
                      lineHeight: 1.3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      💡 Совет: Настройки обрезки применяются только при экспорте сайта. 
                      В превью показывается оригинальное видео.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}

          {heroData.backgroundType === 'gif' && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => gifInputRef.current.click()}
                  sx={{ minWidth: '200px' }}
                >
                  Выбрать GIF
                </Button>
                <input
                  type="file"
                  accept="image/gif"
                  style={{ display: 'none' }}
                  ref={gifInputRef}
                  onChange={handleGifSelect}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt:2 }}>Настройки изображения</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ mr: 2 }}>Наложение</Typography>
              <FormControl size="small">
                <Select
                  value={heroData.enableOverlay ? 'true' : 'false'}
                  onChange={(e) => handleChange('enableOverlay', e.target.value === 'true')}
                >
                  <MenuItem value="true">Включено</MenuItem>
                  <MenuItem value="false">Выключено</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {heroData.enableOverlay && (
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Прозрачность наложения</Typography>
                <Slider
                  value={heroData.overlayOpacity || 0.1}
                  onChange={(e, value) => handleChange('overlayOpacity', value)}
                  min={0.1}
                  max={100}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1%' },
                    { value: 20, label: '20%' },
                    { value: 40, label: '40%' },
                    { value: 60, label: '60%' },
                    { value: 80, label: '80%' },
                    { value: 100, label: '100%' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  sx={{
                    mt: 2,
                    mb: 3,
                    '& .MuiSlider-mark': {
                      height: 8,
                      width: 2,
                      backgroundColor: '#1976d2',
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 500,
                      marginTop: '8px',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      width: 'auto',
                      textAlign: 'center',
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: '#1976d2',
                    }
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ mr: 2 }}>Размытие</Typography>
              <FormControl size="small">
                <Select
                  value={heroData.enableBlur ? 'true' : 'false'}
                  onChange={(e) => handleChange('enableBlur', e.target.value === 'true')}
                >
                  <MenuItem value="true">Включено</MenuItem>
                  <MenuItem value="false">Выключено</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {heroData.enableBlur && (
              <Box>
                <Typography gutterBottom>Интенсивность размытия</Typography>
                <Slider
                  value={heroData.blurAmount || 0.1}
                  onChange={(e, value) => handleChange('blurAmount', value)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1' },
                    { value: 1, label: '1' },
                    { value: 3, label: '3' },
                    { value: 6, label: '6' },
                    { value: 10, label: '10' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                  sx={{
                    mt: 2,
                    mb: 3,
                    '& .MuiSlider-mark': {
                      height: 8,
                      width: 2,
                      backgroundColor: '#1976d2',
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 500,
                      marginTop: '8px',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      width: 'auto',
                      textAlign: 'center',
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: '#1976d2',
                    }
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Тип анимации</InputLabel>
              <Select
                value={heroData.animationType || defaultHeroData.animationType}
                label="Тип анимации"
                onChange={(e) => handleChange('animationType', e.target.value)}
              >
                <MenuItem value="none">Без анимации</MenuItem>
                <MenuItem value="fade">Появление</MenuItem>
                <MenuItem value="slide">Слайд</MenuItem>
                <MenuItem value="zoom">Увеличение</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default HeroEditor; 