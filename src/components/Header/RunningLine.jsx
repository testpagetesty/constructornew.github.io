import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const RunningLine = ({ 
  enabled = false, 
  text = '', 
  speed = 10, 
  backgroundColor = '#1976d2', 
  textColor = '#ffffff',
  fontSize = '20px',
  fontWeight = 'bold',
  fontFamily = 'system-ui, -apple-system, sans-serif',
  textStyle = 'normal',
  lineHeight = '1.2',
  padding = '4'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!enabled || !text) return null;

  // Адаптивные размеры шрифта
  const getResponsiveFontSize = () => {
    const baseFontSize = parseInt(fontSize);
    if (isSmallMobile) {
      return `${Math.max(baseFontSize - 2, 10)}px`;
    }
    if (isMobile) {
      return `${Math.max(baseFontSize - 1, 11)}px`;
    }
    return fontSize;
  };

  // Адаптивная скорость для мобильных (быстрее на малых экранах)
  const getResponsiveSpeed = () => {
    if (isSmallMobile) {
      return Math.max(speed * 0.8, 10);
    }
    if (isMobile) {
      return Math.max(speed * 0.9, 12);
    }
    return speed;
  };

  // Функция для получения яркости цвета (0-255)
  const getBrightness = (color) => {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    const r = (num >> 16);
    const g = (num >> 8 & 0x00FF);
    const b = (num & 0x0000FF);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Функция для создания контрастного цвета тени для 3D эффекта
  const get3DShadowColor = (textColor, backgroundColor) => {
    const textBrightness = getBrightness(textColor);
    const bgBrightness = getBrightness(backgroundColor);
    
    // Если текст светлый, делаем тень темнее
    if (textBrightness > 128) {
      return adjustColor(textColor, -80); // Темнее
    } else {
      // Если текст темный, делаем тень светлее
      return adjustColor(textColor, 60); // Светлее
    }
  };

  // Функция для создания контрастной обводки
  const getContrastOutline = (textColor, backgroundColor) => {
    const textBrightness = getBrightness(textColor);
    const bgBrightness = getBrightness(backgroundColor);
    
    // Если разница яркости небольшая, используем черную или белую обводку
    if (Math.abs(textBrightness - bgBrightness) < 100) {
      return textBrightness > 128 ? '#000000' : '#ffffff';
    }
    
    // Иначе используем противоположный цвет
    return textBrightness > bgBrightness ? '#000000' : '#ffffff';
  };

  // Генерация текстовых эффектов
  const getTextShadow = () => {
    switch (textStyle) {
      case 'shadow':
        return '2px 2px 4px rgba(0,0,0,0.7)';
      case 'outline':
        const outlineColor = getContrastOutline(textColor, backgroundColor);
        return `
          -1px -1px 0 ${outlineColor},
          1px -1px 0 ${outlineColor},
          -1px 1px 0 ${outlineColor},
          1px 1px 0 ${outlineColor}
        `;
      case 'glow':
        return `0 0 10px ${textColor}, 0 0 20px ${textColor}, 0 0 30px ${textColor}`;
      case '3d':
        const shadowColor = get3DShadowColor(textColor, backgroundColor);
        const outlineColor3d = getContrastOutline(textColor, backgroundColor);
        return `
          -1px -1px 0 ${outlineColor3d},
          1px -1px 0 ${outlineColor3d},
          -1px 1px 0 ${outlineColor3d},
          1px 1px 0 ${outlineColor3d},
          1px 1px 0 ${shadowColor},
          2px 2px 0 ${shadowColor},
          3px 3px 0 ${shadowColor},
          4px 4px 0 ${shadowColor},
          5px 5px 0 ${shadowColor}
        `;
      case '3d-classic':
        return `
          1px 1px 0 #ccc,
          2px 2px 0 #ccc,
          3px 3px 0 #ccc,
          4px 4px 0 #ccc,
          5px 5px 0 #ccc
        `;
      case '3d-bold':
        const boldShadow = adjustColor(textColor, -100);
        return `
          -2px -2px 0 #000,
          2px -2px 0 #000,
          -2px 2px 0 #000,
          2px 2px 0 #000,
          2px 2px 0 ${boldShadow},
          4px 4px 0 ${boldShadow},
          6px 6px 0 ${boldShadow}
        `;
      case '3d-neon':
        return `
          0 0 5px ${textColor},
          0 0 10px ${textColor},
          1px 1px 0 ${adjustColor(textColor, -50)},
          2px 2px 0 ${adjustColor(textColor, -50)},
          3px 3px 0 ${adjustColor(textColor, -50)}
        `;
      case 'gradient':
        return '2px 2px 4px rgba(0,0,0,0.5)';
      default:
        return 'none';
    }
  };

  // Генерация градиентного цвета
  const getTextColor = () => {
    if (textStyle === 'gradient') {
      return 'transparent';
    }
    return textColor;
  };

  // Генерация градиентного фона для текста
  const getTextBackground = () => {
    if (textStyle === 'gradient') {
      return `linear-gradient(45deg, ${textColor}, ${adjustColor(textColor, 50)})`;
    }
    return 'none';
  };

  // Функция для изменения яркости цвета
  const adjustColor = (color, amount) => {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: backgroundColor,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        py: `${parseInt(padding) / 8}`,
        zIndex: 1200,
        minHeight: isSmallMobile ? '28px' : isMobile ? '30px' : `${parseInt(padding) * 4 + 20}px`,
        display: 'flex',
        alignItems: 'center',
        // Остановка анимации при наведении курсора
        '&:hover': {
          '& > *': {
            animationPlayState: 'paused'
          }
        }
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: getResponsiveFontSize(),
          fontWeight: fontWeight,
          fontFamily: fontFamily,
          color: getTextColor(),
          background: getTextBackground(),
          backgroundClip: textStyle === 'gradient' ? 'text' : 'initial',
          WebkitBackgroundClip: textStyle === 'gradient' ? 'text' : 'initial',
          textShadow: getTextShadow(),
          display: 'inline-block',
          paddingLeft: '100%',
          animation: `runningLine ${getResponsiveSpeed()}s linear infinite`,
          lineHeight: lineHeight,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: textStyle === 'glow' || textStyle === '3d-neon' ? 'scale(1.02)' : 'none',
            filter: textStyle === 'glow' || textStyle === '3d-neon' ? 'brightness(1.1)' : 'none'
          },
          '@keyframes runningLine': {
            '0%': {
              transform: 'translateX(0)'
            },
            '100%': {
              transform: 'translateX(-100%)'
            }
          }
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default RunningLine; 