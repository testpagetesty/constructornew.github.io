// Утилита для очистки email от markdown-разметки
const cleanEmail = (text) => {
  if (!text) return text;
  // Убираем markdown-разметку для ссылок вида [email](mailto:email)
  const markdownLinkRegex = /\[(.*?)\]\(mailto:(.*?)\)/;
  const match = text.match(markdownLinkRegex);
  if (match) {
    return match[2]; // Возвращаем email из mailto:
  }
  return text;
};

// Функция для очистки всех email в тексте
const cleanEmailsInText = (text) => {
  if (!text) return text;
  return text.replace(/\[(.*?)\]\(mailto:(.*?)\)/g, '$2');
};

// Ключевые слова для идентификации разделов в тексте
export const SECTION_KEYWORDS = {
  SERVICES: ['услуги', 'сервисы', 'что мы делаем', 'services', 'what we do', 'our services'],
  FEATURES: ['преимущества', 'особенности', 'почему мы', 'features', 'advantages', 'why us'],
  ABOUT: ['о нас', 'о компании', 'кто мы', 'about us', 'about company', 'who we are'],
  TESTIMONIALS: ['отзывы', 'мнения клиентов', 'что говорят', 'testimonials', 'reviews', 'what people say'],
  FAQ: ['вопросы и ответы', 'часто задаваемые вопросы', 'faq', 'frequently asked questions'],
  NEWS: ['новости', 'блог', 'события', 'news', 'blog', 'events'],
  CONTACTS: ['контакты', 'свяжитесь с нами', 'связаться', 'contacts', 'contact us', 'get in touch'],
  LEGAL: ['правовые документы', 'документы', 'политика', 'соглашение', 'legal documents', 'policy', 'terms']
};

// Функция для генерации случайного телефонного номера, сохраняя исходный формат
const generateRandomEmail = (siteName) => {
  const emailPrefixes = [
    'info', 'contact', 'office', 'hello', 'support', 'mail', 'team', 'admin',
    'service', 'sales', 'clients', 'help', 'legal', 'company', 'director',
    'manager', 'secretary', 'consulting', 'general', 'reception', 'inquiry', 
    'hr', 'jobs', 'career', 'business', 'partners', 'marketing', 'press',
    'welcome', 'connect', 'reach', 'assist', 'communicate', 'engage', 'relate'
  ];
  
  const universalDomains = [
    'businesscorp', 'globalgroup', 'proservice', 'expertteam', 'qualitywork',
    'professional', 'excellence', 'premium', 'worldwide', 'international',
    'consulting', 'solutions', 'services', 'company', 'corporation',
    'enterprise', 'business', 'group', 'team', 'expert', 'quality',
    'reliable', 'trusted', 'leading', 'advanced', 'innovative', 'modern',
    'digital', 'online', 'network', 'global', 'success', 'growth',
    'development', 'progress', 'achievement', 'performance', 'excellence',
    // Добавляем еще 50 универсальных доменов
    'smartbusiness', 'topcompany', 'bestservice', 'quicksolutions', 'fastwork',
    'easyaccess', 'perfectchoice', 'strongteam', 'brightfuture', 'newvision',
    'bigideas', 'freshstart', 'cleanwork', 'sharpfocus', 'deepknowledge',
    'widerange', 'fullservice', 'totalcare', 'maxresults', 'superb-co',
    'first-class', 'top-notch', 'high-end', 'next-level', 'cutting-edge',
    'state-of-art', 'world-class', 'industry-best', 'market-leader', 'trend-setter',
    'game-changer', 'breakthrough', 'milestone', 'benchmark', 'goldstandard',
    'platinum-group', 'diamond-corp', 'crystal-clear', 'rock-solid', 'iron-strong',
    'steel-works', 'titanium-co', 'silver-line', 'copper-solutions', 'bronze-level',
    'emerald-group', 'sapphire-corp', 'ruby-solutions', 'pearl-company', 'amber-works',
    'coral-group', 'jade-solutions', 'opal-corp', 'quartz-company', 'granite-group'
  ];
  
  const randomPrefix = emailPrefixes[Math.floor(Math.random() * emailPrefixes.length)];
  
  if (siteName) {
    // Пытаемся создать домен на основе названия сайта
    let domainName = siteName
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Транслитерация кириллицы
    domainName = domainName.replace(/[а-яё]/g, char => {
      const translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return translit[char] || char;
    });
    
    // Проверяем, остались ли неанглийские символы (китайский, арабский, японский и т.д.)
    const hasNonEnglish = /[^a-z0-9-]/.test(domainName);
    
    // Если остались неанглийские символы или домен слишком короткий/длинный
    if (hasNonEnglish || domainName.length < 2 || domainName.length > 25) {
      // Используем случайный универсальный домен
      const randomDomain = universalDomains[Math.floor(Math.random() * universalDomains.length)];
      return `${randomPrefix}@${randomDomain}.com`;
    } else {
      // Используем обработанное название сайта
      return `${randomPrefix}@${domainName}.com`;
    }
  } else {
    // Если нет названия сайта, используем случайный универсальный домен
    const randomDomain = universalDomains[Math.floor(Math.random() * universalDomains.length)];
    return `${randomPrefix}@${randomDomain}.com`;
  }
};

const generateRandomPhone = (originalPhone) => {
  // Если номер не предоставлен, создаем стандартный российский формат
  if (!originalPhone) {
    const cityCodes = ['495', '499', '812', '383', '343', '831'];
    const cityCode = cityCodes[Math.floor(Math.random() * cityCodes.length)];
    
    // Генерируем 7 случайных цифр
    let digits = '';
    for (let i = 0; i < 7; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    
    return `+7 (${cityCode}) ${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5, 7)}`;
  }
  
  // Извлекаем все цифры из исходного номера
  const allDigits = originalPhone.replace(/\D/g, '');
  
  // Определяем, сколько цифр нужно сохранить с начала (все кроме последних 7)
  const digitsToPersist = Math.max(0, allDigits.length - 7);
  const persistedPart = allDigits.substring(0, digitsToPersist);
  
  // Генерируем 7 случайных цифр для замены
  let randomDigits = '';
  for (let i = 0; i < 7; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  
  // Если оригинал содержит только цифры, то просто объединяем части
  if (originalPhone.match(/^\d+$/)) {
    return persistedPart + randomDigits;
  }
  
  // Для форматированных номеров - заменяем последние 7 цифр, сохраняя форматирование
  let result = originalPhone;
  let replacedCount = 0;
  
  // Заменяем цифры с конца, сохраняя форматирование
  for (let i = originalPhone.length - 1; i >= 0 && replacedCount < 7; i--) {
    if (/\d/.test(originalPhone[i])) {
      result = result.substring(0, i) + randomDigits[6 - replacedCount] + result.substring(i + 1);
      replacedCount++;
    }
  }
  
  return result;
};

// Функция для удаления инструкций из текста секции
const cleanSectionContent = (content) => {
  // Удаляем строки, которые похожи на инструкции
  return content
    .split('\n')
    .filter(line => {
      const trimmedLine = line.trim();
      // Фильтруем инструктивные строки и пустые строки
      return trimmedLine && 
        !trimmedLine.match(/^\d+\./) && // Строки вида "1.", "2."
        !trimmedLine.match(/^\[\d+-\d+/) && // Строки вида "[4-6"
        !trimmedLine.match(/^\[[^\]]+\]/) && // Строки в квадратных скобках
        !trimmedLine.match(/^\(/) && // Строки в круглых скобках
        // Убираем лишнюю фильтрацию по ID - пусть парсеры сами обрабатывают ID строки
        // !trimmedLine.match(/^ID[:\s]/i) && // "ID:" или "ID " с любой локализацией 
        trimmedLine !== 'О нас' && // Заголовки навигации
        trimmedLine !== 'Услуги' &&
        trimmedLine !== 'Преимущества' &&
        trimmedLine !== 'Отзывы' &&
        trimmedLine !== 'Вопросы и ответы' &&
        trimmedLine !== 'About Us' &&
        trimmedLine !== 'Services' &&
        trimmedLine !== 'Features' &&
        trimmedLine !== 'Testimonials' &&
        trimmedLine !== 'FAQ';
    })
    .join('\n');
};

export const cleanSectionId = (id) => {
  if (!id) return '';
  return id.toLowerCase()
    // Поддержка всех нужных символов:
    // - латиница, кириллица (a-zа-яё)
    // - китайский основной (\u4e00-\u9fff)
    // - китайский расширенный-A (\u3400-\u4DBF)
    // - китайский расширенный-B (\u20000-\u2A6DF)
    // - китайский совместимости (\uF900-\uFAFF)
    // - корейский хангыль (\uac00-\ud7af)
    // - корейский джамо (\u1100-\u11FF)
    // - корейский совместимости джамо (\u3130-\u318F)
    // - японская хирагана (\u3040-\u309F)
    // - японская катакана (\u30A0-\u30FF)
    // - японская катакана расширенная (\u31F0-\u31FF)
    // - японские пунктуация и символы (\u3000-\u303F)
    // - арабский основной (\u0600-\u06FF)
    // - арабский дополнительный (\u0750-\u077F)
    // - арабский расширенный-A (\u08A0-\u08FF)
    // - арабские формы представления-A (\uFB50-\uFDFF)
    // - арабские формы представления-B (\uFE70-\uFEFF)
    // - иврит (\u0590-\u05FF)
    // - иврит расширенный (\uFB1D-\uFB4F)
    // - хинди деванагари (\u0900-\u097F)
    // - деванагари расширенный (\uA8E0-\uA8FF)
    // - бенгальский (\u0980-\u09FF)
    // - гурмукхи (\u0A00-\u0A7F)
    // - гуджарати (\u0A80-\u0AFF)
    // - тамильский (\u0B80-\u0BFF)
    // - телугу (\u0C00-\u0C7F)
    // - каннада (\u0C80-\u0CFF)
    // - малаялам (\u0D00-\u0D7F)
    // - тайский (\u0E00-\u0E7F)
    // - тайский расширенный (\u0E80-\u0EFF)
    // - греческий и коптский (\u0370-\u03FF)
    // - греческий расширенный (\u1F00-\u1FFF)
    // - вьетнамский (\u0102-\u0103\u0110-\u0111\u0128-\u0129\u0168-\u0169\u01A0-\u01A1\u01AF-\u01B0\u1EA0-\u1EF9)
    // - все диакритические знаки для европейских языков (\u00C0-\u00FF\u0100-\u017F)
    .replace(/[^a-zа-яё0-9\u4e00-\u9fff\u3400-\u4DBF\u20000-\u2A6DF\uF900-\uFAFF\uac00-\ud7af\u1100-\u11FF\u3130-\u318F\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3000-\u303F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF\uFB1D-\uFB4F\u0900-\u097F\uA8E0-\uA8FF\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0E80-\u0EFF\u0370-\u03FF\u1F00-\u1FFF\u0102-\u0103\u0110-\u0111\u0128-\u0129\u0168-\u0169\u01A0-\u01A1\u01AF-\u01B0\u1EA0-\u1EF9\u00C0-\u00FF\u0100-\u017F]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Функции парсинга для разных типов контента
export const parseServices = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'services';
    let sectionTitle = '';
    let sectionDescription = '';
    const cards = [];
    let currentCard = null;
    let isProcessingContacts = false;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Обработка пустых строк
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Проверяем, не начинается ли секция контактной информации
      if (line.toLowerCase().includes('контактная информация')) {
        isProcessingContacts = true;
        if (currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }

      // Пропускаем обработку контактной информации
      if (isProcessingContacts || 
          line.toLowerCase().includes('телефон:') || 
          line.toLowerCase().includes('email:') || 
          line.toLowerCase().includes('адрес:') ||
          line.toLowerCase().includes('мы готовы')) {
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции услуг:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
      }

      // Обработка карточек услуг
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `service_${cards.length + 1}`,
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Юридические услуги',
      description: sectionDescription || '',
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff'
      })),
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
  } catch (error) {
    console.error('Ошибка при парсинге секции услуг:', error);
    return null;
  }
};

export const parseHero = (content) => {
  try {
    // Очищаем текст от инструкций
    const cleanedContent = cleanSectionContent(content);
    
    const lines = cleanedContent.split('\n').filter(line => line.trim());
    
    const heroData = {
      siteName: '',
      title: '',
      description: ''
    };
    
    // Берем первые три непустые строки после фильтрации
    if (lines.length >= 1) heroData.siteName = lines[0].trim();
    if (lines.length >= 2) heroData.title = lines[1].trim();
    if (lines.length >= 3) heroData.description = lines[2].trim();
    
    // Проверяем, что данные не пусты
    if (!heroData.siteName || !heroData.title || !heroData.description) {
      console.warn('parseHero: Incomplete hero data', heroData);
    }
    
    return heroData;
  } catch (error) {
    console.error('Error parsing hero section:', error);
    return null;
  }
};

export const parseAdvantagesSection = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'features'; // Default value
    let sectionTitle = '';
    let sectionDescription = '';
    let menuText = '';
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Handle empty lines
      if (!line) {
        emptyLineCount++;
        if (emptyLineCount >= 2 && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции преимуществ:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
        continue;
      }

      // Обработка карточек преимуществ
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `feature_${cards.length + 1}`,
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    return {
      id: sectionId,
      title: sectionTitle || 'Наши преимущества',
      description: sectionDescription || '',
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff'
      })),
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };
  } catch (error) {
    console.error('Error parsing advantages:', error);
    return null;
  }
};

export const parseAboutSection = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'about';
    let sectionTitle = '';
    let sectionDescription = '';
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Обработка пустых строк
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции о нас:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
      }

      // Обработка карточек "О нас" - используем тот же подход, что и в parseServices
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `about_${cards.length + 1}`,
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'О нас',
      description: sectionDescription || 'Наша компания',
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      })),
      link: `#${sectionId}`,
      imagePath: '/images/about.jpg',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
  } catch (error) {
    console.error('Ошибка при парсинге секции о нас:', error);
    return null;
  }
};

export const parseTestimonials = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'отзывы'; // Значение по умолчанию
    let sectionTitle = '';
    let sectionDescription = '';
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Обработка пустых строк
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции отзывов:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
      }

      // Обработка карточек отзывов
      if (sectionDescription && !isHeaderSection) {
        // Если это имя автора (короткая строка)
        if (line.length < 50 && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `testimonial_${cards.length + 1}`,
            author: line,
            content: ''
          };
        } else if (currentCard) {
          // Добавляем текст отзыва
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в отзывах
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Отзывы клиентов',
      description: sectionDescription || '',
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        title: card.author, // Используем имя автора как заголовок карточки
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      })),
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
  } catch (error) {
    console.error('Error parsing testimonials:', error);
    return null;
  }
};

export const parseFaq = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'faq'; // Default value
    let sectionTitle = '';
    let sectionDescription = '';
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Handle empty lines
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции вопросов и ответов:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
      }

      // Process FAQ cards
      if (sectionDescription && !isHeaderSection) {
        if ((line.endsWith('?') || line.endsWith('؟') || line.length < 100) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `faq_${cards.length + 1}`,
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Add the last card if exists
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в вопросах и ответах
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content),
      title: cleanEmailsInText(card.title)
    }));

    // Create section data structure
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Часто задаваемые вопросы',
      description: sectionDescription || 'Ответы на популярные вопросы наших клиентов',
      cardType: 'ACCENT',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      })),
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
  } catch (error) {
    console.error('Error parsing FAQ:', error);
    return null;
  }
};

export const parseNews = (content) => {
  try {
    console.log('Начинаем парсинг новостей, содержимое:', content.substring(0, 100) + '...');
    
    const lines = content.split('\n');
    let sectionId = 'новости'; // Значение по умолчанию
    let sectionTitle = '';
    let sectionDescription = '';
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Handle empty lines
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Найден ID секции новостей:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
      }

      // Process news cards
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `${sectionId}_${cards.length + 1}`,
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Add the last card if exists
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в новостях
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content),
      title: cleanEmailsInText(card.title)
    }));

    console.log('Результат парсинга новостей:', { id: sectionId, title: sectionTitle, cards: cleanedCards });

    // Create section data structure
    return {
      id: sectionId,
      title: sectionTitle || 'Новости и события',
      description: sectionDescription || 'Актуальные новости и события нашей компании',
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      }))
    };
  } catch (error) {
    console.error('Error parsing news:', error);
    return null;
  }
};

export const parseContacts = (content, headerData = {}) => {
  try {
    // Разбиваем текст на блоки, разделенные пустыми строками
    const blocks = content.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
    
    const contactData = {
      title: '',
      description: '',
      companyName: headerData?.siteName || '', // Используем название сайта из headerData
      address: '',
      phone: '',
      email: ''
    };
    
    // Обрабатываем по позициям блоков, а не по ключевым словам
    if (blocks.length >= 1) {
      contactData.title = cleanEmailsInText(blocks[0]);
    }
    
    if (blocks.length >= 2) {
      // Проверяем, если описание в скобках
      const description = blocks[1];
      if (description.startsWith('(') && description.endsWith(')')) {
        contactData.description = cleanEmailsInText(description.slice(1, -1).trim());
      } else {
        contactData.description = cleanEmailsInText(description);
      }
    }
    
    // Оставшиеся блоки обрабатываем как информационные поля в порядке:
    // адрес, телефон, email
    let currentIndex = 2;
    
    // Перебираем оставшиеся блоки и распределяем их по полям
    for (let i = currentIndex; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length >= 1) {
        const line = lines[0];
        
        // Определяем тип информации по содержимому строки
        if (line.toLowerCase().includes('телефон:') || line.match(/\+[\d\s()-]+/)) {
          // Получаем исходный телефон
          let originalPhone = line;
          const phoneRegex = /телефон:?\s*([+\d\s()-]+)/i;
          const phoneMatch = originalPhone.match(phoneRegex);
          if (phoneMatch) {
            originalPhone = phoneMatch[1].trim();
          }
          // Всегда генерируем случайный телефонный номер с сохранением формата
          contactData.phone = generateRandomPhone(originalPhone);
        } else if (line.toLowerCase().includes('email:') || line.includes('@')) {
          // Генерируем email с улучшенной логикой
          contactData.email = generateRandomEmail(headerData?.siteName);
        } else if (!contactData.address) {
          // Если это не телефон и не email, считаем это адресом
          contactData.address = cleanEmailsInText(line);
        }
      }
    }
    
    // Если название компании не было установлено из headerData, используем первую строку
    if (!contactData.companyName && blocks.length > 2) {
      contactData.companyName = cleanEmailsInText(blocks[2]);
    }
    
    console.log('Результат парсинга контактов:', contactData);
    return contactData;
  } catch (error) {
    console.error('Error parsing contacts:', error);
    return null;
  }
};

export const parseLegalDocuments = (content, contactData = {}) => {
  try {
    const documents = {
      privacyPolicy: {
        title: '',
        content: ''
      },
      termsOfService: {
        title: '',
        content: ''
      },
      cookiePolicy: {
        title: '',
        content: ''
      }
    };

    // Нормализуем переносы строк
    const normalizedContent = content.replace(/\r\n/g, '\n');

    // Регулярное выражение для поиска заголовков в скобках в начале строки и последующего текста
    // (?:^|\n) - начало строки или новая строка
    // \s* - возможные пробелы в начале строки
    // \(([^)]+)\) - заголовок в скобках
    // [\s\S]*? - любой текст до следующего заголовка или конца текста
    const documentPattern = /(?:^|\n)\s*\(([^)]+)\)([\s\S]*?)(?=(?:^|\n)\s*\([^)]+\)|$)/g;
    
    // Массив типов документов в порядке их следования
    const documentTypes = ['privacyPolicy', 'termsOfService', 'cookiePolicy'];
    let documentIndex = 0;
    
    let match;
    while ((match = documentPattern.exec(normalizedContent)) !== null) {
      const title = match[1].trim();
      let documentContent = match[2].trim();

      console.log(`Найден документ: ${title}`);

      // Определяем тип документа по порядку следования
      const documentType = documentTypes[documentIndex];
      
      if (documentType && documents[documentType]) {
        // Добавляем заголовок как первую строку контента
        documents[documentType].content = title + '\n\n' + documentContent;
      }
      
      documentIndex++;
    }

    // Добавляем контактную информацию в конец каждого документа, если она доступна
    if (contactData && Object.keys(contactData).length > 0) {
      Object.keys(documents).forEach(docType => {
        if (documents[docType].content && !documents[docType].content.toLowerCase().includes('📞') && 
            !documents[docType].content.toLowerCase().includes('📍') && 
            !documents[docType].content.toLowerCase().includes('📧')) {
          
          let contactBlock = '\n\n';
          
          if (contactData.companyName) {
            contactBlock += `🏢 ${contactData.companyName}\n`;
          }
          
          if (contactData.address) {
            contactBlock += `📍 ${contactData.address}\n`;
          }
          
          if (contactData.phone) {
            contactBlock += `📞 ${contactData.phone}\n`;
          }
          
          if (contactData.email) {
            contactBlock += `📧 ${contactData.email}\n`;
          }
          
          documents[docType].content += contactBlock;
        }
      });
    }

    return documents;
  } catch (error) {
    console.error('Error parsing legal documents:', error);
    return null;
  }
};

export const autoDetectSectionType = (content) => {
  const lowerContent = content.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        return type;
      }
    }
  }
  
  return 'AUTO';
};

export const parseMerci = (content) => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    return {
      message: lines[0] || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      closeButtonText: lines[1] || 'Закрыть'
    };
  } catch (error) {
    console.error('Error parsing merci section:', error);
    return {
      message: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      closeButtonText: 'Закрыть'
    };
  }
};

export const parseFullSite = (content, headerData = {}, contactData = {}) => {
  try {
    // Очищаем начальный текст от инструкций и символов экранирования
    let cleanedContent = content;
    
    // Удаляем символы экранирования из разделителей
    cleanedContent = cleanedContent.replace(/\\===/g, '===');
    
    // Удаляем всё от начала до первого === РАЗДЕЛ: если это нужно
    const firstSectionIndex = cleanedContent.indexOf('=== РАЗДЕЛ:');
    if (firstSectionIndex > 0) {
      cleanedContent = cleanedContent.substring(firstSectionIndex);
    }
    
    const sections = {};
    // Стандартный regex для обработки уже очищенного контента
    const sectionRegex = /=== РАЗДЕЛ: ([^=]+) ===([\s\S]*?)=== КОНЕЦ РАЗДЕЛА ===/g;
    let match;

    console.log('Начинаем парсинг полного сайта, количество символов:', cleanedContent.length);

    // Ищем все разделы в контенте
    const allSections = [];
    while ((match = sectionRegex.exec(cleanedContent)) !== null) {
      const sectionName = match[1].trim();
      const sectionContent = match[2].trim();
      allSections.push({ name: sectionName, content: sectionContent });
    }
    
    console.log('Найдены разделы:', allSections.map(s => s.name));

    // Обрабатываем каждый раздел
    for (const section of allSections) {
      const sectionName = section.name;
      const sectionContent = section.content;
      
      console.log(`Обрабатываем раздел: ${sectionName}, длина контента: ${sectionContent.length}`);
      console.log(`Содержимое раздела ${sectionName}:`, sectionContent.substring(0, 200) + '...');

      try {
        switch (sectionName) {
          case 'HERO':
            sections.hero = parseHero(sectionContent);
            console.log('Результат парсинга Hero:', sections.hero);
            if (!sections.hero) {
              console.error('parseHero вернул null для раздела HERO');
            }
            break;
          case 'ПРЕЗЕНТАЦИОННОЕ СООБЩЕНИЕ':
            sections.runningLineMessage = parsePresentationMessage(sectionContent);
            console.log('Результат парсинга презентационного сообщения:', sections.runningLineMessage);
            if (!sections.runningLineMessage) {
              console.error('parsePresentationMessage вернул null для раздела ПРЕЗЕНТАЦИОННОЕ СООБЩЕНИЕ');
            }
            break;
          case 'УСЛУГИ':
            sections.services = parseServices(sectionContent);
            console.log('Результат парсинга Services:', sections.services);
            if (!sections.services) {
              console.error('parseServices вернул null для раздела УСЛУГИ');
            }
            break;
          case 'О НАС':
            sections.about = parseAboutSection(sectionContent);
            console.log('Результат парсинга About:', sections.about);
            if (!sections.about) {
              console.error('parseAboutSection вернул null для раздела О НАС');
            }
            break;
          case 'ПРЕИМУЩЕСТВА':
            sections.features = parseAdvantagesSection(sectionContent);
            console.log('Результат парсинга Features:', sections.features);
            if (!sections.features) {
              console.error('parseAdvantagesSection вернул null для раздела ПРЕИМУЩЕСТВА');
            }
            break;
          case 'ОТЗЫВЫ':
            sections.testimonials = parseTestimonials(sectionContent);
            console.log('Результат парсинга Testimonials:', sections.testimonials);
            if (!sections.testimonials) {
              console.error('parseTestimonials вернул null для раздела ОТЗЫВЫ');
            }
            break;
          case 'ВОПРОСЫ':
            sections.faq = parseFaq(sectionContent);
            console.log('Результат парсинга FAQ:', sections.faq);
            if (!sections.faq) {
              console.error('parseFaq вернул null для раздела ВОПРОСЫ');
            }
            break;
          case 'НОВОСТИ':
            sections.news = parseNews(sectionContent);
            console.log('Результат парсинга новостей в полном сайте:', sections.news);
            if (!sections.news) {
              console.error('parseNews вернул null для раздела НОВОСТИ');
            }
            break;
          case 'КОНТАКТЫ':
            sections.contacts = parseContactsFull(sectionContent, headerData);
            console.log('Результат парсинга Contacts:', sections.contacts);
            if (!sections.contacts) {
              console.error('parseContactsFull вернул null для раздела КОНТАКТЫ');
            }
            break;
          case 'MERCI':
            sections.merci = parseMerci(sectionContent);
            console.log('Результат парсинга Merci:', sections.merci);
            if (!sections.merci) {
              console.error('parseMerci вернул null для раздела MERCI');
            }
            break;
          case 'ПРАВОВЫЕ ДОКУМЕНТЫ':
            sections.legalDocuments = parseLegalDocuments(sectionContent, contactData);
            console.log('Результат парсинга Legal Documents:', sections.legalDocuments);
            if (!sections.legalDocuments) {
              console.error('parseLegalDocuments вернул null для раздела ПРАВОВЫЕ ДОКУМЕНТЫ');
            }
            break;
          default:
            console.log(`Неизвестный раздел: ${sectionName}`);
        }
      } catch (sectionError) {
        console.error(`Ошибка при парсинге раздела ${sectionName}:`, sectionError);
      }
    }

    console.log('Итоговые результаты парсинга:', sections);
    return sections;
  } catch (error) {
    console.error('Error parsing full site content:', error);
    return null;
  }
};

// Специальная функция для обработки контактов в полном формате сайта
export const parseContactsFull = (content, headerData = {}) => {
  try {
    // Разбиваем текст на блоки, разделенные пустыми строками
    const blocks = content.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
    
    const contactData = {
      title: '',
      description: '',
      companyName: headerData?.siteName || '', // Используем название сайта из headerData
      address: '',
      phone: '',
      email: ''
    };
    
    // Обрабатываем по позициям блоков, а не по ключевым словам
    if (blocks.length >= 1) {
      contactData.title = cleanEmailsInText(blocks[0]);
    }
    
    if (blocks.length >= 2) {
      // Проверяем, если описание в скобках
      const description = blocks[1];
      if (description.startsWith('(') && description.endsWith(')')) {
        contactData.description = cleanEmailsInText(description.slice(1, -1).trim());
      } else {
        contactData.description = cleanEmailsInText(description);
      }
    }
    
    // Оставшиеся блоки обрабатываем как информационные поля в порядке:
    // адрес, телефон, email
    let currentIndex = 2;
    
    // Перебираем оставшиеся блоки и распределяем их по полям
    for (let i = currentIndex; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length >= 1) {
        const line = lines[0];
        
        // Определяем тип информации по содержимому строки
        if (line.toLowerCase().includes('телефон:') || line.match(/\+[\d\s()-]+/)) {
          // Получаем исходный телефон
          let originalPhone = line;
          const phoneRegex = /телефон:?\s*([+\d\s()-]+)/i;
          const phoneMatch = originalPhone.match(phoneRegex);
          if (phoneMatch) {
            originalPhone = phoneMatch[1].trim();
          }
          // Всегда генерируем случайный телефонный номер с сохранением формата
          contactData.phone = generateRandomPhone(originalPhone);
        } else if (line.toLowerCase().includes('email:') || line.includes('@')) {
          // Генерируем email с улучшенной логикой
          contactData.email = generateRandomEmail(headerData?.siteName);
        } else if (!contactData.address) {
          // Если это не телефон и не email, считаем это адресом
          contactData.address = cleanEmailsInText(line);
        }
      }
    }
    
    // Если название компании не было установлено из headerData, используем первую строку
    if (!contactData.companyName && blocks.length > 2) {
      contactData.companyName = cleanEmailsInText(blocks[2]);
    }
    
    console.log('Результат парсинга контактов:', contactData);
    return contactData;
  } catch (error) {
    console.error('Error parsing contacts from full site structure:', error);
    return null;
  }
};

// Функция для парсинга презентационного сообщения для бегущей строки
export const parsePresentationMessage = (content) => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length >= 1) {
      const message = lines[0];
      console.log('Найдено презентационное сообщение:', message);
      return message;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing presentation message:', error);
    return null;
  }
}; 



