import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import EditorPanel from '../components/Editor/EditorPanel';
import PagePreview from '../components/Preview/PagePreview';
import HeroEditor from '../components/Editor/HeroEditor';
import { CARD_TYPES } from '../utils/configUtils';
import AiParser from '../components/AiParser/AiParser';

const initialHeaderData = {
  siteName: 'Юридическая компания "Право и Защита"',
  title: '', // Пустое значение для автоматической подстановки из siteName
  description: 'Наш сайт предлагает лучшие решения', // Значение по умолчанию
  titleColor: '#2196f3',
  backgroundColor: '#e3f2fd',
  linksColor: '#1976d2',
  domain: '',
  siteBackgroundColor: '#f8f9fa',
  siteBackgroundType: 'gradient',
  siteGradientColor1: '#e3f2fd',
  siteGradientColor2: '#bbdefb',
  siteGradientDirection: 'to right',
  menuItems: [],
  contactLink: {
    show: true,
    text: 'Свяжитесь с нами',
    url: '#contact',
    color: '#000000'
  },
  logo: {
    show: true,
    url: '',
    alt: 'Логотип компании'
  },
  phone: {
    show: true,
    number: '+7 (XXX) XXX-XX-XX',
    color: '#000000'
  },
  email: {
    show: true,
    address: 'info@example.com',
    color: '#000000'
  },
  socialLinks: {
    show: true,
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  },
  search: {
    show: true,
    placeholder: 'Поиск...'
  },
  language: {
    show: true,
    current: 'ru',
    options: ['ru', 'en']
  },
  styles: {
    headerHeight: '80px',
    menuItemSpacing: '20px',
    menuItemHoverColor: '#1976d2',
    menuItemActiveColor: '#1565c0',
    menuItemFontSize: '16px',
    menuItemFontWeight: '500',
    menuItemTransition: '0.3s',
    logoWidth: '150px',
    logoHeight: 'auto',
    contactButtonPadding: '8px 16px',
    contactButtonBorderRadius: '4px',
    contactButtonBackground: '#1976d2',
    contactButtonHoverBackground: '#1565c0',
    searchWidth: '200px',
    searchBorderRadius: '4px',
    searchBorderColor: '#e0e0e0',
    searchFocusBorderColor: '#1976d2',
    socialIconSize: '24px',
    socialIconColor: '#000000',
    socialIconHoverColor: '#1976d2',
    languageSelectorWidth: '100px',
    languageSelectorBorderRadius: '4px',
    languageSelectorBorderColor: '#e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000,
    sticky: true,
    transparent: false,
    blurEffect: false,
    blurAmount: 5
  }
};

const initialHeroData = {
  title: 'Профессиональные юридические услуги',
  subtitle: '',
  backgroundType: 'image',
  backgroundColor: '#ffffff',
  gradientColor1: '#ffffff',
  gradientColor2: '#f5f5f5',
  gradientDirection: 'to right',
  backgroundImage: '/images/hero/hero.jpg',
  titleColor: '#2196f3',
  subtitleColor: '#64b5f6',
  animationType: 'zoom',
  enableOverlay: true,
  overlayOpacity: 0.1,
  enableBlur: true,
  blurAmount: 0.1,
  // Настройки обрезки видео по умолчанию выключены
  videoCropBottom: false,
  videoCropRight: false,
  videoCropTop: false,
  videoRemovePostback: false
};

const initialSectionsData = [];

const initialContactData = {
  title: 'Свяжитесь с нами',
  description: 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время. Наша команда юристов готова ответить на все ваши вопросы и предоставить профессиональную консультацию.',
  companyName: 'Юридическая компания "Право и Защита"',
  address: 'г. Москва, ул. Якиманка, д. 12',
  phone: '+7 (495) 123-45-67',
  email: 'info@pravo-zashita.ru',
  mapCoordinates: {
    lat: 55.7558,
    lng: 37.6173
  },
  titleColor: '#1a237e',
  descriptionColor: '#283593',
  companyInfoColor: '#0d47a1',
  formVariant: 'outlined',
  infoVariant: 'outlined',
  formBackgroundColor: '#ffffff',
  infoBackgroundColor: '#ffffff',
  formBorderColor: '#d32f2f',
  infoBorderColor: '#b71c1c',
  formBorderWidth: '5px',
  infoBorderWidth: '5px',
  titleFont: 'bold',
  textFont: 'default'
};

const initialFooterData = {
  backgroundColor: '#d32f2f',
  textColor: '#ffffff',
  companyName: 'Юридическая компания "Право и Защита"',
  phone: '+7 (495) 123-45-67',
  email: 'info@pravo-zashita.ru',
  address: 'г. Москва, ул. Якиманка, д. 12',
  showSocialLinks: true,
  socialLinks: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  },
  copyrightYear: new Date().getFullYear(),
  copyrightText: 'Все права защищены',
  legalDocuments: {
    privacyPolicyTitle: 'Политика конфиденциальности',
    termsOfServiceTitle: 'Пользовательское соглашение',
    cookiePolicyTitle: 'Политика использования cookie'
  }
};

const saveDocumentToFile = async (documentName, content) => {
  try {
    if (!content) {
      console.warn(`Empty content for ${documentName}`);
      return;
    }

    const response = await fetch('/api/save-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentName,
        content: content.trim() // Удаляем лишние пробелы
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to save document: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully saved ${documentName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error saving ${documentName}:`, error);
    throw error; // Пробрасываем ошибку для обработки выше
  }
};

export default function Home() {
  const [headerData, setHeaderData] = useState(initialHeaderData);
  const [heroData, setHeroData] = useState(initialHeroData);
  const [sectionsData, setSectionsData] = useState(initialSectionsData);
  const [contactData, setContactData] = useState(initialContactData);
  const [footerData, setFooterData] = useState({
    ...initialFooterData,
    menuItems: initialHeaderData.menuItems,
    showSocialLinks: false,
    legalDocuments: {
      privacyPolicyTitle: 'Политика конфиденциальности',
      termsOfServiceTitle: 'Пользовательское соглашение',
      cookiePolicyTitle: 'Политика использования cookie',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Пользовательское соглашение',
      cookiePolicy: 'Политика использования cookie'
    }
  });
  const [liveChatData, setLiveChatData] = useState({
    enabled: true,
    apiKey: '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'
  });

  console.log('Home component state:', {
    headerData,
    heroData,
    sectionsData,
    contactData,
    footerData
  });

  const handleHeaderChange = (newHeaderData) => {
    console.log('handleHeaderChange called with:', newHeaderData);
    setHeaderData(newHeaderData);
    
    // Обновляем футер
    setFooterData(prev => {
      const newFooterData = {
        ...prev,
        menuItems: newHeaderData.menuItems,
        backgroundColor: newHeaderData.backgroundColor,
        textColor: newHeaderData.titleColor,
        companyNameColor: newHeaderData.titleColor,
        phoneColor: newHeaderData.titleColor,
        emailColor: newHeaderData.titleColor,
        addressColor: newHeaderData.titleColor,
        copyrightTextColor: newHeaderData.titleColor,
        socialLinksColor: newHeaderData.titleColor,
        menuItemsColor: newHeaderData.titleColor,
        legalDocumentsColor: newHeaderData.titleColor
      };
      console.log('Footer data updated:', newFooterData);
      return newFooterData;
    });

    // Обновляем hero секцию
    setHeroData(prev => {
      const newHeroData = {
        ...prev,
        titleColor: newHeaderData.titleColor,
        subtitleColor: newHeaderData.linksColor
      };
      console.log('Hero data updated:', newHeroData);
      return newHeroData;
    });
  };

  const handleHeroChange = (newHeroData) => {
    console.log('🎬 handleHeroChange called with:', newHeroData);
    console.log('🎬 Предыдущий heroData:', heroData);
    setHeroData(newHeroData);
  };

  const handleSectionsChange = (newSectionsData) => {
    console.log('handleSectionsChange called with:', newSectionsData);
    setSectionsData(newSectionsData);
  };

  const handleContactChange = (newContactData) => {
    console.log('handleContactChange called with:', newContactData);
    setContactData(newContactData);
  };

  const handleFooterChange = (newFooterData) => {
    console.log('handleFooterChange called with:', newFooterData);
    setFooterData(newFooterData);
  };

  const handleLegalDocumentsChange = async (documents) => {
    console.log('handleLegalDocumentsChange called with:', documents);
    
    try {
      // Сначала обновляем состояние для мгновенного отображения
      setFooterData(prev => {
        const newData = {
          ...prev,
          legalDocuments: {
            ...prev.legalDocuments,
            ...documents
          }
        };
        console.log('Footer data updated with legal documents:', newData);
        return newData;
      });

      // Затем сохраняем в файлы
      const savePromises = [
        saveDocumentToFile('privacy-policy', documents.privacyPolicy),
        saveDocumentToFile('terms-of-service', documents.termsOfService),
        saveDocumentToFile('cookie-policy', documents.cookiePolicy)
      ];

      const results = await Promise.allSettled(savePromises);
      
      // Проверяем результаты сохранения
      const hasErrors = results.some(result => result.status === 'rejected');
      if (hasErrors) {
        console.error('Some documents failed to save:', results);
        // Можно добавить уведомление пользователю об ошибке
      }
    } catch (error) {
      console.error('Error in handleLegalDocumentsChange:', error);
      // Можно добавить уведомление пользователю об ошибке
    }
  };

  const handleLiveChatChange = (newLiveChatData) => {
    console.log('handleLiveChatChange called with:', newLiveChatData);
    setLiveChatData(newLiveChatData);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      height: isMobile ? 'auto' : '100vh'
    }}>
      <Box sx={{ 
        width: isMobile ? '100%' : '400px',
        flexShrink: 0,
        borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
        borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
        overflow: 'auto',
        maxHeight: isMobile ? '50vh' : '100vh',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '2px',
        },
      }}>
        <EditorPanel
          headerData={headerData}
          onHeaderChange={handleHeaderChange}
          sectionsData={sectionsData}
          onSectionsChange={handleSectionsChange}
          heroData={heroData}
          onHeroChange={handleHeroChange}
          contactData={contactData}
          onContactChange={handleContactChange}
          footerData={footerData}
          onFooterChange={handleFooterChange}
          legalDocuments={footerData.legalDocuments}
          onLegalDocumentsChange={handleLegalDocumentsChange}
          liveChatData={liveChatData}
          onLiveChatChange={handleLiveChatChange}
        />
      </Box>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        height: isMobile ? '50vh' : '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <PagePreview
          headerData={headerData}
          heroData={heroData}
          sectionsData={sectionsData}
          footerData={footerData}
          contactData={contactData}
          legalDocuments={footerData.legalDocuments}
          liveChatData={liveChatData}
        />
      </Box>
    </Box>
  );
} 