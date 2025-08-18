import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HeroSection from '../Hero/HeroSection';
import ContactSection from '../Contact/ContactSection';
import FooterSection from '../Footer/FooterSection';
import Header from '../Header/Header';
import TestimonialCard from '../Testimonial/TestimonialCard';
import ReactDOM from 'react-dom/client';
import { imageCacheService } from '../../utils/imageCacheService';
import LiveChatWidget from '../LiveChat/LiveChatWidget';

// Импортируем новые компоненты для отображения изображений
import SimpleImageGallery from './SimpleImageGallery';
import DebugImageDisplay from './DebugImageDisplay';

const SimpleCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'scale(1.2)',
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const ElevatedCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'rotate(3deg) scale(1.05)',
    boxShadow: theme.shadows[8],
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const OutlinedCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#e8f5e9'}, ${card?.gradientColor2 || '#c8e6c9'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'skew(-5deg) translateY(-5px)',
    borderColor: theme.palette.primary.main,
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const AccentCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : undefined,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  position: 'relative',
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  zIndex: 2,
  '&:hover': {
    transform: 'translateX(10px) translateY(-5px)',
    boxShadow: theme.shadows[4],
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    },
    '&::before': {
      width: '6px'
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    transition: 'width 0.3s ease-in-out',
    zIndex: 1
  }
}));

const GradientCard = styled(Card)(({ theme, card }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: card?.backgroundType === 'solid' ? (card?.backgroundColor || 'transparent') : 'transparent',
  background: card?.backgroundType === 'gradient' 
    ? `linear-gradient(${card?.gradientDirection || 'to right'}, ${card?.gradientColor1 || '#ffffff'}, ${card?.gradientColor2 || '#f5f5f5'})`
    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  border: `3px solid ${card?.borderColor || theme.palette.divider}`,
  width: '100%',
  maxWidth: '280px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  height: 'auto',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'scale(1.2)',
    boxShadow: theme.shadows[8],
    zIndex: 3,
    '& .MuiTypography-h6': {
      color: card?.titleColor || theme.palette.primary.main
    },
    '& .MuiTypography-body2': {
      color: card?.contentColor || theme.palette.text.primary
    }
  },
  '& .MuiTypography-h6': {
    color: card?.titleColor || theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out'
  },
  '& .MuiTypography-body2': {
    color: card?.contentColor || theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out'
  }
}));

const CARD_TYPES = {
  NONE: 'none',
  SIMPLE: 'simple',
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  ACCENT: 'accent',
  GRADIENT: 'gradient'
};

const CARD_COMPONENTS = {
  [CARD_TYPES.SIMPLE]: SimpleCard,
  [CARD_TYPES.ELEVATED]: ElevatedCard,
  [CARD_TYPES.OUTLINED]: OutlinedCard,
  [CARD_TYPES.ACCENT]: AccentCard,
  [CARD_TYPES.GRADIENT]: GradientCard
};

const PagePreview = ({
  headerData,
  heroData,
  sectionsData = {},
  contactData,
  footerData,
  legalDocuments,
  liveChatData = { enabled: false, apiKey: '' }
}) => {
  const sectionRefs = useRef({});
  const cardRefs = useRef({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const contactSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [backgroundSettings, setBackgroundSettings] = useState({
    blur: headerData?.siteBackgroundBlur || 0,
    darkness: headerData?.siteBackgroundDarkness || 0
  });
  const [showBorders, setShowBorders] = useState(true);
  const [sectionImages, setSectionImages] = useState({});

  // Добавляем стили для анимации рамки
  const globalStyles = `
    @keyframes borderPulse {
      0% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        border-width: 5px;
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        border-width: 4px;
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
      }
    }

    @keyframes glowPulse {
      0% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(25, 118, 210, 0.2);
      }
      100% {
        box-shadow: 0 0 5px 0 rgba(25, 118, 210, 0.4);
      }
    }
  `;

  const renderCard = (card, cardType, section) => {
    const CardComponent = CARD_COMPONENTS[cardType] || SimpleCard;
    
    return (
      <CardComponent
        ref={el => {
          if (el) {
            cardRefs.current[`${section.id}-${card.id}`] = el;
          }
        }}
        card={card}
        section={section}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {card.showTitle && (
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: card.titleColor || 'inherit',
                fontWeight: 600
              }}
            >
              {card.title}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: card.contentColor || 'inherit',
              flexGrow: 1
            }}
          >
            {card.content}
          </Typography>
        </CardContent>
      </CardComponent>
    );
  };

  const renderSection = (section) => {
    if (!section) return null;
    
    // Получаем URL изображения, учитывая возможную структуру данных
    const getFirstImageUrl = (images) => {
      console.log('[getFirstImageUrl] Input images:', images);
      if (!images) return null;
      
      // Проверяем, является ли images массивом
      if (Array.isArray(images)) {
        if (images.length === 0) return null;
        
        const img = images[0];
        if (typeof img === 'string') return img;
        return img?.url || img?.path || null;
      }
      
      // Если images - строка, возвращаем её как URL
      if (typeof images === 'string') return images;
      
      // Если images - объект, пытаемся получить url или path
      return images?.url || images?.path || null;
    };
    
    const sectionImgUrl = getFirstImageUrl(sectionImages[section.id]) || section.imagePath;
    console.log('[renderSection] Final sectionImgUrl:', sectionImgUrl);
    
    // Получаем цвета из карточек секции для градиента рамки
    const getBorderColors = () => {
      if (section.cards && section.cards.length > 0) {
        const firstCard = section.cards[0];
        const lastCard = section.cards[section.cards.length - 1];
        
        // Используем только цвет обводки карточки
        const startColor = firstCard.borderColor || theme.palette.primary.main;
        const endColor = lastCard.borderColor || theme.palette.primary.light;

        return {
          start: startColor,
          end: endColor
        };
      }
      
      // Если карточек нет, используем цвета из темы
      return {
        start: theme.palette.primary.main,
        end: theme.palette.primary.light
      };
    };

    const borderColors = getBorderColors();
    
    if (section.cardType === CARD_TYPES.NONE) {
      return (
        <Box sx={{
          background: section.showBackground !== false ? 
            (section.backgroundColor ? section.backgroundColor : 
            (section.gradientStart && section.gradientEnd) ? 
            `linear-gradient(145deg, ${section.gradientStart}, ${section.gradientEnd})` : 
            'linear-gradient(145deg, #ffffff, #f5f5f5)') : 
            'transparent',
          borderRadius: '20px',
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '1000px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${borderColors.start}, ${borderColors.end})`,
          }
        }}>
          <Box sx={{
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                textAlign: 'left',
                marginBottom: '1rem',
                color: section.titleColor || theme.palette.text.primary,
                fontFamily: '"Montserrat", sans-serif',
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                paddingBottom: '0.5rem'
              }}
            >
              {section.title}
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: '2rem',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              <Box sx={{
                flex: 1,
                minWidth: 0 // Для корректного переноса текста
              }}>
                {section.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      textAlign: 'left',
                      color: section.descriptionColor || theme.palette.text.secondary,
                      fontFamily: '"Roboto", sans-serif',
                      lineHeight: 1.6,
                      maxWidth: '100%',
                      padding: '0 0.5rem'
                    }}
                  >
                    {section.description}
                  </Typography>
                )}
              </Box>

              {/* Изображение справа */}
              {(section.imagePath || sectionImages[section.id]?.length > 0) && (
                <Box sx={{
                  width: { xs: '100%', md: '300px' },
                  height: { xs: '250px', md: '300px' },
                  flexShrink: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  },
                  '& .simple-image-gallery': {
                    width: '100%',
                    height: '100%',
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }
                }}>
                  {sectionImages[section.id]?.length > 0 ? (
                    <SimpleImageGallery 
                      images={sectionImages[section.id]}
                      autoScroll={section.autoScrollEnabled !== undefined ? section.autoScrollEnabled : true}
                      scrollInterval={2000}
                      position="right"
                      maxHeight="100%"
                      fillContainer={true}
                    />
                  ) : sectionImgUrl && (
                    <img 
                      src={sectionImgUrl}
                      alt={section.title || 'Section image'}
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        if (e.target.src !== section.imagePath) {
                          e.target.src = section.imagePath;
                        }
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {section.cards?.map((card, index) => (
                <Box
                  key={card.id}
                  sx={{
                    padding: '1rem',
                    borderLeft: `3px solid ${card.borderColor || theme.palette.primary.main}`,
                    background: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0,0,0,0.02)',
                      paddingLeft: '1.5rem'
                    }
                  }}
                >
                  {card.title && (
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: card.titleColor || section.titleColor || theme.palette.text.primary,
                        fontFamily: '"Montserrat", sans-serif'
                      }}
                    >
                      {card.title}
                    </Typography>
                  )}
                  {card.content && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.6,
                        color: card.contentColor || section.contentColor || theme.palette.text.secondary,
                        fontFamily: '"Roboto", sans-serif',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {card.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        key={section.id}
        id={section.id}
        ref={el => {
          if (el) {
            sectionRefs.current[section.id] = el;
          }
        }}
        sx={{
          py: 8,
          px: 2,
          backgroundColor: section.showBackground !== false ? (section.backgroundColor || 'transparent') : 'transparent',
          color: section.textColor || 'inherit',
          position: 'relative',
          overflow: 'visible',
          borderRadius: '20px',
          '&::before': (showBorders && section.showBackground !== false) ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '4px solid transparent',
            borderRadius: '20px',
            background: `linear-gradient(45deg, ${borderColors.start}, ${borderColors.end}) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 1,
            transition: 'all 0.3s ease-in-out',
            animation: 'borderPulse 3s infinite, glowPulse 3s infinite',
          } : {},
          '&:hover::before': (showBorders && section.showBackground !== false) ? {
            border: '5px solid transparent',
            boxShadow: `0 0 25px 15px ${borderColors.start}`,
            animation: 'none',
          } : {}
        }}
      >
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <Switch
            checked={showBorders}
            onChange={() => setShowBorders(!showBorders)}
            color="primary"
            size="small"
          />
        </Box>
        {/* Фоновое изображение с размытием */}
        {section.backgroundImage && section.showBackground !== false && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${section.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${section.blurAmount || 0}px)`,
              transition: 'filter 0.3s ease-in-out',
              zIndex: 0
            }}
          />
        )}
        
        {/* Затемнение */}
        {section.enableOverlay && section.showBackground !== false && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${Number(section.overlayOpacity)})`,
              transition: 'background-color 0.3s ease-in-out',
              zIndex: 1
            }}
          />
        )}

        <Container maxWidth="lg">
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <Fade in timeout={1000}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  textAlign: 'center',
                  mb: 4,
                  color: section.titleColor || 'inherit',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.01562em',
                  textTransform: 'none',
                  marginBottom: '1.5rem',
                  wordWrap: 'break-word'
                }}
              >
                {section.title}
              </Typography>
            </Fade>
            
            {section.description && (
              <Fade in timeout={1500}>
                <Typography 
                  variant="h6" 
                  component="p" 
                  sx={{ 
                    textAlign: 'center',
                    mb: 4,
                    color: section.descriptionColor || 'inherit',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.5,
                    letterSpacing: '0.00938em',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}
                >
                  {section.description}
                </Typography>
              </Fade>
            )}

            {/* Добавляем отображение изображения секции только если тип секции НЕ "без карточек" */}
            {section.cardType !== CARD_TYPES.NONE && (section.imagePath || sectionImages[section.id]?.length > 0) && (
              <Fade in timeout={1800}>
                <Box className="section-image" sx={{ 
                  mt: 3, 
                  mb: 4,
                  textAlign: 'center',
                  maxWidth: '100%',
                  height: { xs: '300px', sm: '400px', md: '500px' } // Фиксированная высота контейнера
                }}>
                  {/* Используем SimpleImageGallery если есть несколько изображений */}
                  {sectionImages[section.id]?.length > 0 ? (
                    <Box sx={{ 
                      width: '100%',
                      height: '100%', // Занимаем всю высоту родителя
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      <SimpleImageGallery 
                        images={sectionImages[section.id]} 
                        autoScroll={section.autoScrollEnabled !== undefined ? section.autoScrollEnabled : true}
                        scrollInterval={2000}
                        position="right"
                        fillContainer={true} // Заполняем контейнер
                      />
                    </Box>
                  ) : sectionImgUrl && (
                    <img 
                      src={sectionImgUrl}
                      alt={section.title || 'Section image'}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%', // Заполняем всю высоту
                        objectFit: 'cover', // Используем cover для заполнения
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      onError={(e) => {
                        console.error('Image load error:', e);
                        console.log('Current src:', e.target.src);
                        console.log('Section imagePath:', section.imagePath);
                        console.log('SectionImages state:', sectionImages[section.id]);

                        if (e.target.src !== section.imagePath) {
                          console.log('Falling back to direct imagePath');
                          e.target.src = section.imagePath;
                        }
                      }}
                      onLoad={() => console.log('Image loaded successfully:', sectionImgUrl)}
                    />
                  )}
                </Box>
              </Fade>
            )}
          </Box>

          {section.cardType !== CARD_TYPES.NONE && section.cards?.length > 0 ? (
            <Box sx={{ 
              mt: section.description ? 0 : 16,
              pt: section.description ? 8 : 0,
              position: 'relative',
              zIndex: 2
            }} className="cards-container">
              <Grid container spacing={4}>
                {section.cards?.map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} key={card.id}>
                    <Grow in timeout={1000 + index * 200}>
                      <Box sx={{ 
                        position: 'relative',
                        zIndex: 2,
                        '&:hover': {
                          zIndex: 3
                        }
                      }}>
                        {section.id === 'testimonials' ? (
                          <TestimonialCard testimonial={card} />
                        ) : (
                          <Box sx={{ height: '100%' }}>
                            {renderCard(card, section.cardType, section)}
                          </Box>
                        )}
                      </Box>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ 
              mt: 4,
              p: 4,
              borderRadius: '16px',
              background: section.showBackground !== false ? 
                (section.backgroundColor ? section.backgroundColor : 
                (section.gradientStart && section.gradientEnd) ? 
                `linear-gradient(145deg, ${section.gradientStart}, ${section.gradientEnd})` : 
                'linear-gradient(145deg, #ffffff, #f5f5f5)') : 
                'transparent',
              boxShadow: section.showBackground !== false ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
              position: 'relative',
              '&::before': section.showBackground !== false ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '16px',
                padding: '2px',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                zIndex: 0
              } : {}
            }}>
              {console.log('[PagePreview] Секция без карточек:', section.id, 'Изображения:', sectionImages[section.id], 'ImagePath:', section.imagePath)}
              
              {/* Специальный контейнер для лучшего обтекания текстом в секциях без карточек */}
              <Box sx={{ 
                position: 'relative',
                textAlign: 'left',
                overflow: 'hidden',
                backgroundColor: section.showBackground !== false ? 'transparent' : 'transparent',
                display: 'flow-root', // Решает проблемы с обтеканием floated элементов
              }}>
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: section.imagePath ? 'left' : 'center',
                    color: section.titleColor || '#000000',
                    position: 'relative',
                    '&::after': section.showBackground !== false ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: section.imagePath ? 0 : '50%',
                      transform: section.imagePath ? 'none' : 'translateX(-50%)',
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                      borderRadius: '2px'
                    } : {}
                  }}
                >
                  {section.title}
                </Typography>
                {console.log('[PagePreview] Тип карточек:', section.cardType, 'CARD_TYPES.NONE:', CARD_TYPES.NONE, 'Равен:', section.cardType === CARD_TYPES.NONE)}
                {/* Отображаем изображения ТОЛЬКО для секций без карточек */}
                {section.cardType === CARD_TYPES.NONE && (section.imagePath || sectionImages[section.id]?.length > 0) && (
                  <Box sx={{ 
                    float: 'right',
                    margin: '0 0 1rem 1.5rem',
                    maxWidth: { xs: '100%', sm: '300px' },
                    width: { xs: '100%', sm: '40%' },
                    height: { xs: '250px', sm: '300px' }, // Фиксированная высота
                    position: 'relative',
                    display: 'block',
                    '&::after': section.showBackground !== false ? {
                      content: '""',
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      right: '-8px',
                      bottom: '-8px',
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      borderRadius: '16px',
                      zIndex: -1,
                      opacity: 0.3
                    } : {}
                  }}>
                    {sectionImages[section.id]?.length > 0 ? (
                      <Box sx={{ 
                        width: '100%',
                        height: '100%', // Занимаем всю высоту родительского контейнера
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        <SimpleImageGallery 
                          images={sectionImages[section.id]}
                          autoScroll={section.autoScrollEnabled !== undefined ? section.autoScrollEnabled : true}
                          scrollInterval={2000}
                          position="right"
                          maxHeight="100%"
                          fillContainer={true} // Добавляем новый параметр для заполнения контейнера
                        />
                      </Box>
                    ) : sectionImgUrl && (
                      <img 
                        src={sectionImgUrl}
                        alt={section.title || 'Section image'}
                        style={{
                          width: '100%',
                          height: '100%', // Занимаем всю высоту
                          objectFit: 'cover', // Изменено с 'contain' на 'cover'
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transition: 'transform 0.3s ease',
                          display: 'block'
                        }}
                        onError={(e) => {
                          console.error('Image load error:', e);
                          console.log('Current src:', e.target.src);
                          console.log('Section imagePath:', section.imagePath);
                          console.log('SectionImages state:', sectionImages[section.id]);

                          if (e.target.src !== section.imagePath) {
                            console.log('Falling back to direct imagePath');
                            e.target.src = section.imagePath;
                          }
                        }}
                        onLoad={() => console.log('Image loaded successfully:', sectionImgUrl)}
                      />
                    )}
                  </Box>
                )}
                <Box sx={{ overflow: 'hidden', display: 'flow-root' }}> {/* Добавлен display: 'flow-root' для правильного обтекания */}
                  <Box sx={{ pl: section.imagePath ? 2 : 0 }}>
                    {section.description && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          lineHeight: 1.6,
                          textAlign: section.imagePath ? 'left' : 'center',
                          color: section.descriptionColor || '#666666',
                          mb: 2,
                          display: 'block',
                          overflow: 'hidden'
                        }}
                      >
                        {section.description}
                      </Typography>
                    )}
                    {section.cards?.map((card, index) => (
                      <Box key={card.id} sx={{ mb: 2 }}>
                        {card.title && (
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: card.titleColor || section.titleColor || '#1976d2',
                              mb: 1,
                              fontWeight: 600
                            }}
                          >
                            {card.title}
                          </Typography>
                        )}
                        {card.content && (
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              lineHeight: 1.6,
                              textAlign: section.imagePath ? 'left' : 'center',
                              color: card.contentColor || section.contentColor || '#666666'
                            }}
                          >
                            {card.content}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    );
  };

  // Заменяем обработчик сообщений для поддержки нового формата галереи
  const handleMessage = useCallback((event) => {
    console.log('[PagePreview] Received message:', event.data);
    
    switch (event.data.type) {
      case 'UPDATE_SECTION_IMAGE': // Обрабатываем устаревший формат
        const { sectionId, imagePath } = event.data;
        if (sectionId && imagePath) {
          console.log('[PagePreview] Processing UPDATE_SECTION_IMAGE for section:', sectionId);
          setSectionImages(prev => ({
            ...prev,
            [sectionId]: [imagePath]
          }));
        }
        break;
      case 'UPDATE_SECTION_IMAGES': // Новый формат с массивом изображений
        const { sectionId: sid, images } = event.data;
        if (sid && images) {
          console.log('[PagePreview] Processing UPDATE_SECTION_IMAGES for section:', sid, 'with images:', images);
          setSectionImages(prev => {
            // Обрабатываем разные форматы изображений
            const newImageUrls = images.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path;
            });
            
            // Проверяем тип секции для корректной обработки
            const section = Object.values(sectionsData || {}).find(s => s.id === sid);
            console.log('[PagePreview] Section type for', sid, ':', section?.cardType, 'NONE:', CARD_TYPES.NONE);
            
            // Полностью заменяем изображения для секции
            return {
              ...prev,
              [sid]: newImageUrls
            };
          });
        }
        break;
      case 'ADD_SECTION_IMAGES': // Добавление изображений к существующим
        const { sectionId: addSid, images: addImages } = event.data;
        if (addSid && addImages) {
          console.log('[PagePreview] Processing ADD_SECTION_IMAGES for section:', addSid);
          setSectionImages(prev => {
            const currentImages = [...(prev[addSid] || [])];
            // Обрабатываем разные форматы изображений
            const newImageUrls = addImages.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path;
            });
            
            // Добавляем новые изображения к текущим
            const updatedImages = [...currentImages, ...newImageUrls];
            
            return {
              ...prev,
              [addSid]: updatedImages
            };
          });
        }
        break;
      case 'REMOVE_SECTION_IMAGE':
        const { sectionId: removeSid, imageIndex } = event.data;
        if (removeSid && typeof imageIndex === 'number') {
          console.log('[PagePreview] Processing REMOVE_SECTION_IMAGE for section:', removeSid, 'index:', imageIndex);
          setSectionImages(prev => {
            const currentImages = [...(prev[removeSid] || [])];
            currentImages.splice(imageIndex, 1);
            return {
              ...prev,
              [removeSid]: currentImages
            };
          });
        }
        break;
      case 'REORDER_SECTION_IMAGES':
        const { sectionId: reorderSid, images: newImages } = event.data;
        if (reorderSid && newImages) {
          console.log('[PagePreview] Processing REORDER_SECTION_IMAGES for section:', reorderSid);
          setSectionImages(prev => {
            // Обрабатываем разные форматы изображений
            const reorderedUrls = newImages.map(img => {
              if (typeof img === 'string') return img;
              return img.url || img.path;
            });
            return {
              ...prev,
              [reorderSid]: reorderedUrls
            };
          });
        }
        break;
      case 'UPDATE_AUTOSCROLL_SETTING':
        // Обработка настройки автопрокрутки для галереи изображений
        const { sectionId: autoScrollSectionId, autoScroll } = event.data;
        if (autoScrollSectionId) {
          console.log(`[PagePreview] Updating auto-scroll for section ${autoScrollSectionId}: ${autoScroll}`);
          
          // Находим элемент секции
          const sectionElement = sectionRefs.current[autoScrollSectionId];
          if (sectionElement) {
            console.log(`[PagePreview] Found section element for ${autoScrollSectionId}`);
            
            // Пересылаем событие всем SimpleImageGallery на странице
            // Это необходимо, так как SimpleImageGallery слушает события window
            window.postMessage({
              type: 'UPDATE_AUTOSCROLL_SETTING',
              sectionId: autoScrollSectionId,
              autoScroll: autoScroll
            }, '*');
            
            // Также обновляем состояние при рендеринге секции
            if (sectionsData && sectionsData[autoScrollSectionId]) {
              const section = sectionsData[autoScrollSectionId];
              if (section) {
                // Обновляем секцию с новыми параметрами
                section.autoScrollEnabled = autoScroll;
                console.log(`[PagePreview] Updated section data with autoScrollEnabled=${autoScroll}`);
              }
            }
          } else {
            console.warn(`[PagePreview] Could not find section element for ${autoScrollSectionId}`);
          }
        }
        break;
      case 'SCROLL_TO_SECTION':
        const element = sectionRefs.current[event.data.sectionId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
  }, [sectionsData, renderSection]);

  useEffect(() => {
    console.log('[PagePreview] Current sectionImages state:', sectionImages);
  }, [sectionImages]);

  useEffect(() => {
    const loadSectionImages = async () => {
      console.log('[PagePreview] Loading section images for:', sectionsData);
      const newImages = { ...sectionImages }; // Начинаем с текущего состояния изображений
      const sections = Object.values(sectionsData || {});
      
      for (const section of sections) {
        if (section && section.id) {
          // Проверяем есть ли массив images для нового формата
          if (section.images && section.images.length > 0) {
            console.log('[PagePreview] Found multiple images for section:', section.id, section.images);
            const sectionImageUrls = [];
            
            // Преобразуем каждое изображение в URL
            for (const image of section.images) {
              try {
                const imagePath = typeof image === 'string' ? image : image.path;
                if (!imagePath) {
                  console.warn('[PagePreview] Missing image path in:', image);
                  continue;
                }
                
                // Извлекаем имя файла для поиска в кэше
                const filename = imagePath.split('/').pop();
                
                // Перед созданием нового blob URL, проверяем, не загружено ли уже это изображение
                const existingImages = newImages[section.id] || [];
                const existingImage = Array.isArray(existingImages) 
                  ? existingImages.find(img => img.includes(filename))
                  : (existingImages && existingImages.includes(filename) ? existingImages : null);
                
                if (existingImage) {
                  // Если изображение уже загружено, используем существующий URL
                  console.log('[PagePreview] Using existing URL for image:', existingImage);
                  sectionImageUrls.push(existingImage);
                } else {
                  // Иначе загружаем новое изображение
                  const blob = await imageCacheService.getImage(filename);
                  
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    sectionImageUrls.push(url);
                    console.log('[PagePreview] Created blob URL for image:', url);
                  } else {
                    sectionImageUrls.push(imagePath);
                    console.log('[PagePreview] Using direct image path:', imagePath);
                  }
                }
              } catch (error) {
                console.error('[PagePreview] Error loading section image:', error);
                if (typeof image === 'string') {
                  sectionImageUrls.push(image);
                } else if (image.path) {
                  sectionImageUrls.push(image.path);
                }
              }
            }
            
            // Заменяем изображения для данной секции
            newImages[section.id] = sectionImageUrls;
          } 
          // Проверяем старый формат (один путь)
          else if (section.imagePath) {
            try {
              console.log('[PagePreview] Found single image path for section:', section.id, section.imagePath);
              const filename = section.imagePath.split('/').pop();
              
              // Проверяем, не загружено ли уже это изображение
              const existingImages = newImages[section.id];
              const existingImage = Array.isArray(existingImages) 
                ? existingImages.find(img => img.includes(filename))
                : (existingImages && existingImages.includes(filename) ? existingImages : null);
              
              if (existingImage) {
                // Если изображение уже загружено, используем существующий URL
                console.log('[PagePreview] Using existing URL for single image:', existingImage);
                newImages[section.id] = Array.isArray(existingImages) ? [existingImage] : existingImage;
              } else {
                // Иначе загружаем новое изображение
                const blob = await imageCacheService.getImage(filename);
                
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  newImages[section.id] = [url];
                  console.log('[PagePreview] Created blob URL for image:', url);
                } else {
                  newImages[section.id] = [section.imagePath];
                  console.log('[PagePreview] Using direct image path:', section.imagePath);
                }
              }
            } catch (error) {
              console.error('[PagePreview] Error loading section image:', error);
              newImages[section.id] = [section.imagePath];
            }
          }
        }
      }
      console.log('[PagePreview] Final images data:', newImages);
      setSectionImages(newImages);
    };

    loadSectionImages();

    return () => {
      // Сохраняем текущие URLs, которые мы отозвали, чтобы не отзывать дважды
      const revokedUrls = new Set();
      
      // Очищаем только blob URLs
      Object.values(sectionImages).forEach(urls => {
        if (!urls) return;
        
        // Проверяем, является ли urls массивом
        if (Array.isArray(urls)) {
          urls.forEach(url => {
            if (url && typeof url === 'string' && url.startsWith('blob:') && !revokedUrls.has(url)) {
              console.log('[PagePreview] Revoking blob URL:', url);
              URL.revokeObjectURL(url);
              revokedUrls.add(url);
            }
          });
        } else if (typeof urls === 'string' && urls.startsWith('blob:') && !revokedUrls.has(urls)) {
          console.log('[PagePreview] Revoking blob URL:', urls);
          URL.revokeObjectURL(urls);
          revokedUrls.add(urls);
        }
      });
      
      console.log('[PagePreview] Revoked total blob URLs:', revokedUrls.size);
    };
  }, [sectionsData]);

  useEffect(() => {
    const updateCardHeights = () => {
      Object.entries(sectionsData || {}).forEach(([sectionId, sectionContent]) => {
        if (!sectionContent.cards || sectionContent.cards.length === 0) return;

        // Reset all card heights to auto first
        sectionContent.cards.forEach(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          if (ref) {
            ref.style.height = 'auto';
          }
        });

        // Force reflow
        void document.body.offsetHeight;

        // Get current heights of all cards
        const currentHeights = sectionContent.cards.map(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          return ref ? ref.getBoundingClientRect().height : 0;
        });

        // Find the maximum height
        const maxHeight = Math.max(...currentHeights);

        // Update all cards in this section to match the max height
        sectionContent.cards.forEach(card => {
          const ref = cardRefs.current[`${sectionId}-${card.id}`];
          if (ref) {
            ref.style.height = `${maxHeight}px`;
          }
        });
      });
    };

    // Initial update
    updateCardHeights();

    // Set up mutation observer to watch for content changes
    const observer = new MutationObserver(updateCardHeights);
    const config = { 
      childList: true, 
      subtree: true, 
      characterData: true
    };

    // Observe all card content
    Object.entries(sectionsData || {}).forEach(([sectionId, sectionContent]) => {
      if (!sectionContent.cards || sectionContent.cards.length === 0) return;
      sectionContent.cards.forEach(card => {
        const ref = cardRefs.current[`${sectionId}-${card.id}`];
        if (ref) {
          observer.observe(ref, config);
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionsData]);

  const scrollToSection = (id) => {
    setTimeout(() => {
      const element = sectionRefs.current[id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Section with id ${id} not found`);
      }
    }, 100);
  };

  const handleMenuClick = (id) => {
    scrollToSection(id);
  };

  // Apply background styles to preview area
  React.useEffect(() => {
    const previewArea = document.querySelector('.preview-area');
    if (!previewArea) return;

    // Remove any existing overlay
    const existingOverlay = previewArea.querySelector('.site-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Apply background only to main content area
    const mainContent = previewArea.querySelector('main');
    if (!mainContent) return;

    if (headerData?.siteBackgroundType === 'solid') {
      mainContent.style.background = 'none';
      mainContent.style.backgroundColor = headerData.siteBackgroundColor || '#ffffff';
    } else if (headerData?.siteBackgroundType === 'gradient') {
      mainContent.style.background = `linear-gradient(${headerData?.siteGradientDirection || 'to right'}, 
        ${headerData?.siteGradientColor1 || '#ffffff'}, 
        ${headerData?.siteGradientColor2 || '#f5f5f5'})`;
      mainContent.style.backgroundColor = 'transparent';
    } else if (headerData?.siteBackgroundType === 'image') {
      // Remove any existing background elements
      const existingBackground = mainContent.querySelector('.background-image');
      if (existingBackground) {
        existingBackground.remove();
      }

      // Create background image element
      const backgroundImage = document.createElement('div');
      backgroundImage.className = 'background-image';
      backgroundImage.style.position = 'absolute';
      backgroundImage.style.top = '0';
      backgroundImage.style.left = '0';
      backgroundImage.style.right = '0';
      backgroundImage.style.bottom = '0';
      backgroundImage.style.background = `url('/images/hero/fon.jpg') no-repeat center center fixed`;
      backgroundImage.style.backgroundSize = 'cover';
      backgroundImage.style.zIndex = '-2';
      
      // Apply blur to background image
      if (headerData?.siteBackgroundBlur > 0) {
        backgroundImage.style.filter = `blur(${headerData.siteBackgroundBlur}px)`;
      }
      
      mainContent.appendChild(backgroundImage);
      
      // Add overlay if enabled
      if (headerData?.siteBackgroundDarkness > 0) {
        const overlay = document.createElement('div');
        overlay.className = 'site-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100})`;
        overlay.style.zIndex = '-1';
        mainContent.appendChild(overlay);
      }

      // Reset main content styles
      mainContent.style.background = 'none';
      mainContent.style.backgroundColor = 'transparent';
      mainContent.style.filter = 'none';
    }
  }, [headerData]);

  useEffect(() => {
    console.log('[PagePreview] Setting up message listener');
    
    // Добавляем небольшую задержку перед установкой обработчика сообщений, 
    // чтобы убедиться, что состояние изображений инициализировано
    const timeoutId = setTimeout(() => {
      console.log('[PagePreview] Message listener activated after delay');
      window.addEventListener('message', handleMessage);
    }, 500);
    
    return () => {
      console.log('[PagePreview] Removing message listener');
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  // Обработчик изменений настроек фона
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const backgroundImage = mainContent.querySelector('.background-image');
    const overlay = mainContent.querySelector('.site-overlay');

    if (backgroundImage) {
      backgroundImage.style.transition = 'filter 0.3s ease-in-out';
      backgroundImage.style.filter = `blur(${backgroundSettings.blur}px)`;
    }

    if (overlay) {
      overlay.style.transition = 'background-color 0.3s ease-in-out';
      overlay.style.backgroundColor = `rgba(0, 0, 0, ${backgroundSettings.darkness / 100})`;
    }
  }, [backgroundSettings]);

  // Обновление настроек при изменении headerData
  useEffect(() => {
    setBackgroundSettings({
      blur: headerData?.siteBackgroundBlur || 0,
      darkness: headerData?.siteBackgroundDarkness || 0
    });
  }, [headerData]);

  return (
    <>
      <style>{globalStyles}</style>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
      }} className="preview-area">
        <Box
          ref={el => {
            if (el) {
              sectionRefs.current['header'] = el;
            }
          }}
          id="header"
        >
          <Header 
            headerData={headerData} 
            onMenuClick={handleMenuClick}
            contactData={contactData}
          />
        </Box>
        <Box component="main" sx={{ 
          flexGrow: 1,
          position: 'relative'
        }}>
          <Box
            ref={heroSectionRef}
            id="hero"
          >
            <HeroSection 
              title={heroData.title}
              subtitle={heroData.subtitle}
              backgroundType={heroData.backgroundType}
              backgroundImage={heroData.backgroundImage}
              backgroundVideo={heroData.backgroundVideo}
              backgroundGif={heroData.backgroundGif}
              backgroundColor={heroData.backgroundColor}
              gradientColor1={heroData.gradientColor1}
              gradientColor2={heroData.gradientColor2}
              gradientDirection={heroData.gradientDirection}
              titleColor={heroData.titleColor}
              subtitleColor={heroData.subtitleColor}
              animationType={heroData.animationType}
              enableOverlay={heroData.enableOverlay}
              overlayOpacity={heroData.overlayOpacity}
              enableBlur={heroData.enableBlur}
              blurAmount={heroData.blurAmount}
              videoAutoplay={heroData.videoAutoplay}
              videoLoop={heroData.videoLoop}
              videoMuted={heroData.videoMuted}
              videoControls={heroData.videoControls}
            />
          </Box>
          {Object.entries(sectionsData || {}).map(([sectionId, sectionContent]) => (
            <Box
              key={sectionId}
              id={sectionId}
              ref={el => {
                if (el) {
                  sectionRefs.current[sectionId] = el;
                }
              }}
              sx={{
                position: 'relative',
                mb: 4,
                p: 2,
                border: showBorders ? '1px dashed rgba(0, 0, 0, 0.12)' : 'none',
                borderRadius: 1,
                '&:hover': {
                  border: showBorders ? '1px dashed #1976d2' : 'none'
                }
              }}
            >
              {renderSection(sectionContent)}
            </Box>
          ))}
          <Box
            ref={contactSectionRef}
            id="contact"
            sx={{ py: 8 }}
          >
            <ContactSection 
              contactData={contactData}
              showBorders={showBorders}
            />
          </Box>
        </Box>
        <Box
          ref={el => {
            if (el) {
              sectionRefs.current['footer'] = el;
            }
          }}
          id="footer"
        >
          <FooterSection 
            footerData={footerData}
            contactData={contactData}
            legalDocuments={legalDocuments}
            headerData={headerData}
          />
        </Box>
        
        {/* Live Chat Widget */}
        {liveChatData?.enabled && (
          <LiveChatWidget 
            siteName={headerData?.siteName || 'Мой сайт'} 
            apiKey={liveChatData?.apiKey || ''} 
          />
        )}
      </Box>
    </>
  );
};

export default PagePreview; 