import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const zoomAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;

const panAnimation = keyframes`
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
`;

const fadeAnimation = keyframes`
  from {
    opacity: 0.8;
  }
  to {
    opacity: 1;
  }
`;

const pageOpenAnimation = keyframes`
  from {
    opacity: 0;
    filter: blur(20px);
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const HeroContainer = styled(Box)(({ theme, isPageLoaded }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  opacity: isPageLoaded ? 1 : 0,
  filter: isPageLoaded ? 'blur(0px)' : 'blur(20px)',
  transform: isPageLoaded ? 'scale(1)' : 'scale(0.95)',
  transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const BackgroundLayer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 1,
}));

const OverlayLayer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  textAlign: 'center',
  padding: theme.spacing(4),
  maxWidth: '800px',
  margin: '0 auto'
}));

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundType = 'solid',
  backgroundImage = '',
  backgroundVideo = '',
  backgroundGif = '',
  backgroundColor = '#ffffff',
  gradientColor1 = '#ffffff',
  gradientColor2 = '#f5f5f5',
  gradientDirection = 'to right',
  titleColor = '#ffffff',
  subtitleColor = '#ffffff',
  animationType = 'none',
  enableOverlay = false,
  overlayOpacity = 50,
  enableBlur = false,
  blurAmount = 0,
  // Новые пропсы для видео
  videoAutoplay = true,
  videoLoop = true,
  videoMuted = true,
  videoControls = false
}) => {
  const theme = useTheme();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Задержка для плавного появления страницы
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getAnimation = () => {
    switch (animationType) {
      case 'zoom':
        return `${zoomAnimation} 20s infinite alternate`;
      case 'pan':
        return `${panAnimation} 30s infinite alternate`;
      case 'fade':
        return `${fadeAnimation} 5s infinite alternate`;
      case 'pulse':
        return `${pulseAnimation} 10s infinite ease-in-out`;
      default:
        return 'none';
    }
  };

  const getBackgroundStyle = () => {
    const baseStyle = {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      animation: getAnimation()
    };

    switch (backgroundType) {
      case 'image':
        let imageUrl = backgroundImage;
        if (imageUrl && !imageUrl.startsWith('/images/hero/')) {
          imageUrl = `/images/hero/${imageUrl}`;
        }
        
        return {
          ...baseStyle,
          backgroundImage: `url(${imageUrl})`,
          filter: enableBlur ? `blur(${blurAmount}px)` : 'none',
        };

      case 'video':
        return {
          ...baseStyle,
          // Для видео фона не применяем размытие к основному контейнеру
          filter: 'none',
        };

      case 'solid':
        return {
          ...baseStyle,
          backgroundColor: backgroundColor
        };

      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`
        };

      default:
        return baseStyle;
    }
  };

  return (
    <HeroContainer isPageLoaded={isPageLoaded}>
      <BackgroundLayer sx={getBackgroundStyle()} />
      
      {/* Видео фон */}
      {backgroundType === 'video' && backgroundVideo && (
        <Box
          component="video"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: enableBlur ? `blur(${blurAmount}px)` : 'none',
            // Полностью скрываем элементы управления видео
            '&::-webkit-media-controls': { display: 'none !important' },
            '&::-webkit-media-controls-panel': { display: 'none !important' },
            '&::-webkit-media-controls-play-button': { display: 'none !important' },
            '&::-webkit-media-controls-start-playback-button': { display: 'none !important' },
            '&::-webkit-media-controls-timeline': { display: 'none !important' },
            '&::-webkit-media-controls-current-time-display': { display: 'none !important' },
            '&::-webkit-media-controls-time-remaining-display': { display: 'none !important' },
            '&::-webkit-media-controls-mute-button': { display: 'none !important' },
            '&::-webkit-media-controls-volume-slider': { display: 'none !important' },
            '&::-webkit-media-controls-fullscreen-button': { display: 'none !important' },
            '&::-moz-media-controls': { display: 'none !important' },
            '&::-ms-media-controls': { display: 'none !important' },
            // Дополнительные правила для полного скрытия
            '&::-webkit-media-controls-enclosure': { display: 'none !important' },
            '&::-webkit-media-controls-overlay-play-button': { display: 'none !important' },
            '&::-webkit-media-controls-rewind-button': { display: 'none !important' },
            '&::-webkit-media-controls-return-to-realtime-button': { display: 'none !important' },
            '&::-webkit-media-controls-seek-back-button': { display: 'none !important' },
            '&::-webkit-media-controls-seek-forward-button': { display: 'none !important' },
            '&::-webkit-media-controls-picture-in-picture-button': { display: 'none !important' },
          }}
          autoPlay={videoAutoplay}
          loop={videoLoop}
          muted={videoMuted}
          controls={false}
          playsInline
          preload="auto"
        >
          <source src={backgroundVideo} type="video/mp4" />
          <source src={backgroundVideo.replace('.mp4', '.webm')} type="video/webm" />
          <source src={backgroundVideo.replace('.mp4', '.ogg')} type="video/ogg" />
          Ваш браузер не поддерживает видео.
        </Box>
      )}

      {/* GIF фон */}
      {backgroundType === 'gif' && backgroundGif && (
        <Box
          component="img"
          src={backgroundGif}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: enableBlur ? `blur(${blurAmount}px)` : 'none',
          }}
          alt="Hero background GIF"
        />
      )}
      
      {enableOverlay && (
        <OverlayLayer 
          sx={{ 
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
            transition: 'background-color 0.3s ease'
          }} 
        />
      )}
      
      <HeroContent>
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(0.1px)',
            padding: '2rem 3rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: titleColor,
              fontWeight: 700,
              marginBottom: theme.spacing(2),
              textShadow: `
                2px 2px 4px rgba(0, 0, 0, 0.9),
                -1px -1px 2px rgba(255, 255, 255, 0.8),
                1px 1px 2px rgba(255, 255, 255, 0.6),
                0 0 20px rgba(0, 0, 0, 0.5),
                0 0 40px rgba(255, 255, 255, 0.3)
              `,
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))'
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: subtitleColor,
              fontWeight: 400,
              textShadow: `
                1px 1px 3px rgba(0, 0, 0, 0.9),
                -1px -1px 1px rgba(255, 255, 255, 0.7),
                0 0 15px rgba(0, 0, 0, 0.5),
                0 0 25px rgba(255, 255, 255, 0.2)
              `,
              WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.2)',
              filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.7))',
              marginBottom: theme.spacing(2)
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection; 