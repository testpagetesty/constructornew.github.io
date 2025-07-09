import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const RunningLine = ({ 
  enabled = false, 
  text = '', 
  speed = 35, 
  backgroundColor = '#1976d2', 
  textColor = '#ffffff',
  fontSize = '14px',
  fontWeight = 'normal'
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
      return Math.max(speed * 0.8, 20);
    }
    if (isMobile) {
      return Math.max(speed * 0.9, 25);
    }
    return speed;
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: backgroundColor,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        py: isSmallMobile ? 0.3 : isMobile ? 0.4 : 0.5,
        zIndex: 1200,
        minHeight: isSmallMobile ? '28px' : isMobile ? '30px' : '35px',
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
          color: textColor,
          display: 'inline-block',
          paddingLeft: '100%',
          animation: `runningLine ${getResponsiveSpeed()}s linear infinite`,
          lineHeight: 1.2,
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