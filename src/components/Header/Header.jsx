import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Link,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RunningLine from './RunningLine';

const Header = ({ headerData, onMenuClick, contactData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (onMenuClick) {
      onMenuClick(sectionId);
    }
    
    // Добавляем плавную прокрутку к разделу
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Box>
      <RunningLine
        enabled={headerData.runningLine?.enabled}
        text={headerData.runningLine?.text}
        speed={headerData.runningLine?.speed}
        backgroundColor={headerData.runningLine?.backgroundColor}
        textColor={headerData.runningLine?.textColor}
        fontSize={headerData.runningLine?.fontSize}
        fontWeight={headerData.runningLine?.fontWeight}
        fontFamily={headerData.runningLine?.fontFamily}
        textStyle={headerData.runningLine?.textStyle}
        lineHeight={headerData.runningLine?.lineHeight}
        padding={headerData.runningLine?.padding}
      />
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: headerData.backgroundColor,
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
      <Toolbar sx={{ flexDirection: isMobile ? 'column' : 'row', py: isMobile ? 2 : 1 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          flexGrow: 1,
          mb: isMobile ? 2 : 0
        }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: headerData.titleColor,
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {headerData.siteName}
          </Typography>
          {headerData.domain && (
            <Typography
              variant="subtitle2"
              sx={{
                color: headerData.titleColor,
                opacity: 0.8,
                fontSize: '0.9rem',
                mt: 0.5,
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              {headerData.domain}
            </Typography>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: isMobile ? 'center' : 'flex-end',
          width: isMobile ? '100%' : 'auto'
        }}>
          {!isMobile && headerData.menuItems?.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              onClick={(e) => handleLinkClick(e, item.id)}
              sx={{
                color: headerData.linksColor,
                textDecoration: 'none',
                fontSize: headerData.styles?.menuItemFontSize || '16px',
                fontWeight: headerData.styles?.menuItemFontWeight || '500',
                transition: headerData.styles?.menuItemTransition || '0.3s',
                '&:hover': {
                  color: headerData.styles?.menuItemHoverColor || '#1976d2'
                }
              }}
            >
              {item.text}
            </Link>
          ))}
          {!isMobile && (
            <Link
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              sx={{
                color: headerData.linksColor,
                textDecoration: 'none',
                fontSize: headerData.styles?.menuItemFontSize || '16px',
                fontWeight: headerData.styles?.menuItemFontWeight || '500',
                transition: headerData.styles?.menuItemTransition || '0.3s',
                '&:hover': {
                  color: headerData.styles?.menuItemHoverColor || '#1976d2'
                }
              }}
            >
              {contactData?.title || 'Свяжитесь с нами'}
            </Link>
          )}

          {/* Мобильное меню */}
          {isMobile && (
            <IconButton
              sx={{ color: headerData.titleColor }}
              aria-label="menu"
              onClick={() => {/* TODO: Добавить открытие мобильного меню */}}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    </Box>
  );
};

export default Header; 