export const CARD_TYPES = {
  NONE: 'none',
  SIMPLE: 'simple',
  ACCENT: 'accent',
  ELEVATED: 'elevated',
  OUTLINED: 'outlined',
  GRADIENT: 'gradient'
};

export const BACKGROUND_TYPES = {
  SOLID: 'solid',
  GRADIENT: 'gradient'
};

export const GRADIENT_DIRECTIONS = {
  TO_RIGHT: 'to right',
  TO_LEFT: 'to left',
  TO_BOTTOM: 'to bottom',
  TO_TOP: 'to top',
  TO_BOTTOM_RIGHT: 'to bottom right',
  TO_BOTTOM_LEFT: 'to bottom left',
  TO_TOP_RIGHT: 'to top right',
  TO_TOP_LEFT: 'to top left'
};

export const defaultConfig = {
  header: {
    title: 'Новый сайт',
    backgroundColor: '#ffffff',
    titleColor: '#000000',
    linksColor: '#000000',
    domain: '',
    menuItems: []
  },
  hero: {
    title: 'Добро пожаловать',
    subtitle: 'Наш сайт предлагает лучшие решения',
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    gradientColor1: '#ffffff',
    gradientColor2: '#f5f5f5',
    gradientDirection: 'to right',
    backgroundImage: '',
    titleColor: '#000000',
    subtitleColor: '#666666'
  },
  sections: []
};

export const createSection = (id, title, cardType = CARD_TYPES.SIMPLE) => ({
  id,
  title,
  description: '',
  cardType,
  backgroundType: BACKGROUND_TYPES.SOLID,
  backgroundColor: '#ffffff',
  titleColor: '#1a237e',
  descriptionColor: '#455a64',
  contentColor: '#455a64',
  showBackground: true,
  cards: []
});

export const createCard = (id, title, content) => ({
  id,
  title,
  content,
  showTitle: true,
  titleColor: '#000000',
  contentColor: '#333333',
  backgroundType: BACKGROUND_TYPES.SOLID,
  backgroundColor: '#ffffff'
});

export const applyConfig = (config, setHeaderData, setHeroData, setSectionsData) => {
  // Применяем настройки header
  setHeaderData({
    title: config.header.title,
    backgroundColor: config.header.backgroundColor,
    titleColor: config.header.titleColor,
    linksColor: config.header.linksColor,
    menuItems: config.header.menuItems
  });

  // Применяем настройки hero
  setHeroData({
    title: config.hero.title,
    subtitle: config.hero.subtitle,
    backgroundType: config.hero.backgroundType,
    backgroundColor: config.hero.backgroundColor,
    gradientColor1: config.hero.gradientColor1,
    gradientColor2: config.hero.gradientColor2,
    gradientDirection: config.hero.gradientDirection,
    backgroundImage: config.hero.backgroundImage,
    backgroundVideo: config.hero.backgroundVideo,
    titleColor: config.hero.titleColor,
    subtitleColor: config.hero.subtitleColor,
    videoAutoplay: config.hero.videoAutoplay,
    videoLoop: config.hero.videoLoop,
    videoMuted: config.hero.videoMuted,
    videoControls: config.hero.videoControls
  });

  // Применяем настройки секций
  const sections = config.sections.map(section => ({
    ...section,
    cards: section.cards || []
  }));

  setSectionsData(sections);
};

export const generateConfig = (headerData, heroData, sectionsData) => {
  return {
    header: {
      title: headerData.title,
      backgroundColor: headerData.backgroundColor,
      titleColor: headerData.titleColor,
      linksColor: headerData.linksColor,
      menuItems: headerData.menuItems
    },
    hero: {
      title: heroData.title,
      subtitle: heroData.subtitle,
      backgroundType: heroData.backgroundType,
      backgroundColor: heroData.backgroundColor,
      gradientColor1: heroData.gradientColor1,
      gradientColor2: heroData.gradientColor2,
      gradientDirection: heroData.gradientDirection,
      backgroundImage: heroData.backgroundImage,
      backgroundVideo: heroData.backgroundVideo,
      titleColor: heroData.titleColor,
      subtitleColor: heroData.subtitleColor,
      videoAutoplay: heroData.videoAutoplay,
      videoLoop: heroData.videoLoop,
      videoMuted: heroData.videoMuted,
      videoControls: heroData.videoControls
    },
    sections: sectionsData.map(section => ({
      ...section,
      cards: section.cards || []
    }))
  };
};

export const initialHeaderData = {
  siteName: "VitaHealth",
  titleColor: "#2E7D32",
  backgroundColor: "#ffffff",
  linksColor: "#2E7D32",
  menuItems: [
    {
      id: 1,
      title: "Главная",
      url: "#home"
    },
    {
      id: 2,
      title: "О нас",
      url: "#about"
    },
    {
      id: 3,
      title: "Программы",
      url: "#programs"
    },
    {
      id: 4,
      title: "Тренеры",
      url: "#trainers"
    },
    {
      id: 5,
      title: "Отзывы",
      url: "#reviews"
    }
  ]
};

export const initialFooterData = {
  backgroundColor: "#2E7D32",
  textColor: "#ffffff",
  companyName: "VitaHealth",
  phone: "+7 (495) 123-45-67",
  email: "info@vitahealth.ru",
  address: "г. Москва, ул. Здоровья, д. 15, офис 304",
  showSocialLinks: false,
  socialLinks: [
    {
      name: "Facebook",
      url: "https://facebook.com/vitahealth",
      icon: "facebook"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/vitahealth",
      icon: "instagram"
    },
    {
      name: "Telegram",
      url: "https://t.me/vitahealth",
      icon: "telegram"
    },
    {
      name: "VK",
      url: "https://vk.com/vitahealth",
      icon: "vk"
    }
  ],
  menuItems: [
    {
      id: 1,
      title: "Главная",
      url: "#home"
    },
    {
      id: 2,
      title: "О нас",
      url: "#about"
    },
    {
      id: 3,
      title: "Программы",
      url: "#programs"
    },
    {
      id: 4,
      title: "Тренеры",
      url: "#trainers"
    },
    {
      id: 5,
      title: "Отзывы",
      url: "#reviews"
    }
  ],
  documents: [
    {
      title: "Политика конфиденциальности",
      url: "/privacy"
    },
    {
      title: "Пользовательское соглашение",
      url: "/terms"
    }
  ],
  copyrightYear: 2024,
  copyrightText: "Все права защищены"
}; 