import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  IconButton,
  Grid,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  Slider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import ColorPicker from '../ColorPicker/ColorPicker';
import ConfigLoader from '../ConfigLoader/ConfigLoader';
import { styled } from '@mui/material/styles';
import imageCompression from 'browser-image-compression';
import { imageCacheService } from '../../utils/imageCacheService';
import { headerPresets } from '../../utils/headerPresets';

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

const HeaderEditor = ({ 
  headerData, 
  onHeaderChange,
  sectionsData,
  onSectionsChange,
  heroData,
  contactData,
  expanded,
  onToggle
}) => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);
  const [showLanguageWarning, setShowLanguageWarning] = useState(false);
  const [isDescriptionManuallyEdited, setIsDescriptionManuallyEdited] = useState(false);

  // Инициализация заголовка при первом рендере
  useEffect(() => {
    if (!headerData.title && headerData.siteName) {
      onHeaderChange({ ...headerData, title: headerData.siteName });
    }
  }, []);

  // Синхронизация описания с подзаголовком hero секции
  useEffect(() => {
    if (heroData?.subtitle && !isDescriptionManuallyEdited) {
      onHeaderChange({ ...headerData, description: heroData.subtitle });
    }
  }, [heroData?.subtitle, isDescriptionManuallyEdited]);

  // Проверка языка при размонтировании компонента
  useEffect(() => {
    return () => {
      const languageValue = typeof headerData.language === 'string' ? headerData.language.trim() : '';
      if (!languageValue) {
        setShowLanguageWarning(true);
        // Предотвращаем размонтирование, если язык не указан
        const event = new CustomEvent('preventNavigation', {
          detail: { message: 'Пожалуйста, укажите код языка перед сохранением' }
        });
        window.dispatchEvent(event);
      }
    };
  }, [headerData.language]);

  // Добавляем эффект для синхронизации выбранного пресета с текущими стилями
  useEffect(() => {
    if (headerData) {
      // Ищем пресет, который соответствует текущим стилям
      const matchingPreset = Object.entries(headerPresets).find(([_, preset]) => {
        return preset.titleColor === headerData.titleColor &&
               preset.backgroundColor === headerData.backgroundColor &&
               preset.linksColor === headerData.linksColor &&
               preset.siteBackgroundType === headerData.siteBackgroundType &&
               ((preset.siteBackgroundType === 'solid' && 
                 preset.siteBackgroundColor === headerData.siteBackgroundColor) ||
                (preset.siteBackgroundType === 'gradient' &&
                 preset.siteGradientColor1 === headerData.siteGradientColor1 &&
                 preset.siteGradientColor2 === headerData.siteGradientColor2 &&
                 preset.siteGradientDirection === headerData.siteGradientDirection));
      });

      if (matchingPreset) {
        setSelectedPreset(matchingPreset[0]);
      } else {
        setSelectedPreset('');
      }
    }
  }, [headerData]);

  const handleConfigLoaded = (config) => {
    if (config.header) {
      onHeaderChange(config.header);
    }
  };

  const handleSaveConfig = () => {
    const config = {
      header: headerData
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChange = (field, value) => {
    onHeaderChange({ ...headerData, [field]: value });

    // Обновление превью при изменении настроек
    const previewArea = document.querySelector('.preview-area');
    if (previewArea) {
      const backgroundImage = previewArea.querySelector('.background-image');
      if (backgroundImage) {
        if (field === 'siteBackgroundBlur') {
          backgroundImage.style.filter = `blur(${value}px)`;
        } else if (field === 'siteBackgroundDarkness') {
          const overlay = previewArea.querySelector('.site-overlay');
          if (overlay) {
            overlay.style.backgroundColor = `rgba(0, 0, 0, ${value / 100})`;
          }
        }
      }
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      console.log('Начало обработки файла:', file.name);
      
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Сжатие изображения
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

      // Конвертация в Blob
      const blob = new Blob([compressedFile], { type: 'image/jpeg' });
      
      // Всегда используем fon.jpg как имя файла
      const filename = 'fon.jpg';

      // Сохранение в кэш
      await imageCacheService.saveImage(filename, blob);

      // Создание URL для превью
      const imageUrl = URL.createObjectURL(blob);
      
      // Обновляем путь к изображению в данных шапки
      onHeaderChange({ 
        ...headerData, 
        siteBackgroundImage: `assets/images/${filename}`
      });

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: 'image/jpeg',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в кэш
      await imageCacheService.saveMetadata('siteBackgroundMetadata', imageMetadata);
      console.log('✓ Метаданные фонового изображения сохранены в кэш:', imageMetadata);

      // Показываем уведомление
      alert('Фоновое изображение успешно обработано и сохранено в кэш');

    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Ошибка при загрузке изображения: ' + error.message);
    }
  };

  const handleFaviconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Сжатие изображения
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1, // Favicon должен быть маленьким
        maxWidthOrHeight: 32, // Стандартный размер favicon
        useWebWorker: true
      });

      // Конвертация в Blob
      const blob = new Blob([compressedFile], { type: 'image/png' });
      
      // Всегда используем Favicon.png как имя файла
      const filename = 'Favicon.png';

      // Сохранение в кеш
      await imageCacheService.saveImage(filename, blob);

      // Создание URL для превью
      const imageUrl = URL.createObjectURL(blob);

      // Обновляем favicon в DOM
      const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
      faviconLink.type = 'image/png';
      faviconLink.rel = 'shortcut icon';
      faviconLink.href = imageUrl;
      document.getElementsByTagName('head')[0].appendChild(faviconLink);

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: 'image/png',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в localStorage
      localStorage.setItem('faviconMetadata', JSON.stringify(imageMetadata));

      // Показываем уведомление
      alert('Favicon успешно обработан и сохранен в кеш');
    } catch (error) {
      console.error('Ошибка при обработке favicon:', error);
      alert('Ошибка при обработке favicon: ' + error.message);
    }
  };

  // Проверка языка при попытке свернуть секцию
  const handleToggle = () => {
    // Если секция разворачивается, просто разворачиваем
    if (!expanded) {
      onToggle();
      return;
    }

    // Если секция сворачивается, проверяем язык
    const languageValue = typeof headerData.language === 'string' ? headerData.language.trim() : '';
    if (!languageValue) {
      setShowLanguageWarning(true);
      return;
    }
    setShowLanguageWarning(false);
    onToggle();
  };

  // Проверка языка при изменении
  const handleLanguageChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    // Проверяем, что введен корректный код языка (2 буквы)
    if (value.length <= 2 && /^[a-z]*$/.test(value)) {
      onHeaderChange({ 
        ...headerData, 
        language: value || null 
      });
      // Показываем предупреждение, если поле пустое
      setShowLanguageWarning(value === '');
    }
  };

  const handlePresetChange = (presetKey) => {
    if (!presetKey) {
      setSelectedPreset('');
      return;
    }

    setSelectedPreset(presetKey);
    const preset = headerPresets[presetKey];
    onHeaderChange({
      ...headerData,
      titleColor: preset.titleColor,
      backgroundColor: preset.backgroundColor,
      linksColor: preset.linksColor,
      siteBackgroundType: preset.siteBackgroundType,
      ...(preset.siteBackgroundType === 'solid' && {
        siteBackgroundColor: preset.siteBackgroundColor
      }),
      ...(preset.siteBackgroundType === 'gradient' && {
        siteGradientColor1: preset.siteGradientColor1,
        siteGradientColor2: preset.siteGradientColor2,
        siteGradientDirection: preset.siteGradientDirection
      })
    });
  };

  // Функция для синхронизации цветов бегущей строки с контактами
  const syncRunningLineWithContacts = () => {
    if (!contactData) return;

    const contactTitleColor = contactData.titleColor || '#1565c0';
    let contactBackgroundColor = contactData.backgroundColor || '#ffffff';

    // Если используется градиент, берем первый цвет
    if (contactData.backgroundType === 'gradient' && contactData.gradientColor1) {
      contactBackgroundColor = contactData.gradientColor1;
    }

    onHeaderChange({
      ...headerData,
      runningLine: {
        ...headerData.runningLine,
        textColor: contactTitleColor,
        backgroundColor: contactBackgroundColor,
        syncWithContacts: true
      }
    });
  };

  // Эффект для автоматической синхронизации при изменении contactData
  useEffect(() => {
    if (headerData.runningLine?.syncWithContacts && contactData) {
      syncRunningLineWithContacts();
    }
  }, [contactData?.titleColor, contactData?.backgroundColor, contactData?.gradientColor1, contactData?.backgroundType]);

  // Эффект для инициализации синхронизации при монтировании или изменении настроек
  useEffect(() => {
    if (headerData.runningLine?.syncWithContacts !== false && contactData && headerData.runningLine?.enabled) {
      setTimeout(() => {
        syncRunningLineWithContacts();
      }, 100);
    }
  }, [headerData.runningLine?.syncWithContacts, headerData.runningLine?.enabled]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <ConfigLoader onConfigLoaded={handleConfigLoaded} />
        
        <Button 
          variant="contained" 
          onClick={handleSaveConfig}
          sx={{ ml: 2, component: 'label', height: '48px' }}
        >
          Сохранить конфигурацию
        </Button>
      </Box>

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
          onClick={handleToggle}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Настройки шапки
          </Typography>
          <IconButton onClick={handleToggle} sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        
        {showLanguageWarning && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 1, 
              p: 1, 
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderRadius: 1
            }}
          >
            Пожалуйста, укажите код языка перед сохранением
          </Typography>
        )}
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>
            {/* Группа настроек оформления шапки */}
            <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, mb: 2, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1565c0', borderBottom: '2px solid #1565c0', pb: 1 }}>Оформление шапки</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Название сайта"
                    value={headerData.siteName}
                    onChange={(e) => {
                      const newSiteName = e.target.value;
                      onHeaderChange({ 
                        ...headerData, 
                        siteName: newSiteName,
                        title: headerData.title === headerData.siteName ? newSiteName : headerData.title
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Домен сайта"
                    value={headerData.domain || ''}
                    onChange={(e) => onHeaderChange({ ...headerData, domain: e.target.value.toLowerCase() })}
                    placeholder="example.com"
                    helperText="Укажите домен вашего сайта"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={headerData.title || headerData.siteName}
                    onChange={(e) => onHeaderChange({ ...headerData, title: e.target.value })}
                    placeholder={headerData.siteName}
                    helperText="(по умолчанию берется из названия сайта)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={headerData.description || heroData?.subtitle || "Наш сайт предлагает лучшие решения"}
                      onChange={(e) => {
                        const newDescription = e.target.value;
                        setIsDescriptionManuallyEdited(true);
                        onHeaderChange({ ...headerData, description: newDescription });
                      }}
                      multiline
                      rows={2}
                      placeholder="Наш сайт предлагает лучшие решения"
                      helperText={isDescriptionManuallyEdited ? "(редактировано вручную)" : "(автоматически из hero)"}
                    />
                    {isDescriptionManuallyEdited && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setIsDescriptionManuallyEdited(false);
                          onHeaderChange({ ...headerData, description: heroData?.subtitle || "" });
                        }}
                        sx={{ mt: 1, minWidth: 'auto', px: 1 }}
                        title="Вернуть автоматическую синхронизацию с Hero"
                      >
                        ↻
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Код языка (ISO 639-1)"
                    value={typeof headerData.language === 'string' ? headerData.language : ''}
                    onChange={handleLanguageChange}
                    helperText="Введите двухбуквенный код языка по стандарту ISO 639-1"
                    inputProps={{
                      maxLength: 2,
                      pattern: '[a-zA-Z]{2}'
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'red',
                        },
                        '&:hover fieldset': {
                          borderColor: 'red',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'red',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'red',
                        '&.Mui-focused': {
                          color: 'red',
                        },
                        '&.Mui-shrink': {
                          color: 'red',
                        }
                      },
                      '& .MuiHelperText-root': {
                        color: 'red',
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        position: 'absolute',
                        top: '-8px',
                        left: '14px',
                        backgroundColor: 'white',
                        padding: '0 4px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет заголовка</Typography>
                    <input
                      type="color"
                      value={headerData.titleColor}
                      onChange={(e) => onHeaderChange({ ...headerData, titleColor: e.target.value })}
                      style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет фона шапки</Typography>
                    <input
                      type="color"
                      value={headerData.backgroundColor}
                      onChange={(e) => onHeaderChange({ ...headerData, backgroundColor: e.target.value })}
                      style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет ссылок</Typography>
                    <input
                      type="color"
                      value={headerData.linksColor}
                      onChange={(e) => onHeaderChange({ ...headerData, linksColor: e.target.value })}
                      style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      fullWidth
                    >
                      Загрузить Favicon
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFaviconUpload}
                      />
                    </Button>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      Рекомендуемый размер: 32x32 пикселей, формат PNG
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Предустановленные стили */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1565c0' }}>
                  Предустановленные стили оформления
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Выберите стиль</InputLabel>
                  <Select
                    value={selectedPreset}
                    label="Выберите стиль"
                    onChange={(e) => handlePresetChange(e.target.value)}
                  >
                    {Object.entries(headerPresets).map(([key, preset]) => (
                      <MenuItem key={key} value={key}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              background: preset.siteBackgroundType === 'gradient'
                                ? `linear-gradient(${preset.siteGradientDirection || 'to right'}, ${preset.siteGradientColor1}, ${preset.siteGradientColor2})`
                                : preset.backgroundColor,
                              border: `2px solid ${preset.titleColor}`
                            }}
                          />
                          <Typography>{preset.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* Группа настроек фона сайта */}
            <Paper sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', borderBottom: '2px solid #2e7d32', pb: 1 }}>Оформление фона сайта</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Тип фона</InputLabel>
                    <Select
                      value={headerData.siteBackgroundType}
                      onChange={(e) => onHeaderChange({ ...headerData, siteBackgroundType: e.target.value })}
                      label="Тип фона"
                    >
                      <MenuItem value="solid">Сплошной цвет</MenuItem>
                      <MenuItem value="gradient">Градиент</MenuItem>
                      <MenuItem value="image">Изображение</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {headerData.siteBackgroundType === 'solid' && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Цвет фона</Typography>
                      <input
                        type="color"
                        value={headerData.siteBackgroundColor}
                        onChange={(e) => onHeaderChange({ ...headerData, siteBackgroundColor: e.target.value })}
                        style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                      />
                    </Box>
                  </Grid>
                )}

                {headerData.siteBackgroundType === 'gradient' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Первый цвет градиента</Typography>
                        <input
                          type="color"
                          value={headerData.siteGradientColor1}
                          onChange={(e) => onHeaderChange({ ...headerData, siteGradientColor1: e.target.value })}
                          style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Второй цвет градиента</Typography>
                        <input
                          type="color"
                          value={headerData.siteGradientColor2}
                          onChange={(e) => onHeaderChange({ ...headerData, siteGradientColor2: e.target.value })}
                          style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Направление градиента</InputLabel>
                        <Select
                          value={headerData.siteGradientDirection}
                          onChange={(e) => onHeaderChange({ ...headerData, siteGradientDirection: e.target.value })}
                          label="Направление градиента"
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

                {headerData.siteBackgroundType === 'image' && (
                  <>
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
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Размытие фона</Typography>
                        <Slider
                          value={headerData.siteBackgroundBlur || 0}
                          onChange={(e, value) => onHeaderChange({ ...headerData, siteBackgroundBlur: value })}
                          min={0}
                          max={20}
                          step={1}
                          valueLabelDisplay="auto"
                          sx={{ color: '#2e7d32' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Затемнение фона</Typography>
                        <Slider
                          value={headerData.siteBackgroundDarkness || 0}
                          onChange={(e, value) => onHeaderChange({ ...headerData, siteBackgroundDarkness: value })}
                          min={0}
                          max={100}
                          step={5}
                          valueLabelDisplay="auto"
                          sx={{ color: '#2e7d32' }}
                        />
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>

            {/* Настройки бегущей строки */}
            <Paper sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 1, boxShadow: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#e65100', borderBottom: '2px solid #e65100', pb: 1 }}>
                Бегущая строка
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={headerData.runningLine?.enabled || false}
                        onChange={(e) => onHeaderChange({
                          ...headerData,
                          runningLine: {
                            ...headerData.runningLine,
                            enabled: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Включить бегущую строку"
                  />
                </Grid>
                
                {headerData.runningLine?.enabled && (
                  <>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                                                  <Switch
                          checked={headerData.runningLine?.syncWithContacts !== false}
                          onChange={(e) => {
                              const syncEnabled = e.target.checked;
                              onHeaderChange({
                                ...headerData,
                                runningLine: {
                                  ...headerData.runningLine,
                                  syncWithContacts: syncEnabled
                                }
                              });
                              if (syncEnabled) {
                                // Немедленно синхронизируем цвета при включении
                                setTimeout(() => syncRunningLineWithContacts(), 100);
                              }
                            }}
                          />
                        }
                        label="Синхронизировать цвета с разделом контактов"
                        sx={{ mb: 2 }}
                      />
                      {headerData.runningLine?.syncWithContacts && (
                        <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #2196f3' }}>
                          <Typography variant="body2" sx={{ color: '#1976d2' }}>
                            💡 Цвета автоматически синхронизируются с настройками контактов
                            <br />
                            • Цвет текста ← Цвет заголовка контактов
                            <br />
                            • Цвет фона ← Цвет фона контактов
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Текст бегущей строки"
                        value={headerData.runningLine?.text || ''}
                        onChange={(e) => {
                          const newText = e.target.value;
                          onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              text: newText,
                              enabled: newText.trim() !== '' // Автоматически выключаем если текст пустой
                            }
                          });
                        }}
                        placeholder="Введите текст для бегущей строки"
                        helperText="Текст, который будет двигаться в бегущей строке"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#e65100' }}>
                          Скорость движения (секунды)
                        </Typography>
                        <Slider
                          value={headerData.runningLine?.speed || 35}
                          onChange={(e, value) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              speed: value
                            }
                          })}
                          min={10}
                          max={100}
                          step={5}
                          marks={[
                            { value: 10, label: '10с' },
                            { value: 35, label: '35с' },
                            { value: 100, label: '100с' }
                          ]}
                          valueLabelDisplay="auto"
                          sx={{ color: '#e65100' }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Размер шрифта</InputLabel>
                        <Select
                          value={headerData.runningLine?.fontSize || '14px'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              fontSize: e.target.value
                            }
                          })}
                          label="Размер шрифта"
                        >
                          <MenuItem value="12px">12px - Маленький</MenuItem>
                          <MenuItem value="14px">14px - Стандартный</MenuItem>
                          <MenuItem value="16px">16px - Средний</MenuItem>
                          <MenuItem value="18px">18px - Большой</MenuItem>
                          <MenuItem value="20px">20px - Очень большой</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: headerData.runningLine?.syncWithContacts ? '#9e9e9e' : '#e65100' }}>
                          Цвет фона бегущей строки
                          {headerData.runningLine?.syncWithContacts && ' (синхронизация включена)'}
                        </Typography>
                        <input
                          type="color"
                          value={headerData.runningLine?.backgroundColor || '#1976d2'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              backgroundColor: e.target.value,
                              syncWithContacts: false // Отключаем синхронизацию при ручном изменении
                            }
                          })}
                          disabled={headerData.runningLine?.syncWithContacts}
                          style={{ 
                            width: '100%', 
                            height: '40px', 
                            borderRadius: '4px',
                            opacity: headerData.runningLine?.syncWithContacts ? 0.5 : 1
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: headerData.runningLine?.syncWithContacts ? '#9e9e9e' : '#e65100' }}>
                          Цвет текста бегущей строки
                          {headerData.runningLine?.syncWithContacts && ' (синхронизация включена)'}
                        </Typography>
                        <input
                          type="color"
                          value={headerData.runningLine?.textColor || '#ffffff'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              textColor: e.target.value,
                              syncWithContacts: false // Отключаем синхронизацию при ручном изменении
                            }
                          })}
                          disabled={headerData.runningLine?.syncWithContacts}
                          style={{ 
                            width: '100%', 
                            height: '40px', 
                            borderRadius: '4px',
                            opacity: headerData.runningLine?.syncWithContacts ? 0.5 : 1
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Начертание шрифта</InputLabel>
                        <Select
                          value={headerData.runningLine?.fontWeight || 'normal'}
                          onChange={(e) => onHeaderChange({
                            ...headerData,
                            runningLine: {
                              ...headerData.runningLine,
                              fontWeight: e.target.value
                            }
                          })}
                          label="Начертание шрифта"
                        >
                          <MenuItem value="normal">Обычный</MenuItem>
                          <MenuItem value="bold">Жирный</MenuItem>
                          <MenuItem value="lighter">Светлый</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default HeaderEditor; 