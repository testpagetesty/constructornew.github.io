import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Divider, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Collapse,
  ListItemText,
  List,
  ListItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid,
  Slider,
  Switch,
  Radio,
  RadioGroup,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import StyleIcon from '@mui/icons-material/Style';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { CARD_TYPES } from '../../utils/configUtils';
import GlobalSettings, { WEBSITE_THEMES, LANGUAGES, CONTENT_STYLES, COUNTRIES } from './GlobalSettings';
import SiteStyleManager from '../SiteStyleSettings/SiteStyleManager';
import * as parsers from './parsingFunctions';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';
import { contactPresets } from '../../utils/contactPresets';
import openaiService from '../../services/openaiService';
import { headerPresets } from '../../utils/headerPresets';

// Function to remove Markdown formatting
const removeMarkdownFormatting = (text) => {
  if (!text) return text;
  
  // Remove bold formatting (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove italic formatting (*text*)
  text = text.replace(/\*(.*?)\*/g, '$1');
  
  // Other possible Markdown formatting
  text = text
    .replace(/`(.*?)`/g, '$1') // code
    .replace(/__(.*?)__/g, '$1') // underline
    .replace(/_(.*?)_/g, '$1') // italic with underscore
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // links
    
  return text;
};

// Добавляем объект с предустановленными промптами
const DEFAULT_PROMPTS = {
  FULL_SITE: `Создайте полный контент для сайта. Строго следуйте формату ниже.

КРИТИЧЕСКИ ВАЖНО: 
1. Весь контент, включая ID секций, ДОЛЖЕН быть на одном языке (который указан в настройках)
2. ID секции должен быть написан на том же языке, что и весь контент
3. Не использовать смешанные языки или транслитерацию
4. Каждый раздел должен начинаться с "=== РАЗДЕЛ: ИМЯ ===" и заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. НЕ ИСПОЛЬЗУЙТЕ символы экранирования (\) перед разделителями ===
6. Разделители должны быть точно: === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===

ВАЖНО: Не добавляйте обратные слеши (\) перед символами ===. Используйте точно такой формат:
=== РАЗДЕЛ: HERO ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===\n\n`,

  HERO: `Создайте контент для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка - название сайта
- Максимум 2 слова
- Связано с тематикой нашего сайта
- Легко запоминается
- Без специальных символов и форматирования
- Можно использовать слитное написание слов

2. Вторая строка - заголовок hero секции
- Должен быть убедительным и внушать доверие
- 4-7 слов
- Не должен повторять название сайта

3. Третья строка - описание для hero секции
- 15-25 слов
- Подчеркнуть выгоды для клиента
- Избегать юридических терминов

Пример структуры:
ПравоЩит

Надежная защита ваших интересов

Профессиональная юридическая поддержка для бизнеса и частных лиц. Решаем сложные правовые вопросы, гарантируя результат.

Важно:
- Не используйте форматирование или специальные символы
- Каждая часть должна начинаться с новой строки
- Текст должен быть понятным для всех клиентов`,

  ABOUT: `Создайте содержательный текст для раздела "О нас". Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки "О нас", где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: о_нас
Профессиональная команда с многолетним опытом
Узнайте больше о нашей истории, достижениях и ценностях
О нас

История компании
Основанная в 2010 году, наша компания прошла путь от небольшой фирмы до одного из лидеров рынка. За это время мы успешно реализовали более 1000 проектов и помогли сотням клиентов.

Наша миссия
Мы стремимся сделать услуги доступными и понятными для каждого клиента. Наша цель - не просто решать вопросы, а создавать долгосрочные партнерские отношения.

Рекомендуемое количество карточек: 4-6`,

  SERVICES: `Создайте описание услуг для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки услуг, где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание услуги
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: услуги
Комплексные решения для вашего бизнеса
Профессиональная поддержка для вашего бизнеса и частных лиц
Услуги

Консультации
Предоставляем профессиональные консультации по всем вопросам. Наши специалисты помогут найти оптимальное решение для вашей ситуации.

Сопровождение
Полное сопровождение проектов от начала до успешного завершения. Берем на себя все организационные вопросы.

Рекомендуемое количество услуг: 4-6`,

  FEATURES: `Создайте описание преимуществ для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки преимуществ, где:
   - Каждое преимущество начинается с краткого заголовка
   - После заголовка идет развернутое описание
   - Между преимуществами ОДНА пустая строка

Пример на русском:
ID: преимущества
Почему клиенты выбирают нашу компанию
Ключевые преимущества работы с нашей компанией
Преимущества

Профессионализм
Наши специалисты имеют более 15 лет опыта. Каждый эксперт регулярно проходит повышение квалификации.

Качество
Гарантируем высокое качество всех услуг. Работаем по международным стандартам.

Рекомендуемое количество преимуществ: 4-6`,

  TESTIMONIALS: `Создайте отзывы для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки отзывов, где:
   - Первая строка каждой карточки - имя автора
   - Следующие строки - текст отзыва
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: отзывы
Что говорят наши довольные клиенты
Отзывы клиентов о качестве нашей работы и достигнутых результатах
Отзывы

Анна Петрова
Обратилась в компанию по вопросу оформления документов. Все было сделано быстро и профессионально. Очень довольна качеством услуг.

Сергей Иванов
Благодарен за помощь в решении сложного вопроса. Специалисты компании проявили высокий профессионализм и внимание к деталям.

Рекомендуемое количество отзывов: 3-5`,

  FAQ: `Создайте раздел вопросов и ответов для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - вопросы и ответы, где:
   - Каждый вопрос должен заканчиваться знаком "?"
   - После вопроса идет развернутый ответ
   - Между вопросами ОДНА пустая строка

Пример на русском:
ID: вопросы
Ответы на популярные вопросы клиентов
Здесь вы найдете ответы на самые распространенные вопросы о наших услугах и процессе работы
Вопросы и ответы

Как начать работу с вашей компанией?
Для начала работы с нашей компанией достаточно оставить заявку через форму на сайте или позвонить по указанному номеру телефона. Наш менеджер свяжется с вами в течение рабочего дня для обсуждения деталей сотрудничества.

Какие гарантии вы предоставляете?
Мы гарантируем высокое качество наших услуг и строго соблюдаем все договорные обязательства. Каждый проект сопровождается официальным договором, где прописаны все условия сотрудничества, сроки и гарантийные обязательства.

Рекомендуемое количество вопросов: 4-6`,

  NEWS: `Создайте новости для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки новостей, где:
   - Каждая новость начинается с заголовка
   - После заголовка идет текст новости
   - Между новостями ОДНА пустая строка

Пример на русском:
ID: новости
Актуальные события и достижения компании
Следите за последними новостями и важными событиями в жизни нашей компании
Новости

Успешное завершение крупного проекта
Наша компания одержала значимую победу в важном деле, защитив интересы крупного промышленного предприятия. Благодаря профессионализму наших специалистов, клиенту удалось отстоять свои права и сохранить активы стоимостью более 100 миллионов рублей.

Наши специалисты получили престижную награду
Ведущие специалисты нашей компании были отмечены в рейтинге "Лучшие профессионалы года". Это признание подтверждает высокий уровень экспертизы нашей команды и качество предоставляемых услуг.

Рекомендуемое количество новостей: 3-5`,

  CONTACTS: `Используй язык который указан для нашего промта

Создайте раздел контактов для сайта.

КРИТИЧЕСКИ ВАЖНО: Весь раздел контактов (заголовок, описание) должен быть СТРОГО на том же языке, который указан в глобальных настройках конструктора! НЕ используйте другие языки.

Требуемый формат:
1. Первая строка - заголовок "Контакты" (используется язык основного контента)
2. Вторая строка - ОБЯЗАТЕЛЬНО пустая
3. Третья строка - описание в скобках (должно содержать призыв оставить заявку или связаться, например: "Свяжитесь с нами для получения консультации" или "Оставьте заявку, и мы свяжемся с вами в ближайшее время")
4. Четвертая строка - ОБЯЗАТЕЛЬНО пустая
5. Далее контактные данные в строгом порядке:
   - Адрес (ОЧЕНЬ ВАЖНО: формат адреса должен строго соответствовать международным стандартам для выбранной страны)
   - ОБЯЗАТЕЛЬНО пустая строка
   - Телефон (используйте правильный формат номера для выбранной страны)
   - ОБЯЗАТЕЛЬНО пустая строка
   - Email

КРИТИЧЕСКИ ВАЖНО - ФОРМАТ ВЫВОДА КОНТАКТОВ:
Каждый элемент контактов (заголовок, описание, адрес, телефон, email) СТРОГО ОБЯЗАТЕЛЬНО должен быть разделен ОДНОЙ пустой строкой. Это требование для корректной обработки системой парсинга!

КРИТИЧНО ВАЖНО О ФОРМАТЕ АДРЕСА:
- Используйте ТОЛЬКО международный формат адреса, принятый в конкретной стране
- Указывайте адрес в формате, который принимают Google Maps для данной страны
- Адрес должен содержать: название улицы, номер дома, район (если применимо), город, индекс (почтовый код)
- Обязательно укажите район города и почтовый индекс
- Формат адреса и порядок элементов ДОЛЖЕН соответствовать стандартам выбранной страны
- Не используйте сокращения (пр. ул., д., кв.) - пишите полностью (улица, дом, квартира)

Примеры правильных форматов адресов для разных стран:
- Россия: 119435, Москва, Большой Саввинский переулок, 12 строение 6
- США: 350 5th Ave, New York, NY 10118, USA
- Великобритания: 10 Downing Street, London, SW1A 2AA, UK 
- Германия: Friedrichstraße 123, 10117 Berlin, Germany
- Турция: Bağdat Caddesi 123, Kadıköy, 34710 İstanbul, Turkey
- Франция: 8 Avenue des Champs-Élysées, 75008 Paris, France
- Испания: Calle de Alcalá 20, 28014 Madrid, España
- Италия: Via del Corso 12, 00186 Roma, Italia
- Китай: 100006, 北京市东城区王府井大街1号, Beijing, China
- Япония: 〒100-0005 東京都千代田区丸の内1-1-1, Tokyo, Japan
- ОАЭ: Al Maktoum Street, Deira, P.O. Box 12345, Dubai, UAE
- Канада: 150 Bloor Street West, Toronto, ON M5S 1M4, Canada
- Австралия: 200 George Street, Sydney NSW 2000, Australia
- Бразилия: Avenida Paulista 1000, Bela Vista, São Paulo - SP, 01310-100, Brasil
- Индия: Plot No.1, Sector 42, Gurugram, Haryana 122002, India
- Нидерланды: Prinsengracht 263-267, 1016 GV Amsterdam, Netherlands
- Швеция: Drottninggatan 71A, 111 36 Stockholm, Sweden
- Южная Корея: 29 Seolleung-ro 152-gil, Gangnam-gu, Seoul 06792, South Korea
- Мексика: Paseo de la Reforma 222, Juárez, 06600 Ciudad de México, CDMX, Mexico
- Польша: ul. Nowy Świat 6/12, 00-400 Warszawa, Poland
- Израиль: HaYarkon Street 99, Tel Aviv-Yafo, 6340133, Israel

Пример ПРАВИЛЬНОЙ структуры (адаптируйте под выбранный язык):
Контакты

(Мы ценим каждого клиента и готовы оказать профессиональную поддержку. Свяжитесь с нами для получения консультации или оставьте заявку, и наши специалисты оперативно ответят на все ваши вопросы)

107023, Москва, ул. Большая Семёновская, д. 40, оф. 304

+7 (495) 123-45-67

info@your-law.com

КРИТИЧЕСКИ ВАЖНО:
1. Заголовок "Контакты" и описание должны быть переведены на язык из настроек конструктора
2. СТРОГО следуйте этому формату с пустыми строками между каждым элементом контактов!

Примечание: 
- Название компании будет автоматически синхронизировано с названием сайта из настроек шапки.
- Email адрес будет автоматически сформирован как info@[название-сайта].com, где [название-сайта] - это транслитерированное название сайта из настроек шапки.
=== КОНЕЦ РАЗДЕЛА ===\n\n`,

  LEGAL: `ВАЖНО: Создайте все документы ИСКЛЮЧИТЕЛЬНО на выбранном языке.

Создайте три юридических документа для сайта:
- Политика конфиденциальности (Privacy Policy)
- Пользовательское соглашение (Terms of Use)
- Политика использования cookie (Cookie Policy)

ФОРМАТ ДОКУМЕНТОВ:
1. Каждый документ должен начинаться с заголовка в круглых скобках на отдельной строке НА ВЫБРАННОМ ЯЗЫКЕ
2. После заголовка сразу идет текст документа
3. Между документами оставляйте РОВНО две пустые строки
4. Внутри документа используйте обычное форматирование с разделами

Примеры заголовков на разных языках:
- Русский: (Политика конфиденциальности), (Пользовательское соглашение), (Политика использования cookie)
- Английский: (Privacy Policy), (Terms of Use), (Cookie Policy)
- Испанский: (Política de Privacidad), (Términos de Uso), (Política de Cookies)
- Немецкий: (Datenschutzrichtlinie), (Nutzungsbedingungen), (Cookie-Richtlinie)
- Французский: (Politique de Confidentialité), (Conditions d'Utilisation), (Politique des Cookies)

ВАЖНО! НЕ УКАЗЫВАТЬ В ДОКУМЕНТАХ:
- Никакие контактные данные (адреса, телефоны, email)
- Конкретные названия сайтов или доменов
- Используйте обобщенные формулировки на выбранном языке, например:
  * "на нашем сайте" вместо конкретного названия
  * "через форму обратной связи" вместо конкретных контактов
  * "администрация сайта" вместо конкретных имен

СТРУКТУРА ДОКУМЕНТОВ (названия разделов должны быть на ВЫБРАННОМ ЯЗЫКЕ):

ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ должна включать разделы:
- Общие положения
- Какую информацию мы собираем
- Как мы используем информацию
- Защита данных и срок хранения
- Передача данных третьим лицам
- Использование файлов cookie
- Права пользователя
- Изменения в политике
- Согласие пользователя

ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ должно включать разделы:
- Общие положения и термины
- Права и обязанности пользователя
- Права и обязанности администрации
- Условия использования контента
- Интеллектуальная собственность
- Отказ от ответственности
- Регистрация и учетная запись
- Безопасность и конфиденциальность
- Порядок разрешения споров
- Заключительные положения

ПОЛИТИКА ИСПОЛЬЗОВАНИЯ COOKIE должна включать разделы:
- Что такое файлы cookie
- Типы файлов cookie
- Цели использования cookie
- Контроль файлов cookie
- Сторонние cookie-файлы
- Срок хранения cookie
- Как отключить cookie
- Обновления политики

ВАЖНЫЕ ТРЕБОВАНИЯ:
- Документы должны быть ПОЛНЫМИ (1500-2000 слов каждый)
- Соответствовать требованиям GDPR
- Быть универсальными для любой страны
- Использовать нейтральные формулировки на ВЫБРАННОМ ЯЗЫКЕ
- СТРОГО ЗАПРЕЩЕНО добавлять пробелы в конце строк
- СТРОГО ЗАПРЕЩЕНО использовать двойные пробелы
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать символы форматирования

СТРОГОЕ ПРАВИЛО: НЕ ДОБАВЛЯЙТЕ НИКАКОГО ТЕКСТА ПОСЛЕ ЗАКЛЮЧИТЕЛЬНОГО РАЗДЕЛА ПОСЛЕДНЕГО ДОКУМЕНТА. 
НЕ ЗАДАВАЙТЕ ВОПРОСЫ. НЕ ПРЕДЛАГАЙТЕ ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ.
НЕ ПИШИТЕ "Надеюсь, это вам поможет" ИЛИ ПОДОБНЫЕ ФРАЗЫ.
ОТВЕТ ДОЛЖЕН СОДЕРЖАТЬ ТОЛЬКО ТРИ ДОКУМЕНТА БЕЗ КАКИХ-ЛИБО ДОПОЛНИТЕЛЬНЫХ КОММЕНТАРИЕВ.

ПРОВЕРКА: Убедитесь, что ВСЕ заголовки и ВЕСЬ текст написаны ТОЛЬКО на выбранном языке. Не смешивайте языки. Если выбран не русский язык, НЕ используйте русский текст нигде в документах.`,
};

const WordRangeEditor = ({ section, ranges, onChange }) => {
  const handleRangeChange = (field, type, value) => {
    const newRange = { ...ranges[field] };
    const parsedValue = Math.max(1, parseInt(value) || 1);
    
    // Определяем тип контента
    const isCardContent = field === 'cardContent';
    
    // Применяем ограничения для cardContent
    if (isCardContent) {
      if (type === 'min') {
        // Минимум не может быть меньше 55 для cardContent
        newRange.min = Math.max(55, parsedValue);
        // Если максимум меньше минимума + 10, корректируем максимум
        if (newRange.max < newRange.min + 10) {
          newRange.max = Math.min(130, newRange.min + 10);
        }
      } else if (type === 'max') {
        // Максимум не может быть больше 130 для cardContent
        newRange.max = Math.min(130, parsedValue);
        // Если минимум больше максимума - 10, корректируем минимум
        if (newRange.min > newRange.max - 10) {
          newRange.min = Math.max(55, newRange.max - 10);
        }
      }
    } else {
      // Для других полей просто обновляем значение
      newRange[type] = parsedValue;
      
      // Убедимся, что max всегда больше min
      if (type === 'min' && newRange.max < newRange.min) {
        newRange.max = newRange.min + 1;
      } else if (type === 'max' && newRange.max < newRange.min) {
        newRange.min = newRange.max - 1;
      }
    }
    
    onChange(section, field, newRange);
  };

  const getFieldLabel = (field) => {
    if (section === 'HERO') {
      switch (field) {
        case 'title':
          return 'Заголовок Hero';
        case 'description':
          return 'Описание Hero';
        default:
          return field;
      }
    } else {
      switch (field) {
        case 'sectionTitle':
          return 'Заголовок раздела';
        case 'sectionDescription':
          return 'Описание раздела';
        case 'cardContent':
          return 'Содержимое карточки';
        default:
          return field;
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {section === 'HERO' ? 'Hero секция' : section}:
      </Typography>
      {Object.entries(ranges).map(([field, range]) => (
        <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ minWidth: 150 }}>
            {getFieldLabel(field)}:
          </Typography>
          <TextField
            size="small"
            type="number"
            label="Мин"
            value={range.min}
            onChange={(e) => handleRangeChange(field, 'min', e.target.value)}
            sx={{ width: 80, mr: 1 }}
            inputProps={{
              min: field === 'cardContent' ? 55 : 1,
              max: field === 'cardContent' ? 130 : undefined
            }}
          />
          <Typography variant="body2" sx={{ mx: 1 }}>-</Typography>
          <TextField
            size="small"
            type="number"
            label="Макс"
            value={range.max}
            onChange={(e) => handleRangeChange(field, 'max', e.target.value)}
            sx={{ width: 80 }}
            inputProps={{
              min: field === 'cardContent' ? 55 : 1,
              max: field === 'cardContent' ? 130 : undefined
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

// Добавляем компонент настройки промпта полного сайта
const FullSitePromptSettings = ({ open, onClose, onSave, onCopyOnly, initialSettings, isGenerating, generationProgress }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [promptType, setPromptType] = useState('optimized');

  const handleSectionToggle = (section) => {
    setSettings(prev => ({
      ...prev,
      includedSections: {
        ...prev.includedSections,
        [section]: !prev.includedSections[section]
      }
    }));
  };

  const handleCardCountChange = (section, value) => {
    setSettings(prev => ({
      ...prev,
      cardCounts: {
        ...prev.cardCounts,
        [section]: value
      }
    }));
  };

  const handleWordRangeChange = (section, field, newRange) => {
    setSettings(prev => ({
      ...prev,
      wordRanges: {
        ...prev.wordRanges,
        [section]: {
          ...prev.wordRanges[section],
          [field]: newRange
        }
      }
    }));
  };

  const handleSaveWithAI = () => {
    onSave(settings, promptType);
    // Не закрываем диалог сразу, ждем завершения генерации AI
  };

  const handleCopyOnly = () => {
    onCopyOnly(settings, promptType);
    onClose(); // Закрываем диалог сразу при копировании
  };

  const sectionLabels = {
    HERO: 'Hero секция',
    ABOUT: 'О нас',
    SERVICES: 'Услуги',
    FEATURES: 'Преимущества',
    NEWS: 'Новости',
    FAQ: 'Вопросы и ответы',
    TESTIMONIALS: 'Отзывы',
    CONTACTS: 'Контакты',
    MERCI: 'Сообщение благодарности',
    LEGAL: 'Правовые документы'
  };

  const randomizeAllSettings = () => {
    // Рандомизируем количество карточек
    const newCardCounts = { ...settings.cardCounts };
    Object.keys(newCardCounts).forEach(section => {
      if (section === 'SERVICES') {
        // Для услуг минимум 4 карточки, максимум 8
        newCardCounts[section] = Math.floor(Math.random() * 5) + 4; // 4-8
      } else {
        // Для остальных разделов от 2 до 7 карточек
        newCardCounts[section] = Math.floor(Math.random() * 6) + 2; // 2-7
      }
    });

    // Стили контента с разными характеристиками
    const contentStyles = {
      MINIMAL: {
        titleMultiplier: 0.6,
        descriptionMultiplier: 0.7,
        contentMultiplier: 0.5
      },
      STANDARD: {
        titleMultiplier: 1,
        descriptionMultiplier: 1,
        contentMultiplier: 1
      },
      DETAILED: {
        titleMultiplier: 1.3,
        descriptionMultiplier: 1.5,
        contentMultiplier: 1.8
      },
      COMPREHENSIVE: {
        titleMultiplier: 1.6,
        descriptionMultiplier: 2,
        contentMultiplier: 2.5
      }
    };

    // Выбираем случайный стиль для каждого раздела
    const getRandomStyle = () => {
      const styles = Object.keys(contentStyles);
      return styles[Math.floor(Math.random() * styles.length)];
    };

    const getRandomRange = (type, section) => {
      // Определяем тип раздела
      const isContentSection = ['FEATURES', 'TESTIMONIALS', 'ABOUT', 'NEWS', 'SERVICES', 'FAQ'].includes(section);
      
      // Устанавливаем жесткие максимальные ограничения
      const HARD_LIMITS = {
        content: isContentSection 
          ? { minRange: [55, 90], max: 130 } // Изменяем диапазон минимальных значений
          : { minRange: [20, 60], max: 90 },
        description: { minRange: [20, 60], max: 90 },
        title: { minRange: [2, 20], max: 30 }
      };

      // Определяем тип контента для применения ограничений
      let contentType = 'title'; // по умолчанию
      if (type === 'cardContent' || type.includes('content')) {
        contentType = 'content';
      } else if (type.includes('description') || type.includes('Description')) {
        contentType = 'description';
      }

      // Генерируем случайное минимальное значение
      let randomMin;
      const [minRange, maxRange] = HARD_LIMITS[contentType].minRange;
      
      // Для контента в указанных разделах генерируем случайное значение в диапазоне
      if (contentType === 'content' && isContentSection) {
        // Генерируем случайное значение между 55 и 90
        randomMin = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
      } else {
        randomMin = Math.floor(minRange + Math.random() * (maxRange - minRange));
      }

      // Генерируем максимальное значение с учетом ограничений
      const maxLimit = HARD_LIMITS[contentType].max;
      const minDiff = contentType === 'content' ? 10 : (contentType === 'description' ? 5 : 2);
      
      // Ограничиваем максимальную разницу
      const maxDiff = contentType === 'content' && isContentSection
        ? Math.min(40, 130 - randomMin) // Увеличиваем возможную разницу до 40 слов
        : Math.min(20, maxLimit - randomMin);

      let randomMax = Math.min(
        maxLimit,
        randomMin + minDiff + Math.floor(Math.random() * (maxDiff - minDiff))
      );

      // Обеспечиваем минимальную разницу и максимальное ограничение
      if (randomMax - randomMin < minDiff) {
        randomMax = Math.min(randomMin + minDiff, maxLimit);
      }

      // Финальная проверка ограничений для указанных разделов
      if (contentType === 'content' && isContentSection) {
        randomMin = Math.max(55, randomMin); // Гарантируем минимум 55 слов
        randomMax = Math.min(randomMax, 130); // Гарантируем максимум 130 слов
        
        // Убеждаемся, что разница между min и max составляет хотя бы 10 слов
        if (randomMax - randomMin < 10) {
          if (randomMax < 130) {
            randomMax = Math.min(130, randomMin + 10);
          } else {
            randomMin = Math.max(55, randomMax - 10);
          }
        }
      }

      return { min: randomMin, max: randomMax };
    };

    const newWordRanges = {};
    
    // Для каждой секции генерируем новые диапазоны
    Object.entries(settings.wordRanges).forEach(([section, fields]) => {
      newWordRanges[section] = {};
      Object.entries(fields).forEach(([field]) => {
        newWordRanges[section][field] = getRandomRange(field, section);
      });
    });

    // Дополнительная обработка для обеспечения контраста между разделами
    const sections = Object.keys(newWordRanges);
    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        const section1 = sections[i];
        const section2 = sections[j];
        
        // Проверяем перекрытие диапазонов для cardContent
        if (newWordRanges[section1].cardContent && newWordRanges[section2].cardContent) {
          const range1 = newWordRanges[section1].cardContent;
          const range2 = newWordRanges[section2].cardContent;
          
          // Если диапазоны слишком похожи, корректируем один из них
          if (Math.abs(range1.min - range2.min) < 15 && Math.abs(range1.max - range2.max) < 30) {
            if (Math.random() < 0.5) {
              // Уменьшаем первый диапазон
              range1.min = Math.max(55, Math.min(110, range1.min - 10));
              range1.max = Math.max(65, Math.min(130, range1.max - 10));
            } else {
              // Увеличиваем второй диапазон
              range2.min = Math.max(55, Math.min(110, range2.min + 10));
              range2.max = Math.max(65, Math.min(130, range2.max + 10));
            }
            
            // Проверяем и корректируем разницу между min и max
            if (range1.max - range1.min < 10) {
              range1.max = Math.min(130, range1.min + 10);
            }
            if (range2.max - range2.min < 10) {
              range2.max = Math.min(130, range2.min + 10);
            }
          }
        }
      }
    }

    // Финальная проверка всех диапазонов
    Object.entries(newWordRanges).forEach(([section, fields]) => {
      if (fields.cardContent) {
        fields.cardContent.min = Math.max(55, Math.min(110, fields.cardContent.min));
        fields.cardContent.max = Math.max(65, Math.min(130, fields.cardContent.max));
        
        // Обеспечиваем минимальную разницу
        if (fields.cardContent.max - fields.cardContent.min < 10) {
          fields.cardContent.max = Math.min(130, fields.cardContent.min + 10);
        }
      }
    });

    // Обновляем все настройки одновременно
    setSettings(prev => ({
      ...prev,
      cardCounts: newCardCounts,
      wordRanges: newWordRanges
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Настройка промпта полного сайта</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={randomizeAllSettings}
          startIcon={<ShuffleIcon />}
          size="small"
        >
          Случайные значения
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            Тип промпта:
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <RadioGroup
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
            >
              <FormControlLabel 
                value="full" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Полный промпт</strong> (оригинальный)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Включает все разделы и правовые документы. Может быть слишком длинным для некоторых AI моделей.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="optimized" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Оптимизированный промпт</strong> (рекомендуется)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Сокращенная версия без правовых документов. Лучше работает с большинством AI моделей.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="legal_only" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Только правовые документы</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Специализированный промпт только для генерации правовых документов. Гарантирует полные результаты.
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        
        {promptType !== 'legal_only' && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Выберите разделы для включения в промпт:
              </Typography>
          <Grid container spacing={2}>
            {Object.keys(settings.includedSections).map((section) => (
              <Grid item xs={6} sm={4} key={section}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.includedSections[section]}
                      onChange={() => handleSectionToggle(section)}
                      disabled={section === 'HERO'} // Hero секция всегда включена
                    />
                  }
                  label={sectionLabels[section]}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Количество карточек в каждом разделе:
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {Object.keys(settings.cardCounts).map((section) => (
            settings.includedSections[section] && (
              <Grid item xs={12} sm={6} key={section}>
                <Typography id={`${section}-slider-label`}>
                  {sectionLabels[section]}: {settings.cardCounts[section]}
                </Typography>
                <Slider
                  value={settings.cardCounts[section]}
                  onChange={(e, newValue) => handleCardCountChange(section, newValue)}
                  aria-labelledby={`${section}-slider-label`}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={section === 'SERVICES' ? 4 : 1} // Минимум 4 для услуг, 1 для остальных
                  max={8}
                  sx={{ width: '90%' }}
                />
              </Grid>
            )
          ))}
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Диапазоны количества слов:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Настройте количество слов для каждого элемента
            </Typography>
          </Box>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Настройки диапазонов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(settings.wordRanges).map(([section, ranges]) => (
                <WordRangeEditor
                  key={section}
                  section={section}
                  ranges={ranges}
                  onChange={handleWordRangeChange}
                />
              ))}
            </AccordionDetails>
              </Accordion>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 1 }}>
        {/* Индикатор прогресса генерации */}
        {isGenerating && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="primary">
                {generationProgress || 'Генерация контента...'}
              </Typography>
            </Box>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        )}
        
        {/* Кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1 }}>
          <Button onClick={onClose} disabled={isGenerating}>
            {isGenerating ? 'Генерация...' : 'Отмена'}
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={handleSaveWithAI} 
              variant="contained" 
              color="primary"
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={16} /> : null}
            >
              {isGenerating ? 'Генерация через AI...' : 'Сгенерировать через AI'}
            </Button>
            <Button 
              onClick={handleCopyOnly} 
              variant="outlined" 
              color="secondary"
              disabled={isGenerating}
              startIcon={<ContentCopyIcon />}
            >
              Скопировать промпт
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

const AiParser = ({ 
  sectionsData = {}, 
  onSectionsChange, 
  headerData, 
  onHeaderChange, 
  contactData, 
  onContactChange, 
  legalDocuments, 
  onLegalDocumentsChange, 
  heroData, 
  onHeroChange 
}) => {
  // Добавляем ref для текстового поля
  const textareaRef = useRef(null);

  // Существующие состояния
  const [customDelimiter, setCustomDelimiter] = useState('\\n\\n');
  const [customTitleContentDelimiter, setCustomTitleContentDelimiter] = useState(':');
  const [showSettings, setShowSettings] = useState(false);
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [targetSection, setTargetSection] = useState('FULL_SITE');
  const [parserMessage, setParserMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [editingPromptType, setEditingPromptType] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  
  // Добавляем состояния для глобальных настроек
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    theme: 'CUSTOM',
    customTheme: '',
    language: '',
    contentStyle: 'PROFESSIONAL',
    additionalKeywords: '',
    usePrice: false,
    usePromotions: false,
    useContacts: false,
    useSocial: false,
    customInstructions: '',
    customLanguage: ''
  });
  
  // Добавляем состояние для настроек промпта полного сайта
  const [showFullSiteSettings, setShowFullSiteSettings] = useState(false);
  
  // Добавляем состояния для OpenAI интеграции
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGenerationProgress, setAiGenerationProgress] = useState('');
  
  // Функция для копирования промпта без отправки в OpenAI (старое поведение)
  const handleCopyPromptOnly = (settings, promptType = 'full') => {
    setFullSiteSettings(settings);
    
    // Автоматически выбираем соответствующий раздел в парсере
    if (promptType === 'legal_only') {
      setTargetSection('LEGAL');
    } else if (promptType === 'optimized') {
      setTargetSection('FULL_SITE');
    } else {
      setTargetSection('FULL_SITE');
    }
    
    let finalPrompt = '';
    
    // Генерируем промпт в зависимости от типа
    if (promptType === 'legal_only') {
      finalPrompt = applyGlobalSettings(generateLegalDocumentsPrompt());
    } else if (promptType === 'optimized') {
      const optimizedPrompt = generateOptimizedFullSitePrompt(settings);
      finalPrompt = applyGlobalSettings(optimizedPrompt);
    } else {
      const fullSitePrompt = generateFullSitePrompt(settings);
      finalPrompt = applyGlobalSettings(fullSitePrompt);
    }
    
    // Копируем промпт в буфер обмена
    navigator.clipboard.writeText(finalPrompt)
      .then(() => {
        let successMessage = '';
        if (promptType === 'legal_only') {
          successMessage = 'Специализированный промпт для правовых документов скопирован в буфер обмена.';
        } else if (promptType === 'optimized') {
          successMessage = 'Оптимизированный промпт полного сайта (без правовых документов) скопирован в буфер обмена.';
        } else {
          successMessage = 'Полный промпт сайта скопирован в буфер обмена.';
        }
        
        setParserMessage(successMessage);
        handleClearText();
      })
      .catch(() => {
        setParserMessage('Не удалось скопировать промпт.');
      });
  };

  const [fullSiteSettings, setFullSiteSettings] = useState({
    includedSections: {
      HERO: true, // Hero секция всегда включена
      ABOUT: true,
      SERVICES: true,
      FEATURES: true,
      NEWS: true,
      FAQ: true,
      TESTIMONIALS: true,
      CONTACTS: true,
      MERCI: true, // Включаем сообщение благодарности по умолчанию
      LEGAL: true // Добавляем правовые документы в настройки
    },
    cardCounts: {
      ABOUT: 4,
      SERVICES: 4,
      FEATURES: 4,
      NEWS: 3,
      FAQ: 4,
      TESTIMONIALS: 3
    },
    wordRanges: {
      HERO: {
        title: { min: 3, max: 7 },        // Для заголовка Hero
        description: { min: 15, max: 25 }  // Для описания Hero
      },
      ABOUT: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      SERVICES: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      FEATURES: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      NEWS: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      FAQ: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      TESTIMONIALS: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      }
    }
  });
  
  // Добавляем состояние для управления стилями сайта
  const [showStyleManager, setShowStyleManager] = useState(false);
  
  // Добавляем состояние для переключателя стилей
  const [singleStyleMode, setSingleStyleMode] = useState(true);
  
  // Функция для генерации промпта полного сайта с учетом настроек
  const generateFullSitePrompt = (settings) => {
    const getWordRange = (section, field) => {
      const range = settings.wordRanges[section]?.[field];
      if (!range) return '';
      return `(${range.min}-${range.max} слов)`;
    };

    // Получаем информацию о выбранном языке из глобальных настроек
    let languageName = 'русском языке';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        languageName = langObj.label.split(' - ')[0]; // Берем русское название до " - "
      }
    }

    // Получаем информацию о выбранной стране
    const { selectedCountry, addressFormat, countryCode } = getSelectedCountryInfo();

    let sectionsPrompt = `Создайте полный контент для сайта для страны ${selectedCountry}. Строго следуйте формату ниже.

ОБЯЗАТЕЛЬНО СОЗДАЙТЕ ВСЕ УКАЗАННЫЕ РАЗДЕЛЫ, ВКЛЮЧАЯ ПРАВОВЫЕ ДОКУМЕНТЫ В КОНЦЕ!

КРИТИЧЕСКИ ВАЖНО: 
1. Весь контент, включая ID секций, ДОЛЖЕН быть на одном языке (который указан в настройках)
2. ID секций: буквы "ID" всегда на английском языке, название секции после двоеточия - на ${languageName}
3. Не использовать смешанные языки или транслитерацию
4. КАЖДЫЙ раздел ОБЯЗАТЕЛЬНО должен начинаться с "=== РАЗДЕЛ: ИМЯ ===" и ОБЯЗАТЕЛЬНО заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. НЕ ИСПОЛЬЗУЙТЕ символы экранирования (\) перед разделителями === 
6. Разделители должны быть точно: === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===
7. ОБЯЗАТЕЛЬНО: Каждый раздел должен иметь закрывающий разделитель "=== КОНЕЦ РАЗДЕЛА ===" - это критически важно для корректной обработки

ВАЖНО: Не добавляйте обратные слеши (\) перед символами ===. Используйте точно такой формат:
=== РАЗДЕЛ: HERO ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===

ВНИМАНИЕ: Отсутствие разделителя "=== КОНЕЦ РАЗДЕЛА ===" приведет к ошибке обработки контента!\n\n`;

    // Специальная обработка для телеком-оператора в ОАЭ
    if (globalSettings.theme === 'TELECOM_UAE') {
      sectionsPrompt += `СПЕЦИАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ ТЕЛЕКОМ-ОПЕРАТОРА В ОАЭ:\n`;
      sectionsPrompt += `- Фокус на mobile packages in UAE\n`;
      sectionsPrompt += `- 5G Mobile & Internet Plans in UAE for Video Calls with Family\n`;
      sectionsPrompt += `- Recharge Mobile & Internet in UAE. Top Up Mobile Plans\n`;
      sectionsPrompt += `- Quick Mobile & Internet Packages. Easy to Use\n`;
      sectionsPrompt += `- Home Plans: WiFi & TV\n`;
      sectionsPrompt += `- Smart & Simple, Easy to Use mobile plans\n`;
      sectionsPrompt += `- mobile lines uae, mobile plans 5g for video calls\n`;
      sectionsPrompt += `- 5g mobile plans for video calls in uae\n`;
      sectionsPrompt += `\nЗАПРЕЩЕННЫЕ СЛОВА (НЕ ИСПОЛЬЗОВАТЬ): best, pay, bill, payment, service, gambling, purchase, application, download, installation, software, money, payment gateway, tariff payment, casino, murder, budget, vignette, bank\n`;
      sectionsPrompt += `\nВАЖНО: Избегайте любых упоминаний о платежах, банковских операциях, казино и других запрещенных темах.\n\n`;
    }

    // Добавляем Hero секцию в начало
    sectionsPrompt += `=== РАЗДЕЛ: HERO ===
1. Первая строка - название сайта (1-2 слова, легко запоминающееся)
2. Вторая строка - заголовок hero секции ${getWordRange('HERO', 'title')}
3. Третья строка - описание ${getWordRange('HERO', 'description')}

Пример структуры:
ПравоЩит
Надежная защита ваших интересов
Профессиональная юридическая поддержка для бизнеса и частных лиц. Решаем сложные правовые вопросы, гарантируя результат.
=== КОНЕЦ РАЗДЕЛА ===\n\n`;

    // Добавляем презентационное сообщение для бегущей строки
    sectionsPrompt += `=== РАЗДЕЛ: ПРЕЗЕНТАЦИОННОЕ СООБЩЕНИЕ ===
[Презентационное сообщение для бегущей строки сайта (8-15 слов)]

ВАЖНО: Это сообщение должно быть:
- Достаточно информативным (8-15 слов)
- Привлекательным и цепляющим
- Не содержать контактную информацию
- Быть на ${languageName}

Примеры:
- "✨ Специальное предложение этого месяца - первая консультация абсолютно БЕСПЛАТНО для новых клиентов!"
- "🎯 Решаем самые сложные правовые вопросы быстро, эффективно и с гарантией результата"
- "⚡ Новая услуга - срочная экспресс-консультация по любым вопросам за 24 часа"
- "🏆 Лучшие квалифицированные специалисты с многолетним опытом работы в вашем городе"

=== КОНЕЦ РАЗДЕЛА ===\n\n`;

    if (settings.includedSections.ABOUT) {
      sectionsPrompt += `=== РАЗДЕЛ: О НАС ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('ABOUT', 'sectionTitle')}]
[Описание раздела ${getWordRange('ABOUT', 'sectionDescription')}]

[${settings.cardCounts.ABOUT} карточек в формате:]
Заголовок карточки
Описание ${getWordRange('ABOUT', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.SERVICES) {
      sectionsPrompt += `=== РАЗДЕЛ: УСЛУГИ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('SERVICES', 'sectionTitle')}]
[Описание раздела ${getWordRange('SERVICES', 'sectionDescription')}]

[${settings.cardCounts.SERVICES} карточек услуг в формате:]
Название услуги
Описание услуги ${getWordRange('SERVICES', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FEATURES) {
      sectionsPrompt += `=== РАЗДЕЛ: ПРЕИМУЩЕСТВА ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FEATURES', 'sectionTitle')}]
[Описание раздела ${getWordRange('FEATURES', 'sectionDescription')}]

[${settings.cardCounts.FEATURES} преимуществ в формате:]
Заголовок преимущества
Описание преимущества ${getWordRange('FEATURES', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.NEWS) {
      sectionsPrompt += `=== РАЗДЕЛ: НОВОСТИ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('NEWS', 'sectionTitle')}]
[Описание раздела ${getWordRange('NEWS', 'sectionDescription')}]

[${settings.cardCounts.NEWS} новостей в формате:]
Заголовок новости
Текст новости ${getWordRange('NEWS', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FAQ) {
      sectionsPrompt += `=== РАЗДЕЛ: ВОПРОСЫ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FAQ', 'sectionTitle')}]
[Описание раздела ${getWordRange('FAQ', 'sectionDescription')}]

[${settings.cardCounts.FAQ} вопросов в формате:]
Вопрос?
Ответ ${getWordRange('FAQ', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      sectionsPrompt += `=== РАЗДЕЛ: ОТЗЫВЫ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('TESTIMONIALS', 'sectionTitle')}]
[Описание раздела ${getWordRange('TESTIMONIALS', 'sectionDescription')}]

[${settings.cardCounts.TESTIMONIALS} отзывов в формате:]
Имя автора
Текст отзыва ${getWordRange('TESTIMONIALS', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: КОНТАКТЫ ===
ВАЖНО: Весь раздел контактов должен быть СТРОГО на ${languageName}!

[Заголовок раздела на ${languageName}]

([Описание на ${languageName}, 15-20 слов, пример: "Свяжитесь с нами для оформления заявки или получения бесплатной консультации по вашему вопросу"])

[Полный адрес для страны ${selectedCountry} в формате: ${addressFormat}]

[Телефон в местном формате с кодом страны для ${selectedCountry}]

[Email]

КРИТИЧЕСКИ ВАЖНО О ФОРМАТЕ КОНТАКТОВ:
- Адрес должен быть реальным и существующим для страны ${selectedCountry}
- Использовать только РЕАЛЬНЫЕ адреса, которые существуют и отображаются на Google Maps
- НЕ использовать адреса государственных учреждений, известных достопримечательностей или публичных мест
- Использовать адреса обычных офисных зданий, бизнес-центров, торговых центров или жилых комплексов в стране ${selectedCountry}
- Формат телефона должен соответствовать национальным стандартам страны ${selectedCountry} с международным кодом
- Email будет автоматически создан как info@[название-сайта].com

СТРОГО ОБЯЗАТЕЛЬНО - ФОРМАТ ВЫВОДА КОНТАКТОВ:
Каждый элемент контактов (заголовок, описание, адрес, телефон, email) ОБЯЗАТЕЛЬНО должен быть разделен ОДНОЙ пустой строкой.

Пример ПРАВИЛЬНОЙ структуры (адаптируйте под ${languageName}):
Контакты

(Свяжитесь с нами для оформления заявки или получения бесплатной консультации. Наши специалисты ответят на все ваши вопросы)

[Реальный адрес для страны ${selectedCountry}]

[Телефон для страны ${selectedCountry}]

info@company.com

КРИТИЧЕСКИ ВАЖНО: 
1. Заголовок "Контакты" и описание должны быть переведены на ${languageName}
2. ОБЯЗАТЕЛЬНО следуйте этому формату с пустыми строками между каждым элементом контактов!
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.MERCI) {
      sectionsPrompt += `=== РАЗДЕЛ: MERCI ===
ВАЖНО: Весь раздел MERCI должен быть СТРОГО на ${languageName}!

[Текст сообщения на ${languageName}]

[Текст кнопки на ${languageName}]

Примеры на разных языках:
- Русский: "Спасибо за обращение, с вами свяжется в ближайшее время наш специалист" / "Закрыть"
- Английский: "Thank you for your message, our specialist will contact you soon" / "Close"
- Испанский: "Gracias por su mensaje, nuestro especialista se pondrá en contacto con usted pronto" / "Cerrar"
- Немецкий: "Vielen Dank für Ihre Nachricht, unser Spezialist wird sich bald mit Ihnen in Verbindung setzen" / "Schließen"
- Французский: "Merci pour votre message, notre spécialiste vous contactera bientôt" / "Fermer"

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.LEGAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ПРАВОВЫЕ ДОКУМЕНТЫ ===
Создайте три юридических документа для сайта:
- Политика конфиденциальности (Privacy Policy)
- Пользовательское соглашение (Terms of Use)
- Политика использования cookie (Cookie Policy)

ФОРМАТ ДОКУМЕНТОВ:
1. Каждый документ должен начинаться с заголовка в круглых скобках на отдельной строке НА ВЫБРАННОМ ЯЗЫКЕ
2. После заголовка сразу идет текст документа
3. Между документами оставляйте РОВНО две пустые строки
4. Внутри документа используйте обычное форматирование с разделами

Примеры заголовков на разных языках:
- Русский: (Политика конфиденциальности), (Пользовательское соглашение), (Политика использования cookie)
- Английский: (Privacy Policy), (Terms of Use), (Cookie Policy)
- Испанский: (Política de Privacidad), (Términos de Uso), (Política de Cookies)
- Немецкий: (Datenschutzrichtlinie), (Nutzungsbedingungen), (Cookie-Richtlinie)
- Французский: (Politique de Confidentialité), (Conditions d'Utilisation), (Politique des Cookies)

ВАЖНО! НЕ УКАЗЫВАТЬ В ДОКУМЕНТАХ:
- Никакие контактные данные (адреса, телефоны, email)
- Конкретные названия сайтов или доменов
- Используйте обобщенные формулировки на выбранном языке, например:
  * "на нашем сайте" вместо конкретного названия
  * "через форму обратной связи" вместо конкретных контактов
  * "администрация сайта" вместо конкретных имен

СТРУКТУРА ДОКУМЕНТОВ (названия разделов должны быть на ВЫБРАННОМ ЯЗЫКЕ):

ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ должна включать разделы:
- Общие положения
- Какую информацию мы собираем
- Как мы используем информацию
- Защита данных и срок хранения
- Передача данных третьим лицам
- Использование файлов cookie
- Права пользователя
- Изменения в политике
- Согласие пользователя

ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ должно включать разделы:
- Общие положения и термины
- Права и обязанности пользователя
- Права и обязанности администрации
- Условия использования контента
- Интеллектуальная собственность
- Отказ от ответственности
- Регистрация и учетная запись
- Безопасность и конфиденциальность
- Порядок разрешения споров
- Заключительные положения

ПОЛИТИКА ИСПОЛЬЗОВАНИЯ COOKIE должна включать разделы:
- Что такое файлы cookie
- Типы файлов cookie
- Цели использования cookie
- Контроль файлов cookie
- Сторонние cookie-файлы
- Срок хранения cookie
- Как отключить cookie
- Обновления политики

ВАЖНЫЕ ТРЕБОВАНИЯ:
- Документы должны быть ПОЛНЫМИ (1500-2000 слов каждый)
- Соответствовать требованиям GDPR
- Быть универсальными для любой страны
- Использовать нейтральные формулировки на ВЫБРАННОМ ЯЗЫКЕ
- СТРОГО ЗАПРЕЩЕНО добавлять пробелы в конце строк
- СТРОГО ЗАПРЕЩЕНО использовать двойные пробелы
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать символы форматирования

СТРОГОЕ ПРАВИЛО: НЕ ДОБАВЛЯЙТЕ НИКАКОГО ТЕКСТА ПОСЛЕ ЗАКЛЮЧИТЕЛЬНОГО РАЗДЕЛА ПОСЛЕДНЕГО ДОКУМЕНТА. 
НЕ ЗАДАВАЙТЕ ВОПРОСЫ. НЕ ПРЕДЛАГАЙТЕ ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ.
НЕ ПИШИТЕ "Надеюсь, это вам поможет" ИЛИ ПОДОБНЫЕ ФРАЗЫ.
ОТВЕТ ДОЛЖЕН СОДЕРЖАТЬ ТОЛЬКО ТРИ ДОКУМЕНТА БЕЗ КАКИХ-ЛИБО ДОПОЛНИТЕЛЬНЫХ КОММЕНТАРИЕВ.

ПРОВЕРКА: Убедитесь, что ВСЕ заголовки и ВЕСЬ текст написаны ТОЛЬКО на выбранном языке. Не смешивайте языки. Если выбран не русский язык, НЕ используйте русский текст нигде в документах.

КРИТИЧЕСКИ ВАЖНО: Раздел правовых документов ОБЯЗАТЕЛЬНО должен заканчиваться разделителем "=== КОНЕЦ РАЗДЕЛА ===" после последнего документа. Это необходимо для корректной обработки системой!
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    sectionsPrompt += `Важные требования:
1. Разделители === РАЗДЕЛ: ИМЯ === всегда на русском языке
2. Заголовки внутри разделов - на выбранном языке
3. Весь контент (включая ID) - на выбранном языке
4. Не использовать специальные символы и форматирование
5. Каждый элемент должен начинаться с новой строки
6. Между карточками/пунктами оставлять ОДНУ пустую строку
7. ОБЯЗАТЕЛЬНО: Каждый раздел должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ===" - без исключений!
8. Проверьте, что ВСЕ разделы имеют закрывающий разделитель, особенно последний раздел
9. НЕ ПРОПУСКАЙТЕ раздел "=== РАЗДЕЛ: ПРАВОВЫЕ ДОКУМЕНТЫ ===" - он обязателен и должен содержать все три документа!
10. ВНИМАНИЕ: Убедитесь, что создали ВСЕ указанные разделы, включая правовые документы в самом конце
11. КРИТИЧЕСКИ ВАЖНО ДЛЯ РАЗДЕЛА MERCI:
    - Сообщение благодарности и текст кнопки ОБЯЗАТЕЛЬНО должны быть на ${languageName}
    - НЕ использовать русский язык по умолчанию, если выбран другой язык`;

    return sectionsPrompt;
  };

  // Функция для генерации отдельного промпта для правовых документов
  const generateLegalDocumentsPrompt = () => {
    const theme = globalSettings.theme === 'CUSTOM' 
      ? globalSettings.customTheme 
      : WEBSITE_THEMES[globalSettings.theme];

    let language;
    let languageCode = '';
    let documentTitles = {};
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageCode = globalSettings.customLanguage;
      language = `языке с кодом ISO ${globalSettings.customLanguage}`;
      documentTitles = {
        privacy: `Политика конфиденциальности`,
        terms: `Пользовательское соглашение`,
        cookies: `Политика использования cookie`
      };
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        const codeMatch = langObj.label.match(/\(([a-z]{2})\)/i);
        languageCode = codeMatch ? codeMatch[1].toLowerCase() : '';
        
        // Определяем язык и заголовки документов на этом языке
        switch(languageCode) {
          case 'en':
            language = 'английском языке';
            documentTitles = {
              privacy: `Privacy Policy`,
              terms: `Terms of Use`,
              cookies: `Cookie Policy`
            };
            break;
          case 'es':
            language = 'испанском языке';
            documentTitles = {
              privacy: `Política de Privacidad`,
              terms: `Términos de Uso`,
              cookies: `Política de Cookies`
            };
            break;
          case 'de':
            language = 'немецком языке';
            documentTitles = {
              privacy: `Datenschutzrichtlinie`,
              terms: `Nutzungsbedingungen`,
              cookies: `Cookie-Richtlinie`
            };
            break;
          case 'fr':
            language = 'французском языке';
            documentTitles = {
              privacy: `Politique de Confidentialité`,
              terms: `Conditions d'Utilisation`,
              cookies: `Politique des Cookies`
            };
            break;
          case 'it':
            language = 'итальянском языке';
            documentTitles = {
              privacy: `Informativa sulla Privacy`,
              terms: `Termini di Utilizzo`,
              cookies: `Politica sui Cookie`
            };
            break;
          case 'pl':
            language = 'польском языке';
            documentTitles = {
              privacy: `Polityka Prywatności`,
              terms: `Regulamin Użytkowania`,
              cookies: `Polityka Plików Cookie`
            };
            break;
          default:
            language = 'русском языке';
            languageCode = 'ru';
            documentTitles = {
              privacy: `Политика конфиденциальности`,
              terms: `Пользовательское соглашение`,
              cookies: `Политика использования cookie`
            };
        }
      } else {
        language = 'русском языке';
        languageCode = 'ru';
        documentTitles = {
          privacy: `Политика конфиденциальности`,
          terms: `Пользовательское соглашение`,
          cookies: `Политика использования cookie`
        };
      }
    } else {
      // Если язык не выбран, используем русский по умолчанию
      language = 'русском языке';
      languageCode = 'ru';
      documentTitles = {
        privacy: `Политика конфиденциальности`,
        terms: `Пользовательское соглашение`,
        cookies: `Политика использования cookie`
      };
    }

    // Получаем информацию о выбранной стране
    const { selectedCountry, addressFormat, countryCode } = getSelectedCountryInfo();

    return `СПЕЦИАЛИЗИРОВАННЫЙ ПРОМПТ ДЛЯ ПРАВОВЫХ ДОКУМЕНТОВ

Создайте три юридических документа для сайта "${theme}" (страна: ${selectedCountry}) СТРОГО на ${language}.

КРИТИЧЕСКИ ВАЖНО:
1. Весь текст документов ОБЯЗАТЕЛЬНО должен быть только на ${language}
2. Каждый документ должен быть ПОЛНЫМ (1500-2000 слов каждый)
3. ОБЯЗАТЕЛЬНО создайте СТРОГО ТРИ ДОКУМЕНТА (не больше, не меньше)
4. КАЖДЫЙ документ должен содержать МИНИМУМ 8 пунктов/разделов
5. Документы должны соответствовать требованиям GDPR и быть адаптированными для страны ${selectedCountry}
6. Документы должны быть профессиональными и юридически корректными
7. Наши сайты не нарушают никаких законов и соответствуют международным стандартам
8. Учитывать особенности законодательства страны ${selectedCountry}

ФОРМАТ ДОКУМЕНТОВ:
- Каждый документ начинается с заголовка в круглых скобках на отдельной строке
- Заголовки документов: (${documentTitles.privacy}), (${documentTitles.terms}), (${documentTitles.cookies})
- После заголовка сразу идет текст документа  
- Между документами оставляйте ровно две пустые строки
- Используйте четкую структуру с нумерованными разделами

СОЗДАЙТЕ ТРИ ДОКУМЕНТА В СТРОГОМ ПОРЯДКЕ:

1. ${documentTitles.privacy} (для страны ${selectedCountry}) - должна включать разделы НА ${language}:
   - Общие положения
   - Какую информацию мы собираем
   - Как мы используем информацию
   - Защита данных и срок хранения
   - Передача данных третьим лицам
   - Использование файлов cookie
   - Права пользователя
   - Изменения в политике
   - Согласие пользователя

2. ${documentTitles.terms} (для страны ${selectedCountry}) - должно включать разделы НА ${language}:
   - Общие положения и термины
   - Права и обязанности пользователя
   - Права и обязанности администрации
   - Условия использования контента
   - Интеллектуальная собственность
   - Отказ от ответственности
   - Безопасность и конфиденциальность
   - Порядок разрешения споров
   - Заключительные положения

3. ${documentTitles.cookies} (для страны ${selectedCountry}) - должна включать разделы НА ${language}:
   - Что такое файлы cookie
   - Типы файлов cookie
   - Цели использования cookie
   - Контроль файлов cookie
   - Сторонние cookie-файлы
   - Срок хранения cookie
   - Как отключить cookie
   - Обновления политики

СТРОГИЕ ПРАВИЛА:
- НЕ указывать конкретные контактные данные
- Использовать формулировки "наш сайт", "администрация сайта"
- НЕ добавлять комментарии после последнего документа
- НЕ использовать форматирование Markdown или HTML
- Ответ должен содержать ТОЛЬКО три документа
- Документы должны быть адаптированы для законодательства страны ${selectedCountry}
- Указать, что сайт соответствует международным стандартам и не нарушает законы
- Учитывать особенности правовой системы ${selectedCountry}
- ВСЕ названия разделов должны быть переведены на ${language}
- ВАЖНО: Создайте все документы ИСКЛЮЧИТЕЛЬНО на ${language}
- Каждый документ должен начинаться с заголовка в круглых скобках НА ${language}
- СТРУКТУРА ДОКУМЕНТОВ: названия разделов должны быть на ${language}

ФИНАЛЬНАЯ ПРОВЕРКА:
1. Создано ТОЧНО ТРИ ДОКУМЕНТА (проверьте количество!)
2. КАЖДЫЙ документ содержит МИНИМУМ 8 пунктов/разделов
3. Все документы написаны полностью на ${language}
4. Каждый документ содержит все требуемые разделы
5. Нет дополнительных комментариев после последнего документа
6. Объем каждого документа 1500-2000 слов
7. Документы профессиональные и юридически корректные`;
  };

  // Улучшенная функция генерации промпта полного сайта (без правовых документов)
  const generateOptimizedFullSitePrompt = (settings) => {
    const getWordRange = (section, field) => {
      const range = settings.wordRanges[section]?.[field];
      if (!range) return '';
      return `(${range.min}-${range.max} слов)`;
    };

    // Получаем информацию о выбранном языке из глобальных настроек
    let languageName = 'русском языке';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        languageName = langObj.label.split(' - ')[0]; // Берем русское название до " - "
      }
    }

    // Получаем информацию о выбранной стране
    const { selectedCountry, addressFormat, countryCode } = getSelectedCountryInfo();

    let sectionsPrompt = `ОПТИМИЗИРОВАННЫЙ ПРОМПТ ПОЛНОГО САЙТА

Создайте контент для сайта для страны ${selectedCountry} согласно указанным разделам.

ФОРМАТ РАЗДЕЛИТЕЛЕЙ:
=== РАЗДЕЛ: ИМЯ ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===

ВАЖНО: Каждый раздел ОБЯЗАТЕЛЬНО должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="

`;

    // Специальная обработка для телеком-оператора в ОАЭ
    if (globalSettings.theme === 'TELECOM_UAE') {
      sectionsPrompt += `СПЕЦИАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ ТЕЛЕКОМ-ОПЕРАТОРА В ОАЭ:\n`;
      sectionsPrompt += `- Фокус на mobile packages in UAE\n`;
      sectionsPrompt += `- 5G Mobile & Internet Plans in UAE for Video Calls with Family\n`;
      sectionsPrompt += `- Recharge Mobile & Internet in UAE. Top Up Mobile Plans\n`;
      sectionsPrompt += `- Quick Mobile & Internet Packages. Easy to Use\n`;
      sectionsPrompt += `- Home Plans: WiFi & TV\n`;
      sectionsPrompt += `- Smart & Simple, Easy to Use mobile plans\n`;
      sectionsPrompt += `- mobile lines uae, mobile plans 5g for video calls\n`;
      sectionsPrompt += `- 5g mobile plans for video calls in uae\n`;
      sectionsPrompt += `\nЗАПРЕЩЕННЫЕ СЛОВА (НЕ ИСПОЛЬЗОВАТЬ): best, pay, bill, payment, service, gambling, purchase, application, download, installation, software, money, payment gateway, tariff payment, casino, murder, budget, vignette, bank\n`;
      sectionsPrompt += `\nВАЖНО: Избегайте любых упоминаний о платежах, банковских операциях, казино и других запрещенных темах.\n\n`;
    }

    // Добавляем Hero секцию
    sectionsPrompt += `=== РАЗДЕЛ: HERO ===
1. Название сайта (1-2 слова)
2. Заголовок hero секции ${getWordRange('HERO', 'title')}
3. Описание ${getWordRange('HERO', 'description')}
=== КОНЕЦ РАЗДЕЛА ===

`;

    // Добавляем презентационное сообщение для бегущей строки
    sectionsPrompt += `=== РАЗДЕЛ: ПРЕЗЕНТАЦИОННОЕ СООБЩЕНИЕ ===
[Презентационное сообщение для бегущей строки сайта (8-15 слов)]

ВАЖНО: Это сообщение должно быть:
- Достаточно информативным (8-15 слов)
- Привлекательным и цепляющим
- Не содержать контактную информацию
- Быть на ${languageName}

Примеры:
- "✨ Специальное предложение этого месяца - первая консультация абсолютно БЕСПЛАТНО для новых клиентов!"
- "🎯 Решаем самые сложные правовые вопросы быстро, эффективно и с гарантией результата"
- "⚡ Новая услуга - срочная экспресс-консультация по любым вопросам за 24 часа"
=== КОНЕЦ РАЗДЕЛА ===

`;

    // Добавляем остальные секции
    if (settings.includedSections.ABOUT) {
      sectionsPrompt += `=== РАЗДЕЛ: О НАС ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('ABOUT', 'sectionTitle')}]
[Описание ${getWordRange('ABOUT', 'sectionDescription')}]

[${settings.cardCounts.ABOUT} карточек:]
Заголовок карточки
Описание ${getWordRange('ABOUT', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.SERVICES) {
      sectionsPrompt += `=== РАЗДЕЛ: УСЛУГИ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('SERVICES', 'sectionTitle')}]
[Описание ${getWordRange('SERVICES', 'sectionDescription')}]

[${settings.cardCounts.SERVICES} услуг:]
Название услуги
Описание ${getWordRange('SERVICES', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.FEATURES) {
      sectionsPrompt += `=== РАЗДЕЛ: ПРЕИМУЩЕСТВА ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('FEATURES', 'sectionTitle')}]
[Описание ${getWordRange('FEATURES', 'sectionDescription')}]

[${settings.cardCounts.FEATURES} преимуществ:]
Заголовок преимущества
Описание ${getWordRange('FEATURES', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.NEWS) {
      sectionsPrompt += `=== РАЗДЕЛ: НОВОСТИ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('NEWS', 'sectionTitle')}]
[Описание ${getWordRange('NEWS', 'sectionDescription')}]

[${settings.cardCounts.NEWS} новостей:]
Заголовок новости
Текст новости ${getWordRange('NEWS', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.FAQ) {
      sectionsPrompt += `=== РАЗДЕЛ: ВОПРОСЫ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('FAQ', 'sectionTitle')}]
[Описание ${getWordRange('FAQ', 'sectionDescription')}]

[${settings.cardCounts.FAQ} вопросов:]
Вопрос?
Ответ ${getWordRange('FAQ', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      sectionsPrompt += `=== РАЗДЕЛ: ОТЗЫВЫ ===
ID: [название секции на ${languageName}, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('TESTIMONIALS', 'sectionTitle')}]
[Описание ${getWordRange('TESTIMONIALS', 'sectionDescription')}]

[${settings.cardCounts.TESTIMONIALS} отзывов:]
Имя автора
Текст отзыва ${getWordRange('TESTIMONIALS', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: КОНТАКТЫ ===
ВАЖНО: Весь раздел контактов должен быть СТРОГО на ${languageName}!

[Заголовок на ${languageName}]

([Описание на ${languageName}, 15-20 слов])

[Полный адрес для страны ${selectedCountry} в формате: ${addressFormat}]

[Телефон в местном формате с кодом страны для ${selectedCountry}]

[Email]

КРИТИЧЕСКИ ВАЖНО О ФОРМАТЕ КОНТАКТОВ:
- Адрес должен быть реальным и существующим для страны ${selectedCountry}
- Использовать только РЕАЛЬНЫЕ адреса, которые существуют и отображаются на Google Maps
- НЕ использовать адреса государственных учреждений, известных достопримечательностей или публичных мест
- Использовать адреса обычных офисных зданий, бизнес-центров, торговых центров или жилых комплексов в стране ${selectedCountry}
- Формат телефона должен соответствовать национальным стандартам страны ${selectedCountry} с международным кодом
- Email будет автоматически создан как info@[название-сайта].com

КРИТИЧЕСКИ ВАЖНО - ФОРМАТ ВЫВОДА:
Каждый элемент контактов (заголовок, описание, адрес, телефон, email) ОБЯЗАТЕЛЬНО должен быть разделен ОДНОЙ пустой строкой.

Пример ПРАВИЛЬНОГО формата (адаптируйте под ${languageName}):
Контакты

(Описание контактов)

[Реальный адрес для страны ${selectedCountry}]

[Телефон для страны ${selectedCountry}]

info@company.com

КРИТИЧЕСКИ ВАЖНО:
1. Заголовок "Контакты" и описание должны быть переведены на ${languageName}
2. Строго следуйте этому формату с пустыми строками между каждым элементом!
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.MERCI) {
      sectionsPrompt += `=== РАЗДЕЛ: MERCI ===
ВАЖНО: Весь раздел MERCI должен быть СТРОГО на ${languageName}!

[Текст сообщения на ${languageName}]

[Текст кнопки на ${languageName}]

Примеры на разных языках:
- Русский: "Спасибо за обращение, с вами свяжется в ближайшее время наш специалист" / "Закрыть"
- Английский: "Thank you for your message, our specialist will contact you soon" / "Close"
- Испанский: "Gracias por su mensaje, nuestro especialista se pondrá en contacto con usted pronto" / "Cerrar"
- Немецкий: "Vielen Dank für Ihre Nachricht, unser Spezialist wird sich bald mit Ihnen in Verbindung setzen" / "Schließen"
- Французский: "Merci pour votre message, notre spécialiste vous contactera bientôt" / "Fermer"

=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    sectionsPrompt += `ТРЕБОВАНИЯ:
1. Весь контент на одном языке (указанном в настройках)
2. ID секций: буквы "ID" всегда на английском, название секции после двоеточия - на ${languageName}
3. Не использовать форматирование Markdown/HTML
4. Каждый раздел должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. Не пропускать указанные разделы
6. КРИТИЧЕСКИ ВАЖНО ДЛЯ АДРЕСОВ:
   - Использовать только РЕАЛЬНЫЕ адреса, которые существуют на Google Maps для страны ${selectedCountry}
   - НЕ использовать: известные улицы/места, правительственные здания, достопримечательности
   - Использовать адреса обычных бизнес-центров, офисных зданий, торговых центров
7. КРИТИЧЕСКИ ВАЖНО ДЛЯ РАЗДЕЛА MERCI:
   - Сообщение благодарности и текст кнопки ОБЯЗАТЕЛЬНО должны быть на ${languageName}
   - НЕ использовать русский язык по умолчанию, если выбран другой язык`;

    return sectionsPrompt;
  };

  // Модифицируем функцию копирования промпта
  const copyPromptToClipboard = () => {
    // Для полного сайта показываем диалог настроек
    if (targetSection === 'FULL_SITE') {
      setShowFullSiteSettings(true);
      return;
    }
    
    let finalPrompt = '';
    
    // Для правовых документов используем специализированный промпт
    if (targetSection === 'LEGAL') {
      finalPrompt = applyGlobalSettings(generateLegalDocumentsPrompt());
    } else {
      const prompt = prompts[targetSection] || `Сгенерируйте для меня ${
        targetSection === 'FEATURES' ? 'преимущества' : 
        targetSection === 'ABOUT' ? 'информацию о' :
        'раздел'} для сайта.`;
      
      finalPrompt = applyGlobalSettings(prompt);
    }
    
    navigator.clipboard.writeText(finalPrompt)
      .then(() => {
        let successMessage = '';
        if (targetSection === 'LEGAL') {
          successMessage = 'Специализированный промпт для правовых документов скопирован в буфер обмена.';
        } else {
          successMessage = 'Промпт с глобальными настройками скопирован в буфер обмена.';
        }
        
        setParserMessage(successMessage);
        // Очищаем текстовое поле после копирования
        handleClearText();
      })
      .catch(() => {
        setParserMessage('Не удалось скопировать промпт.');
      });
  };
  
  // Функция для обработки сохранения настроек промпта полного сайта с автоматической генерацией через OpenAI
  const handleFullSiteSettingsSave = async (settings, promptType = 'full') => {
    setFullSiteSettings(settings);
    
    // Автоматически выбираем соответствующий раздел в парсере
    if (promptType === 'legal_only') {
      setTargetSection('LEGAL');
    } else if (promptType === 'optimized') {
      setTargetSection('FULL_SITE');
    } else {
      setTargetSection('FULL_SITE');
    }
    
    let finalPrompt = '';
    
    // Генерируем промпт в зависимости от типа
    if (promptType === 'legal_only') {
      finalPrompt = applyGlobalSettings(generateLegalDocumentsPrompt());
    } else if (promptType === 'optimized') {
      const optimizedPrompt = generateOptimizedFullSitePrompt(settings);
      finalPrompt = applyGlobalSettings(optimizedPrompt);
    } else {
      const fullSitePrompt = generateFullSitePrompt(settings);
      finalPrompt = applyGlobalSettings(fullSitePrompt);
    }
    
    // Запускаем автоматическую генерацию через OpenAI
    try {
      setIsGeneratingAI(true);
      setAiGenerationProgress('Подготовка промпта...');
      
      // Небольшая задержка для UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAiGenerationProgress('Отправка запроса к OpenAI...');
      
      // Определяем тип запроса для правильной конфигурации
      const requestType = promptType === 'legal_only' ? 'LEGAL' : 'FULL_SITE';
      
      // Отправляем запрос к OpenAI с retry логикой
      const generatedContent = await openaiService.sendRequest(finalPrompt, requestType);
      
      setAiGenerationProgress('Обработка ответа...');
      
      // Небольшая задержка перед отображением результата
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Автоматически заполняем текстовое поле сгенерированным контентом
      setContent(generatedContent);
      
      // Показываем сообщение об успехе
      let successMessage = '';
      if (promptType === 'legal_only') {
        successMessage = '✅ Правовые документы успешно сгенерированы через OpenAI!';
      } else if (promptType === 'optimized') {
        successMessage = '✅ Оптимизированный контент сайта успешно сгенерирован через OpenAI!';
      } else {
        successMessage = '✅ Полный контент сайта успешно сгенерирован через OpenAI!';
      }
      
      setParserMessage(successMessage);
      
      // Также копируем промпт в буфер обмена для справки
      navigator.clipboard.writeText(finalPrompt).catch(() => {
        console.warn('Не удалось скопировать промпт в буфер обмена');
      });
      
      // Автоматически закрываем диалог через 2 секунды после успешной генерации
      setTimeout(() => {
        setShowFullSiteSettings(false);
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка генерации через OpenAI:', error);
      
      // В случае ошибки, показываем промпт и копируем его в буфер
      setContent('');
      setParserMessage(`❌ Ошибка OpenAI: ${error.message}. Промпт скопирован в буфер обмена для ручного использования.`);
      
      // Копируем промпт в буфер обмена как fallback
      navigator.clipboard.writeText(finalPrompt)
        .then(() => {
          handleClearText();
        })
        .catch(() => {
          setParserMessage('❌ Ошибка OpenAI и не удалось скопировать промпт.');
        });
        
    } finally {
      setIsGeneratingAI(false);
      setAiGenerationProgress('');
    }
  };

  // Функция для применения глобальных настроек к промпту
  const applyGlobalSettings = (promptText) => {
    const theme = globalSettings.theme === 'CUSTOM' 
      ? globalSettings.customTheme 
      : WEBSITE_THEMES[globalSettings.theme];

    // Определение языка для промпта
    let language;
    let languageCode = '';
    let languageName = '';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageCode = globalSettings.customLanguage;
      language = `языке с кодом ISO ${globalSettings.customLanguage}`;
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        // Извлекаем название языка и код
        languageName = langObj.label.split(' - ')[0]; // Берем русское название до " - "
        language = languageName;
        
        // Извлекаем код языка из строки в формате "Русский - English (en)"
        const codeMatch = langObj.label.match(/\(([a-z]{2})\)/i);
        languageCode = codeMatch ? codeMatch[1].toLowerCase() : '';
      } else {
        languageName = 'русском языке';
        language = languageName;
        languageCode = 'ru';
      }
    } else {
      // Если язык не выбран, используем русский по умолчанию
      languageName = 'русском языке';
      language = languageName;
      languageCode = 'ru';
    }

    let enhancedPrompt = `Создайте контент для сайта "${theme}" на ${language}.\n`;
    enhancedPrompt += `Стиль контента: ${CONTENT_STYLES[globalSettings.contentStyle]}.\n`;
    enhancedPrompt += `ВАЖНО: Не используйте никакого форматирования (Markdown, HTML). Не используйте символы **, ---, ###, _ или другие специальные символы для форматирования. Выдавайте чистый текст.\n`;

    // Специальная обработка для телеком-оператора в ОАЭ
    if (globalSettings.theme === 'TELECOM_UAE') {
      enhancedPrompt += `\nСПЕЦИАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ ТЕЛЕКОМ-ОПЕРАТОРА В ОАЭ:\n`;
      enhancedPrompt += `- Фокус на mobile packages in UAE\n`;
      enhancedPrompt += `- 5G Mobile & Internet Plans in UAE for Video Calls with Family\n`;
      enhancedPrompt += `- Recharge Mobile & Internet in UAE. Top Up Mobile Plans\n`;
      enhancedPrompt += `- Quick Mobile & Internet Packages. Easy to Use\n`;
      enhancedPrompt += `- Home Plans: WiFi & TV\n`;
      enhancedPrompt += `- Smart & Simple, Easy to Use mobile plans\n`;
      enhancedPrompt += `- mobile lines uae, mobile plans 5g for video calls\n`;
      enhancedPrompt += `- 5g mobile plans for video calls in uae\n`;
      enhancedPrompt += `\nЗАПРЕЩЕННЫЕ СЛОВА (НЕ ИСПОЛЬЗОВАТЬ): best, pay, bill, payment, service, gambling, purchase, application, download, installation, software, money, payment gateway, tariff payment, casino, murder, budget, vignette, bank\n`;
      enhancedPrompt += `\nВАЖНО: Избегайте любых упоминаний о платежах, банковских операциях, казино и других запрещенных темах.\n`;
    }

    if (globalSettings.additionalKeywords) {
      enhancedPrompt += `Ключевые особенности: ${globalSettings.additionalKeywords}\n`;
    }

    const features = [];
    if (globalSettings.usePrice) features.push('указывать цены');
    if (globalSettings.usePromotions) features.push('включать акции и спецпредложения');
    if (globalSettings.useContacts) features.push('добавлять контактную информацию');
    if (globalSettings.useSocial) features.push('упоминать социальные сети');

    if (features.length > 0) {
      enhancedPrompt += `Дополнительно: ${features.join(', ')}.\n`;
    }

    if (globalSettings.customInstructions) {
      enhancedPrompt += `Особые требования: ${globalSettings.customInstructions}\n`;
    }

    enhancedPrompt += '\nФормат ответа:\n';
    enhancedPrompt += '1. Используйте обычный текст без специальных символов форматирования\n';
    enhancedPrompt += '2. Разделяйте секции с помощью пустых строк\n';
    enhancedPrompt += '3. Цены и акции указывайте в обычном тексте, например: "Цена: 10000 рублей"\n\n';

    // Специальная обработка для промпта правовых документов
    if (targetSection === 'LEGAL') {
      // Добавляем дополнительное указание перед промптом для лучшего понимания AI
      enhancedPrompt = `Создайте юридические документы для сайта "${theme}" СТРОГО на ${language}.\n`;
      enhancedPrompt += `Код языка: ${languageCode || 'не указан'}\n`;
      enhancedPrompt += `ВАЖНО: Весь текст документов ОБЯЗАТЕЛЬНО должен быть только на ${language}.\n`;
      enhancedPrompt += `Стиль: ${CONTENT_STYLES[globalSettings.contentStyle]}.\n\n`;
      
      // Специальная обработка для телеком-оператора в ОАЭ
      if (globalSettings.theme === 'TELECOM_UAE') {
        enhancedPrompt += `СПЕЦИАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ ТЕЛЕКОМ-ОПЕРАТОРА В ОАЭ:\n`;
        enhancedPrompt += `- Фокус на mobile packages in UAE\n`;
        enhancedPrompt += `- 5G Mobile & Internet Plans in UAE for Video Calls with Family\n`;
        enhancedPrompt += `- Recharge Mobile & Internet in UAE. Top Up Mobile Plans\n`;
        enhancedPrompt += `- Quick Mobile & Internet Packages. Easy to Use\n`;
        enhancedPrompt += `- Home Plans: WiFi & TV\n`;
        enhancedPrompt += `- Smart & Simple, Easy to Use mobile plans\n`;
        enhancedPrompt += `- mobile lines uae, mobile plans 5g for video calls\n`;
        enhancedPrompt += `- 5g mobile plans for video calls in uae\n`;
        enhancedPrompt += `\nЗАПРЕЩЕННЫЕ СЛОВА (НЕ ИСПОЛЬЗОВАТЬ): best, pay, bill, payment, service, gambling, purchase, application, download, installation, software, money, payment gateway, tariff payment, casino, murder, budget, vignette, bank\n`;
        enhancedPrompt += `\nВАЖНО: Избегайте любых упоминаний о платежах, банковских операциях, казино и других запрещенных темах.\n\n`;
      }
      
      if (globalSettings.customInstructions) {
        enhancedPrompt += `Дополнительные требования: ${globalSettings.customInstructions}\n\n`;
      }

      enhancedPrompt += promptText;
      
      // Добавляем финальную проверку с более строгими правилами
      enhancedPrompt += `\n\nФИНАЛЬНАЯ ПРОВЕРКА: 
1. Убедитесь, что ВСЕ документы написаны ПОЛНОСТЬЮ на ${language}, включая ВСЕ заголовки.
2. ПОЛНОСТЬЮ УДАЛИТЕ любые дополнительные комментарии, вопросы или предложения после последнего документа.
3. НЕ ДОБАВЛЯЙТЕ фразы типа "Надеюсь, это помогло", "Нужно ли еще что-то" или любые другие завершающие комментарии.
4. Ответ должен заканчиваться последним разделом последнего документа БЕЗ каких-либо добавлений.`;
      
      return enhancedPrompt;
    }

    // Стандартная обработка для других типов промптов
    enhancedPrompt += promptText;
    return enhancedPrompt;
  };

  // Добавляем функцию для обновления кода языка в headerData при изменении языка в глобальных настройках
  const handleGlobalSettingsChange = (newSettings) => {
    setGlobalSettings(newSettings);
    
    // Получаем код языка ISO 639-1
    let languageCode = '';
    
    if (newSettings.language === 'CUSTOM') {
      // Если выбран "Другой язык", используем значение из поля ввода
      languageCode = newSettings.customLanguage || '';
    } else if (newSettings.language) {
      // Извлекаем код языка из объекта языка
      const langObj = LANGUAGES.find(lang => lang.code === newSettings.language);
      if (langObj) {
        const match = langObj.label.match(/\(([a-z]{2})\)/i);
        languageCode = match ? match[1].toLowerCase() : '';
      }
    } else {
      // Если язык не выбран, используем русский по умолчанию
      languageCode = 'ru';
    }
    
    // Обновляем код языка в настройках шапки, если он отличается
    if (languageCode && (headerData.language !== languageCode)) {
      onHeaderChange({
        ...headerData,
        language: languageCode
      });
    }
  };

  // Обработка изменения текста
  const handleTextChange = (e) => {
    // Нормализуем переносы строк и убираем экранирование
    const normalizedText = e.target.value
      .replace(/\r\n/g, '\n')
      .replace(/\\===/g, '==='); // Убираем экранирование разделителей
    setContent(normalizedText);
  };

  // Очищаем Markdown при вставке текста и нормализуем переносы строк
  const handleTextPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    
    // Нормализуем переносы строк в вставленном тексте и убираем экранирование
    const normalizedText = pastedText
      .replace(/\r\n/g, '\n')  // Заменяем CRLF на LF
      .replace(/\r/g, '\n')   // Заменяем CR на LF
      .replace(/\\===/g, '==='); // Убираем экранирование разделителей
    
    setContent(normalizedText);
    
    // Эмулируем изменение для правильной обработки разделителей
    if (textareaRef.current) {
      const event = new Event('input', { bubbles: true });
      textareaRef.current.value = normalizedText;
      textareaRef.current.dispatchEvent(event);
    }
  };

  const handleClearText = () => {
    setContent('');
    setResult(null);
    setParserMessage('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Функция для сохранения отредактированного промпта
  const handleSavePrompt = () => {
    if (editingPromptType) {
      setPrompts(prev => ({
        ...prev,
        [editingPromptType]: editingPromptText
      }));
    }
    setShowPromptEditor(false);
    setEditingPromptType(null);
    setEditingPromptText('');
  };

  // Обработка парсинга
  const handleParse = () => {
    try {
      setParserMessage('');
      setResult(null);
      
      if (!content.trim()) {
        setParserMessage('Введите текст для парсинга.');
        return;
      }
      
      if (targetSection) {
        let parsedData = null;
        
        switch (targetSection) {
          case 'FULL_SITE':
            parsedData = parsers.parseFullSite(content, headerData, contactData);
            if (parsedData) {
              console.log('Результаты парсинга полного сайта:', parsedData);
              
              // Создаем новый объект для всех секций
              const updatedSections = { ...sectionsData };
              
              // Обновляем Hero секцию и заголовок сайта
              if (parsedData.hero) {
                console.log('Обрабатываем Hero секцию:', parsedData.hero);
                
                // Обновляем данные hero-секции
                const updatedHeroData = { ...heroData };
                
                if (parsedData.hero.title) {
                  updatedHeroData.title = parsedData.hero.title;
                }
                
                if (parsedData.hero.description) {
                  updatedHeroData.subtitle = parsedData.hero.description;
                }
                
                // Сначала обновляем headerData с новым description
                const updatedHeaderData = { ...headerData };
                let headerNeedsUpdate = false;
                
                if (parsedData.hero.siteName) {
                  updatedHeaderData.siteName = parsedData.hero.siteName;
                  headerNeedsUpdate = true;
                }
                
                // Автоматически обновляем description из hero.description
                if (parsedData.hero.description) {
                  console.log('🔄 Обновляю headerData.description из hero.description:', parsedData.hero.description);
                  updatedHeaderData.description = parsedData.hero.description;
                  headerNeedsUpdate = true;
                  console.log('🔄 Новое значение updatedHeaderData.description:', updatedHeaderData.description);
                }
                
                if (headerNeedsUpdate) {
                  console.log('🔄 AiParser: Вызываю onHeaderChange с обновленными данными:', updatedHeaderData);
                  onHeaderChange(updatedHeaderData);
                }
                
                // Затем применяем обновления hero
                console.log('🔄 AiParser: Вызываю onHeroChange с обновленными данными:', updatedHeroData);
                onHeroChange(updatedHeroData);
                
                // Принудительно обновляем description еще раз после обновления hero
                if (parsedData.hero.description) {
                  console.log('🔄 AiParser: Принудительно обновляю description после onHeroChange:', parsedData.hero.description);
                  // Обновляем description напрямую без setTimeout
                  onHeaderChange(prev => {
                    console.log('🔄 Принудительное обновление: предыдущее значение:', prev.description);
                    const updated = { ...prev, description: parsedData.hero.description };
                    console.log('🔄 Принудительное обновление: новое значение:', updated.description);
                    return updated;
                  });
                }
              }
              
              // Определяем порядок секций для меню: О нас, Услуги, Преимущества, Новости, FAQ, Отзывы
              const sectionOrder = ['about', 'services', 'features', 'news', 'faq', 'testimonials'];

              // Создаем список пунктов меню, сохраняя нужный порядок
              const processOrderedSections = () => {
                // Создаем список секций в нужном порядке
                const orderedMenuItems = [];
                
                console.log('Доступные секции в parsedData:', Object.keys(parsedData));
                
                // Обрабатываем каждую секцию
                for (const sectionId of sectionOrder) {
                  console.log(`Обрабатываем секцию ${sectionId}`);
                  
                  // Получаем заголовок секции из parsedData
                  let section = null;
                  
                  switch (sectionId) {
                    case 'about':
                      section = parsedData.about;
                      break;
                    case 'services':
                      section = parsedData.services;
                      break;
                    case 'features':
                      section = parsedData.features;
                      break;
                    case 'news':
                      section = parsedData.news;
                      console.log('Секция новостей:', section);
                      break;
                    case 'faq':
                      section = parsedData.faq;
                      break;
                    case 'testimonials':
                      section = parsedData.testimonials;
                      break;
                  }
                  
                  if (section) {
                    console.log(`Секция ${sectionId} найдена:`, section);
                    
                    // ВАЖНОЕ ИЗМЕНЕНИЕ: 
                    // 1. Сохраняем секцию по её ID, а не по ключу массива
                    // 2. Явно указываем все важные поля, включая заголовок и описание 
                    updatedSections[section.id] = {
                      id: section.id,
                      title: section.title,
                      description: section.description,
                      cardType: section.cardType || 'ELEVATED',
                      cards: section.cards || [],
                      titleColor: section.titleColor || '#1976d2',
                      descriptionColor: section.descriptionColor || '#666666'
                    };
                    
                    console.log(`Обновлена секция ${section.id}:`, updatedSections[section.id]);
                    
                    // Используем заголовок секции для названия в меню
                    let menuText = section.id;
                    let menuId = section.id;

                    if (sectionId === 'news') {
                      console.log('Обрабатываем раздел новостей, ID из контента:', section.id);
                    }
                    
                    // Проверяем существование пункта меню
                    const existingMenuItem = headerData.menuItems.find(item => item.id === menuId);
                    
                    if (existingMenuItem) {
                      // Обновляем существующий пункт меню
                      orderedMenuItems.push({
                        ...existingMenuItem,
                        text: menuText,
                        link: `#${menuId}`
                      });
                    } else {
                      // Добавляем новый пункт меню
                      orderedMenuItems.push({
                        id: menuId,
                        text: menuText,
                        link: `#${menuId}`,
                        backgroundColor: '#ffffff',
                        textColor: '#000000',
                        borderColor: '#e0e0e0',
                        shadowColor: 'rgba(0,0,0,0.1)',
                        gradientStart: '#ffffff',
                        gradientEnd: '#f5f5f5',
                        gradientDirection: 'to right'
                      });
                    }
                  }
                }
                
                return orderedMenuItems;
              };

              // Заменяем существующий код создания menuItems этой функцией
              const menuItems = processOrderedSections();
              
              console.log('Обновленные секции перед применением:', updatedSections);

              // Обновляем все секции за один вызов
              onSectionsChange(updatedSections);

              // Обновляем меню с правильным порядком секций
              const finalHeaderData = {
                ...headerData,
                menuItems: menuItems
              };

              // Проверим, был ли обновлен заголовок сайта через hero
              if (parsedData.hero && parsedData.hero.siteName) {
                finalHeaderData.siteName = parsedData.hero.siteName;
              }
              
              // Проверим, был ли обновлен description через hero
              if (parsedData.hero && parsedData.hero.description) {
                console.log('🔄 FULL_SITE: Обновляю finalHeaderData.description из hero.description:', parsedData.hero.description);
                finalHeaderData.description = parsedData.hero.description;
              }

              // Обрабатываем презентационное сообщение для бегущей строки
              if (parsedData.runningLineMessage) {
                console.log('Обрабатываем презентационное сообщение для бегущей строки:', parsedData.runningLineMessage);
                
                // Обновляем данные бегущей строки в headerData
                finalHeaderData.runningLine = {
                  ...finalHeaderData.runningLine,
                  enabled: true,
                  text: parsedData.runningLineMessage
                };
                
                console.log('Обновленные данные бегущей строки:', finalHeaderData.runningLine);
              }

              // Теперь применяем все обновления к headerData
              onHeaderChange(finalHeaderData);
              
              // Обновляем контакты
              let updatedContactData = contactData;
              if (parsedData.contacts) {
                updatedContactData = {
                  ...parsedData.contacts,
                  thankYouMessage: parsedData.merci?.message || contactData?.thankYouMessage,
                  closeButtonText: parsedData.merci?.closeButtonText || contactData?.closeButtonText
                };
                onContactChange(updatedContactData);
              }
              
              // Обновляем правовые документы с актуальными контактными данными
              if (parsedData.legalDocuments) {
                console.log('Обновляем правовые документы с актуальными контактами:', updatedContactData);
                
                // Перепарсиваем правовые документы с обновленными контактными данными
                const updatedLegalDocuments = {};
                Object.keys(parsedData.legalDocuments).forEach(docType => {
                  const doc = parsedData.legalDocuments[docType];
                  if (doc && doc.content) {
                    // Удаляем старую контактную информацию из конца документа
                    let cleanContent = doc.content;
                    
                    // Удаляем блок с контактами в конце (если есть эмодзи)
                    const contactBlockRegex = /\n\n🏢.*$/s;
                    cleanContent = cleanContent.replace(contactBlockRegex, '');
                    
                    // Добавляем новые контактные данные
                    let contactBlock = '\n\n';
                    
                    if (updatedContactData.companyName) {
                      contactBlock += `🏢 ${updatedContactData.companyName}\n`;
                    }
                    
                    if (updatedContactData.address) {
                      contactBlock += `📍 ${updatedContactData.address}\n`;
                    }
                    
                    if (updatedContactData.phone) {
                      contactBlock += `📞 ${updatedContactData.phone}\n`;
                    }
                    
                    if (updatedContactData.email) {
                      contactBlock += `📧 ${updatedContactData.email}\n`;
                    }
                    
                    updatedLegalDocuments[docType] = {
                      ...doc,
                      content: cleanContent + contactBlock
                    };
                  } else {
                    updatedLegalDocuments[docType] = doc;
                  }
                });
                
                onLegalDocumentsChange(updatedLegalDocuments);
              }
              
              // Добавляем принудительное обновление для гарантии применения всех изменений
              setTimeout(() => {
                console.log('Принудительное обновление страницы для применения изменений');
                // Повторно применяем обновления всех секций
                onSectionsChange({...updatedSections});
              }, 100);
              
              // Формируем сообщение о том, что было обновлено
              const updatedParts = [];
              if (parsedData.hero) updatedParts.push('главная секция');
              if (Object.keys(updatedSections).length > 0) updatedParts.push('разделы сайта');
              if (parsedData.contacts) updatedParts.push('контакты');
              if (parsedData.legalDocuments) updatedParts.push('правовые документы');
              
              const message = updatedParts.length > 0 
                ? `Успешно обновлены: ${updatedParts.join(', ')}`
                : 'Все разделы сайта успешно обновлены';
              
              setParserMessage(message);
            }
            break;
        case 'SERVICES':
          parsedData = parsers.parseServices(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Создаем новый пункт меню, используя id для текста меню
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData с новым или обновленным пунктом меню
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция успешно обновлена.');
            } else {
              setParserMessage('Секция успешно добавлена в меню.');
            }
          }
          break;
        case 'FEATURES':
          parsedData = parsers.parseAdvantagesSection(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const existingFeatureMenuItem = headerData.menuItems.find(item => item.id === parsedData.id);
                    
            // Обновляем пункт меню, если он существует
            if (existingFeatureMenuItem) {
              // Находим индекс существующего пункта меню
              const featureMenuIndex = headerData.menuItems.findIndex(item => item.id === parsedData.id);
                        
              // Создаем обновленный список пунктов меню
              const updatedFeatureMenuItems = [...headerData.menuItems];
              updatedFeatureMenuItems[featureMenuIndex] = {
                ...existingFeatureMenuItem,
                text: parsedData.id,
                link: `#${parsedData.id}`
              };
                        
              // Обновляем headerData
              onHeaderChange({
                ...headerData,
                menuItems: updatedFeatureMenuItems
              });
            } else {
              // Создаем новый пункт меню
              const newFeatureMenuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: `#${parsedData.id}`
              };
                        
              // Обновляем headerData
              onHeaderChange({
                ...headerData,
                menuItems: [...headerData.menuItems, newFeatureMenuItem]
              });
            }
                    
            // Сохраняем обновленные данные
            onSectionsChange({
              ...sectionsData,
              [parsedData.id]: parsedData
            });
                    
            setParserMessage('Данные раздела "Преимущества" успешно обновлены.');
          }
          break;
        case 'ABOUT':
          parsedData = parsers.parseAboutSection(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Создаем новый пункт меню
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData с новым или обновленным пунктом меню
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция "О нас" успешно обновлена.');
            } else {
              setParserMessage('Секция "О нас" успешно добавлена в меню.');
            }
          }
          break;
        case 'TESTIMONIALS':
          parsedData = parsers.parseTestimonials(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Создаем новый пункт меню
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData с новым или обновленным пунктом меню
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция отзывов успешно обновлена.');
            } else {
              setParserMessage('Секция отзывов успешно добавлена в меню.');
            }
          }
          break;
        case 'FAQ':
          parsedData = parsers.parseFaq(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Create new menu item
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Update headerData with new or updated menu item
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Create or update section
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Update sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция FAQ успешно обновлена.');
            } else {
              setParserMessage('Секция FAQ успешно добавлена в меню.');
            }
          }
          break;
        case 'NEWS':
          parsedData = parsers.parseNews(content);
          if (parsedData) {
              console.log('Результат обработки новостей:', parsedData);
              
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id, 
                      link: `#${parsedData.id}`,
                      backgroundColor: '#ffffff',
                      textColor: '#000000',
                      borderColor: '#e0e0e0',
                      shadowColor: 'rgba(0,0,0,0.1)',
                      gradientStart: '#ffffff',
                      gradientEnd: '#f5f5f5',
                      gradientDirection: 'to right'
                    }
                  : item
              );
            } else {
              // Create new menu item
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id, 
                link: `#${parsedData.id}`,
                backgroundColor: '#ffffff',
                textColor: '#000000',
                borderColor: '#e0e0e0',
                shadowColor: 'rgba(0,0,0,0.1)',
                gradientStart: '#ffffff',
                gradientEnd: '#f5f5f5',
                gradientDirection: 'to right'
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Update headerData with new or updated menu item
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Create or update section
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: 'ELEVATED',
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Update sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция новостей успешно обновлена.');
            } else {
              setParserMessage('Секция новостей успешно добавлена в меню.');
            }
          }
          break;
        case 'CONTACTS':
          parsedData = parsers.parseContacts(content, headerData);
          if (parsedData) {
            onContactChange(parsedData);
            setParserMessage('Контактные данные успешно обновлены.');
          }
          break;
        case 'LEGAL':
          parsedData = parsers.parseLegalDocuments(content, contactData);
          if (parsedData) {
            onLegalDocumentsChange(parsedData);
            setParserMessage('Правовые документы успешно обновлены.');
          }
          break;
        case 'HERO':
          parsedData = parsers.parseHero(content);
          if (parsedData) {
            // Обновляем название сайта и description в headerData
            const updatedHeaderData = { ...headerData };
            if (parsedData.siteName) {
              updatedHeaderData.siteName = parsedData.siteName;
            }
            if (parsedData.description) {
              console.log('🔄 HERO: Обновляю headerData.description из hero.description:', parsedData.description);
              updatedHeaderData.description = parsedData.description;
            }
            
            if (parsedData.siteName || parsedData.description) {
              onHeaderChange(updatedHeaderData);
            }
            
            // Обновляем hero секцию
            onHeroChange({
              ...heroData,
              title: parsedData.title,
              subtitle: parsedData.description
            });
            setParserMessage('Данные для главной секции успешно обновлены.');
          }
          break;
        default:
          setParserMessage('Выберите тип раздела для парсинга.');
          return;
      }

      if (parsedData) {
        setResult(parsedData);
      } else {
        setParserMessage('Не удалось обработать текст. Проверьте формат и попробуйте снова.');
        }
      }
    } catch (error) {
      console.error('Error in handleParse:', error);
      setParserMessage('Произошла ошибка при обработке текста. Проверьте формат и попробуйте снова.');
    }
  };

  const handleOpenPromptEditor = (sectionType) => {
    setEditingPromptType(sectionType);
    setEditingPromptText(prompts[sectionType] || '');
    setShowPromptEditor(true);
  };

  // Обработчик для применения стиля ко всему сайту
  const handleApplyWholeWebsiteStyle = (styleName, stylePreset, contactPreset, headerPreset) => {
    console.log(`Применяем стиль ${styleName} ко всему сайту`);
    
    // Применяем стиль к шапке сайта
    if (onHeaderChange && headerData) {
      if (headerPreset) {
        // Если передан headerPreset, применяем его
        onHeaderChange({
          ...headerData,
          titleColor: headerPreset.titleColor,
          backgroundColor: headerPreset.backgroundColor,
          linksColor: headerPreset.linksColor,
          siteBackgroundType: headerPreset.siteBackgroundType || 'solid',
          ...((!headerPreset.siteBackgroundType || headerPreset.siteBackgroundType === 'solid') && {
            siteBackgroundColor: headerPreset.siteBackgroundColor || headerPreset.backgroundColor || '#ffffff'
          }),
          ...(headerPreset.siteBackgroundType === 'gradient' && {
            siteGradientColor1: headerPreset.siteGradientColor1 || headerPreset.backgroundColor || '#ffffff',
            siteGradientColor2: headerPreset.siteGradientColor2 || headerPreset.cardBackgroundColor || '#f5f5f5',
            siteGradientDirection: headerPreset.siteGradientDirection || 'to bottom'
          })
        });
        
        // Применяем цвета из headerPreset к hero секции
        if (onHeroChange && heroData) {
          onHeroChange({
            ...heroData,
            titleColor: headerPreset.titleColor,
            subtitleColor: headerPreset.linksColor,
            descriptionColor: headerPreset.linksColor,
            backgroundColor: headerPreset.backgroundColor,
            borderColor: stylePreset.borderColor,
          });
        }
      } else {
        // Иначе применяем стандартный стиль
        onHeaderChange({
          ...headerData,
          titleColor: stylePreset.titleColor,
          backgroundColor: stylePreset.backgroundColor,
          borderColor: stylePreset.borderColor,
          linksColor: stylePreset.descriptionColor,
          // Добавляем свойства фона сайта
          siteBackgroundType: stylePreset.siteBackgroundType || 'solid',
          ...((!stylePreset.siteBackgroundType || stylePreset.siteBackgroundType === 'solid') && {
            siteBackgroundColor: stylePreset.siteBackgroundColor || stylePreset.backgroundColor || '#ffffff'
          }),
          ...(stylePreset.siteBackgroundType === 'gradient' && {
            siteGradientColor1: stylePreset.siteGradientColor1 || stylePreset.backgroundColor || '#ffffff',
            siteGradientColor2: stylePreset.siteGradientColor2 || stylePreset.cardBackgroundColor || '#f5f5f5',
            siteGradientDirection: stylePreset.siteGradientDirection || 'to bottom'
          })
        });
        
        // Применяем стиль к герою, используя цвета из stylePreset
        if (onHeroChange && heroData) {
          onHeroChange({
            ...heroData,
            titleColor: stylePreset.titleColor,
            subtitleColor: stylePreset.descriptionColor,
            descriptionColor: stylePreset.descriptionColor,
            backgroundColor: stylePreset.backgroundColor,
            borderColor: stylePreset.borderColor,
          });
        }
      }
    }

    // Применяем стиль к разделам
    if (onSectionsChange && sectionsData) {
      const updatedSections = {};
      
      // Применяем стиль к каждой секции независимо от её ID
      Object.keys(sectionsData).forEach(sectionId => {
        const section = sectionsData[sectionId];
        
        // Обновляем свойства секции
        updatedSections[sectionId] = {
          ...section,
          titleColor: stylePreset.titleColor,
          descriptionColor: stylePreset.descriptionColor,
          backgroundColor: stylePreset.backgroundColor,
          borderColor: stylePreset.borderColor,
          cardType: stylePreset.cardType || section.cardType,
          
          // Обновляем свойства карточек внутри секции
          cards: (section.cards || []).map(card => ({
            ...card,
            titleColor: stylePreset.cardTitleColor || stylePreset.titleColor,
            contentColor: stylePreset.cardContentColor || stylePreset.descriptionColor,
            backgroundColor: stylePreset.cardBackgroundColor || '#ffffff',
            borderColor: stylePreset.cardBorderColor || stylePreset.borderColor,
            backgroundType: stylePreset.cardBackgroundType || 'solid',
            gradientColor1: stylePreset.cardGradientColor1,
            gradientColor2: stylePreset.cardGradientColor2,
            gradientDirection: stylePreset.cardGradientDirection || 'to bottom',
            style: {
              ...card.style,
              shadow: stylePreset.style?.shadow || '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: stylePreset.style?.borderRadius || '8px'
            }
          }))
        };
      });
      
      // Применяем все изменения за один раз
      onSectionsChange(updatedSections);
    }

    // Применяем соответствующий стиль к контактной форме
    if (onContactChange && contactData) {
      // Пытаемся найти подходящий стиль контактов
      let matchingContactStyle = null;
      
      // Ищем стиль контактов с тем же названием
      if (contactPresets[styleName]) {
        matchingContactStyle = contactPresets[styleName];
      } else {
        // Или находим стиль, который лучше всего соответствует цветовой схеме
        const matchingStyles = Object.entries(contactPresets).filter(([key, preset]) => {
          return (
            preset.titleColor === stylePreset.titleColor ||
            preset.formBackgroundColor === stylePreset.backgroundColor ||
            preset.buttonColor === stylePreset.titleColor
          );
        });
        
        if (matchingStyles.length > 0) {
          // Берем первый подходящий стиль
          matchingContactStyle = matchingStyles[0][1];
        } else {
          // Создаем новый стиль на основе основного стиля
          matchingContactStyle = {
            // 🎨 ФОНОВЫЕ НАСТРОЙКИ для fallback стиля
            showBackground: true,
            backgroundType: 'solid',
            backgroundColor: stylePreset.backgroundColor || '#f8f9fa',
            gradientColor1: stylePreset.backgroundColor || '#ffffff',
            gradientColor2: stylePreset.cardBackgroundColor || '#f5f5f5',
            gradientDirection: 'to bottom',
            // Остальные настройки
            titleColor: stylePreset.titleColor,
            descriptionColor: stylePreset.descriptionColor,
            companyInfoColor: stylePreset.titleColor,
            formVariant: 'outlined',
            infoVariant: 'elevation',
            formBackgroundColor: stylePreset.backgroundColor || '#ffffff',
            infoBackgroundColor: stylePreset.cardBackgroundColor || '#f5f5f5',
            formBorderColor: stylePreset.borderColor,
            infoBorderColor: stylePreset.borderColor,
            labelColor: stylePreset.titleColor,
            inputBackgroundColor: stylePreset.cardBackgroundColor || '#ffffff',
            inputTextColor: stylePreset.cardContentColor || '#333333',
            buttonColor: stylePreset.titleColor,
            buttonTextColor: '#ffffff',
            iconColor: stylePreset.titleColor,
            infoTitleColor: stylePreset.titleColor,
            infoTextColor: stylePreset.descriptionColor
          };
        }
      }
      
      // Применяем найденный или созданный стиль
      console.log('Применяем стиль к разделу контактов:', matchingContactStyle.name || 'базовый стиль');
      
      onContactChange({
        ...contactData,
        // 🎨 ФОНОВЫЕ НАСТРОЙКИ - ВАЖНО ДОБАВИТЬ И ЗДЕСЬ!
        showBackground: matchingContactStyle.showBackground,
        backgroundType: matchingContactStyle.backgroundType,
        backgroundColor: matchingContactStyle.backgroundColor,
        gradientColor1: matchingContactStyle.gradientColor1,
        gradientColor2: matchingContactStyle.gradientColor2,
        gradientDirection: matchingContactStyle.gradientDirection,
        // Остальные настройки
        titleColor: matchingContactStyle.titleColor,
        descriptionColor: matchingContactStyle.descriptionColor,
        companyInfoColor: matchingContactStyle.companyInfoColor,
        formVariant: matchingContactStyle.formVariant,
        infoVariant: matchingContactStyle.infoVariant,
        formBackgroundColor: matchingContactStyle.formBackgroundColor,
        infoBackgroundColor: matchingContactStyle.infoBackgroundColor,
        formBorderColor: matchingContactStyle.formBorderColor,
        infoBorderColor: matchingContactStyle.infoBorderColor,
        labelColor: matchingContactStyle.labelColor,
        inputBackgroundColor: matchingContactStyle.inputBackgroundColor,
        inputTextColor: matchingContactStyle.inputTextColor,
        buttonColor: matchingContactStyle.buttonColor,
        buttonTextColor: matchingContactStyle.buttonTextColor,
        iconColor: matchingContactStyle.iconColor,
        infoTitleColor: matchingContactStyle.infoTitleColor,
        infoTextColor: matchingContactStyle.infoTextColor
      });
    }
  };

  // Модифицируем функцию для применения случайного стиля
  const applyRandomStyle = () => {
    // Получаем все доступные стили из STYLE_PRESETS
    const styleNames = Object.keys(STYLE_PRESETS);
    // Получаем доступные стили шапки
    const headerStyleKeys = Object.keys(headerPresets);
    
    if (singleStyleMode) {
      // Применяем один и тот же стиль ко всем разделам
      const randomStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const randomStylePreset = STYLE_PRESETS[randomStyleName];
      
      // Выбираем случайный стиль шапки
      const randomHeaderIndex = Math.floor(Math.random() * headerStyleKeys.length);
      const selectedHeaderStyle = headerStyleKeys[randomHeaderIndex];
      const headerPreset = headerPresets[selectedHeaderStyle];
      
      console.log(`Применяем один случайный стиль ко всем разделам: ${randomStyleName}`);
      console.log(`И случайный стиль шапки: ${selectedHeaderStyle}`);
      
      // ВАЖНО: Применяем headerPreset даже в режиме единого стиля
      handleApplyWholeWebsiteStyle(randomStyleName, randomStylePreset, null, headerPreset);
    } else {
      // Применяем разные случайные стили к каждому разделу
      console.log('Применяем разные случайные стили к каждому разделу');
      
      // Выбираем случайный стиль шапки
      const randomHeaderIndex = Math.floor(Math.random() * headerStyleKeys.length);
      const selectedHeaderStyle = headerStyleKeys[randomHeaderIndex];
      const headerPreset = headerPresets[selectedHeaderStyle];
      
      // Применяем случайный стиль к шапке
      if (onHeaderChange && headerData) {
        console.log(`Применяем случайный стиль шапки: ${selectedHeaderStyle}`);
        onHeaderChange({
          ...headerData,
          titleColor: headerPreset.titleColor,
          backgroundColor: headerPreset.backgroundColor,
          linksColor: headerPreset.linksColor,
          siteBackgroundType: headerPreset.siteBackgroundType || 'solid',
          ...((!headerPreset.siteBackgroundType || headerPreset.siteBackgroundType === 'solid') && {
            siteBackgroundColor: headerPreset.siteBackgroundColor || headerPreset.backgroundColor || '#ffffff'
          }),
          ...(headerPreset.siteBackgroundType === 'gradient' && {
            siteGradientColor1: headerPreset.siteGradientColor1 || headerPreset.backgroundColor || '#ffffff',
            siteGradientColor2: headerPreset.siteGradientColor2 || headerPreset.cardBackgroundColor || '#f5f5f5',
            siteGradientDirection: headerPreset.siteGradientDirection || 'to bottom'
          })
        });
        
        // Применяем согласованные цвета к hero секции
        if (onHeroChange && heroData) {
          onHeroChange({
            ...heroData,
            titleColor: headerPreset.titleColor, // Используем цвет заголовка шапки
            subtitleColor: headerPreset.linksColor, // Используем цвет ссылок шапки для подзаголовка
            descriptionColor: headerPreset.linksColor, // Используем цвет ссылок шапки
            backgroundColor: headerPreset.backgroundColor,
            borderColor: headerPreset.borderColor || '#e0e0e0',
          });
        }
      }
      
      // Применяем случайные стили к каждой секции
      if (onSectionsChange && sectionsData) {
        const updatedSections = {};
        
        Object.keys(sectionsData).forEach(sectionId => {
          const section = sectionsData[sectionId];
          const sectionStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
          const sectionStylePreset = STYLE_PRESETS[sectionStyleName];
          
          updatedSections[sectionId] = {
            ...section,
            titleColor: sectionStylePreset.titleColor,
            descriptionColor: sectionStylePreset.descriptionColor,
            backgroundColor: sectionStylePreset.backgroundColor,
            borderColor: sectionStylePreset.borderColor,
            cardType: sectionStylePreset.cardType || section.cardType,
            
            cards: (section.cards || []).map(card => ({
              ...card,
              titleColor: sectionStylePreset.cardTitleColor,
              contentColor: sectionStylePreset.cardContentColor,
              backgroundColor: sectionStylePreset.cardBackgroundColor,
              borderColor: sectionStylePreset.cardBorderColor,
              backgroundType: sectionStylePreset.cardBackgroundType,
              gradientColor1: sectionStylePreset.cardGradientColor1,
              gradientColor2: sectionStylePreset.cardGradientColor2,
              gradientDirection: sectionStylePreset.cardGradientDirection,
              style: {
                ...card.style,
                shadow: sectionStylePreset.style?.shadow || '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: sectionStylePreset.style?.borderRadius || '8px'
              }
            }))
          };
        });
        
        onSectionsChange(updatedSections);
      }
      
      // Применяем случайный стиль к контактам
      const contactStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const contactStylePreset = STYLE_PRESETS[contactStyleName];
      
      if (onContactChange && contactData) {
        // Выбираем случайный стиль из contactPresets
        const contactPresetKeys = Object.keys(contactPresets);
        const randomContactPreset = contactPresets[contactPresetKeys[Math.floor(Math.random() * contactPresetKeys.length)]];
        
        console.log('🎨 APPLYING RANDOM CONTACT PRESET:', randomContactPreset.name);
        console.log('🎨 BACKGROUND SETTINGS:', {
          showBackground: randomContactPreset.showBackground,
          backgroundType: randomContactPreset.backgroundType,
          backgroundColor: randomContactPreset.backgroundColor,
          gradientColor1: randomContactPreset.gradientColor1,
          gradientColor2: randomContactPreset.gradientColor2,
          gradientDirection: randomContactPreset.gradientDirection
        });
        
        onContactChange({
          ...contactData,
          // 🎨 ФОНОВЫЕ НАСТРОЙКИ - САМОЕ ВАЖНОЕ!
          showBackground: randomContactPreset.showBackground,
          backgroundType: randomContactPreset.backgroundType,
          backgroundColor: randomContactPreset.backgroundColor,
          gradientColor1: randomContactPreset.gradientColor1,
          gradientColor2: randomContactPreset.gradientColor2,
          gradientDirection: randomContactPreset.gradientDirection,
          // Остальные настройки
          titleColor: randomContactPreset.titleColor,
          descriptionColor: randomContactPreset.descriptionColor,
          companyInfoColor: randomContactPreset.companyInfoColor,
          formVariant: randomContactPreset.formVariant,
          infoVariant: randomContactPreset.infoVariant,
          formBackgroundColor: randomContactPreset.formBackgroundColor,
          infoBackgroundColor: randomContactPreset.infoBackgroundColor,
          formBorderColor: randomContactPreset.formBorderColor,
          infoBorderColor: randomContactPreset.infoBorderColor,
          labelColor: randomContactPreset.labelColor,
          inputBackgroundColor: randomContactPreset.inputBackgroundColor,
          inputTextColor: randomContactPreset.inputTextColor,
          buttonColor: randomContactPreset.buttonColor,
          buttonTextColor: randomContactPreset.buttonTextColor,
          iconColor: randomContactPreset.iconColor,
          infoTitleColor: randomContactPreset.infoTitleColor,
          infoTextColor: randomContactPreset.infoTextColor
        });
      }
    }
  };

  // Функция для получения информации о выбранной стране
  const getSelectedCountryInfo = () => {
    let selectedCountry = '';
    let addressFormat = '';
    let countryCode = '';
    
    if (globalSettings.country === 'CUSTOM' && globalSettings.customCountry) {
      selectedCountry = globalSettings.customCountry;
      addressFormat = `полный адрес согласно местным стандартам адресации страны ${selectedCountry}`;
      countryCode = selectedCountry;
    } else if (globalSettings.country) {
      const countryObj = COUNTRIES.find(country => country.code === globalSettings.country);
      if (countryObj) {
        selectedCountry = countryObj.label;
        countryCode = countryObj.code;
        
        // Определяем формат адреса для конкретной страны
        switch (countryObj.code) {
          case 'RU':
            addressFormat = 'город, улица, дом, индекс, Россия (например: "Москва, ул. Большая Семёновская, д. 40, 107023, Россия")';
            break;
          case 'US':
            addressFormat = 'улица, город, штат, zip, USA (например: "2500 N Forest Rd, Getzville, NY 14068, USA")';
            break;
          case 'DE':
            addressFormat = 'улица, почтовый код, город, Deutschland (например: "Mehringdamm 33, 10961 Berlin, Deutschland")';
            break;
          case 'FR':
            addressFormat = 'улица, почтовый код, город, France (например: "123 Avenue de Flandre, 75019 Paris, France")';
            break;
          case 'GB':
            addressFormat = 'номер дома, улица, город, почтовый код, United Kingdom (например: "45 Deansgate, Manchester M3 2AY, United Kingdom")';
            break;
          case 'CA':
            addressFormat = 'улица, город, провинция, почтовый код, Canada (например: "1055 W Georgia St, Vancouver, BC V6E 3P3, Canada")';
            break;
          case 'AU':
            addressFormat = 'улица, пригород, штат, почтовый код, Australia (например: "200 Queen St, Melbourne VIC 3000, Australia")';
            break;
          case 'ES':
            addressFormat = 'улица, номер, город, почтовый код, España (например: "Carrer de Balmes 145, Barcelona 08008, España")';
            break;
          case 'IT':
            addressFormat = 'улица, номер, город, почтовый код, Italia (например: "Via Torino 61, Milano 20123, Italia")';
            break;
          case 'JP':
            addressFormat = 'префектура, город, район, улица, номер, Japan (например: "Tokyo, Shibuya, 1-1-1 Shibuya, Japan")';
            break;
          case 'CN':
            addressFormat = 'провинция, город, район, улица, номер, China (например: "Beijing, Chaoyang District, Jianguomenwai Street 1, China")';
            break;
          case 'BR':
            addressFormat = 'улица, номер, район, город, CEP, Brasil (например: "Rua Augusta 123, Consolação, São Paulo, 01305-100, Brasil")';
            break;
          case 'MX':
            addressFormat = 'улица, номер, колония, город, почтовый код, México (например: "Reforma 123, Zona Centro, Mexico City, 06000, México")';
            break;
          case 'IN':
            addressFormat = 'улица, номер, район, город, штат, пинкод, India (например: "MG Road 123, Connaught Place, New Delhi, Delhi, 110001, India")';
            break;
          case 'KR':
            addressFormat = 'провинция, город, район, улица, номер, South Korea (например: "Seoul, Gangnam-gu, Teheran-ro 123, South Korea")';
            break;
          case 'PL':
            addressFormat = 'улица, номер, почтовый код, город, Polska (например: "Marszałkowska 123, 00-001 Warszawa, Polska")';
            break;
          case 'UA':
            addressFormat = 'улица, номер, город, почтовый код, Україна (например: "Хрещатик 123, Київ, 01001, Україна")';
            break;
          case 'NL':
            addressFormat = 'улица, номер, почтовый код, город, Nederland (например: "Damrak 123, 1012 LP Amsterdam, Nederland")';
            break;
          case 'SE':
            addressFormat = 'улица, номер, почтовый код, город, Sverige (например: "Drottninggatan 123, 111 51 Stockholm, Sverige")';
            break;
          case 'NO':
            addressFormat = 'улица, номер, почтовый код, город, Norge (например: "Karl Johans gate 123, 0162 Oslo, Norge")';
            break;
          case 'FI':
            addressFormat = 'улица, номер, почтовый код, город, Suomi (например: "Mannerheimintie 123, 00100 Helsinki, Suomi")';
            break;
          case 'DK':
            addressFormat = 'улица, номер, почтовый код, город, Danmark (например: "Strøget 123, 1200 København, Danmark")';
            break;
          case 'CH':
            addressFormat = 'улица, номер, почтовый код, город, Schweiz (например: "Bahnhofstrasse 123, 8001 Zürich, Schweiz")';
            break;
          case 'AT':
            addressFormat = 'улица, номер, почтовый код, город, Österreich (например: "Mariahilfer Straße 123, 1060 Wien, Österreich")';
            break;
          case 'BE':
            addressFormat = 'улица, номер, почтовый код, город, België (например: "Rue de la Loi 123, 1000 Bruxelles, België")';
            break;
          case 'CZ':
            addressFormat = 'улица, номер, почтовый код, город, Česká republika (например: "Václavské náměstí 123, 110 00 Praha, Česká republika")';
            break;
          case 'HU':
            addressFormat = 'город, улица, номер, почтовый код, Magyarország (например: "Budapest, Váci utca 123, 1052, Magyarország")';
            break;
          case 'PT':
            addressFormat = 'улица, номер, почтовый код, город, Portugal (например: "Rua Augusta 123, 1100-048 Lisboa, Portugal")';
            break;
          case 'GR':
            addressFormat = 'улица, номер, почтовый код, город, Ελλάδα (например: "Ermou 123, 105 63 Athens, Ελλάδα")';
            break;
          case 'TR':
            addressFormat = 'улица, номер, район, город, почтовый код, Türkiye (например: "İstiklal Caddesi 123, Beyoğlu, Istanbul, 34433, Türkiye")';
            break;
          case 'IL':
            addressFormat = 'улица, номер, город, почтовый код, ישראל (например: "Rothschild Boulevard 123, Tel Aviv, 6688101, ישראל")';
            break;
          case 'AE':
            addressFormat = 'улица, номер, район, город, UAE (например: "Sheikh Zayed Road 123, Downtown Dubai, Dubai, UAE")';
            break;
          case 'SA':
            addressFormat = 'улица, номер, район, город, почтовый код, Saudi Arabia (например: "King Fahd Road 123, Al Olaya, Riyadh, 11564, Saudi Arabia")';
            break;
          case 'EG':
            addressFormat = 'улица, номер, район, город, Egypt (например: "Tahrir Square 123, Downtown Cairo, Cairo, Egypt")';
            break;
          case 'ZA':
            addressFormat = 'улица, номер, пригород, город, почтовый код, South Africa (например: "Long Street 123, Cape Town City Centre, Cape Town, 8001, South Africa")';
            break;
          case 'NG':
            addressFormat = 'улица, номер, район, город, штат, Nigeria (например: "Victoria Island 123, Lagos Island, Lagos, Lagos State, Nigeria")';
            break;
          case 'TH':
            addressFormat = 'улица, номер, район, город, почтовый код, Thailand (например: "Sukhumvit Road 123, Khlong Toei, Bangkok, 10110, Thailand")';
            break;
          case 'VN':
            addressFormat = 'улица, номер, район, город, Vietnam (например: "Nguyen Hue Street 123, District 1, Ho Chi Minh City, Vietnam")';
            break;
          case 'PH':
            addressFormat = 'улица, номер, баранггай, город, почтовый код, Philippines (например: "Ayala Avenue 123, Makati, Metro Manila, 1226, Philippines")';
            break;
          case 'SG':
            addressFormat = 'улица, номер, почтовый код, Singapore (например: "Orchard Road 123, Singapore 238858")';
            break;
          case 'MY':
            addressFormat = 'улица, номер, район, город, штат, почтовый код, Malaysia (например: "Jalan Bukit Bintang 123, Bukit Bintang, Kuala Lumpur, Selangor, 55100, Malaysia")';
            break;
          case 'ID':
            addressFormat = 'улица, номер, район, город, почтовый код, Indonesia (например: "Jalan Thamrin 123, Menteng, Jakarta, 10350, Indonesia")';
            break;
          case 'AR':
            addressFormat = 'улица, номер, район, город, почтовый код, Argentina (например: "Avenida 9 de Julio 123, San Nicolás, Buenos Aires, C1043AAA, Argentina")';
            break;
          case 'CL':
            addressFormat = 'улица, номер, коммуна, город, почтовый код, Chile (например: "Avenida Providencia 123, Providencia, Santiago, 7500000, Chile")';
            break;
          case 'CO':
            addressFormat = 'улица, номер, район, город, почтовый код, Colombia (например: "Carrera 7 123, La Candelaria, Bogotá, 111711, Colombia")';
            break;
          case 'PE':
            addressFormat = 'улица, номер, район, город, почтовый код, Perú (например: "Avenida Arequipa 123, Miraflores, Lima, 15074, Perú")';
            break;
          case 'VE':
            addressFormat = 'улица, номер, район, город, штат, почтовый код, Venezuela (например: "Avenida Bolívar 123, Centro, Caracas, Distrito Capital, 1010, Venezuela")';
            break;
          case 'UY':
            addressFormat = 'улица, номер, район, город, почтовый код, Uruguay (например: "18 de Julio 123, Centro, Montevideo, 11100, Uruguay")';
            break;
          case 'PY':
            addressFormat = 'улица, номер, район, город, почтовый код, Paraguay (например: "Palma 123, Centro, Asunción, 1209, Paraguay")';
            break;
          case 'BO':
            addressFormat = 'улица, номер, район, город, почтовый код, Bolivia (например: "Avenida 16 de Julio 123, Centro, La Paz, 0000, Bolivia")';
            break;
          case 'EC':
            addressFormat = 'улица, номер, район, город, почтовый код, Ecuador (например: "Avenida Amazonas 123, Centro, Quito, 170401, Ecuador")';
            break;
          case 'CU':
            addressFormat = 'улица, номер, район, город, почтовый код, Cuba (например: "Calle 23 123, Vedado, Havana, 10400, Cuba")';
            break;
          case 'DO':
            addressFormat = 'улица, номер, сектор, город, почтовый код, República Dominicana (например: "Avenida 27 de Febrero 123, Naco, Santo Domingo, 10125, República Dominicana")';
            break;
          case 'GT':
            addressFormat = 'улица, номер, зона, город, почтовый код, Guatemala (например: "6a Avenida 123, Zona 1, Guatemala City, 01001, Guatemala")';
            break;
          case 'HN':
            addressFormat = 'улица, номер, колония, город, почтовый код, Honduras (например: "Avenida Juan Pablo II 123, Colonia Palmira, Tegucigalpa, 11101, Honduras")';
            break;
          case 'NI':
            addressFormat = 'улица, номер, район, город, почтовый код, Nicaragua (например: "Avenida Bolívar 123, Centro, Managua, 14034, Nicaragua")';
            break;
          case 'CR':
            addressFormat = 'улица, номер, район, город, провинция, почтовый код, Costa Rica (например: "Avenida Central 123, Centro, San José, San José, 10101, Costa Rica")';
            break;
          case 'PA':
            addressFormat = 'улица, номер, район, город, почтовый код, Panamá (например: "Vía España 123, El Cangrejo, Panama City, 0816, Panamá")';
            break;
          case 'SV':
            addressFormat = 'улица, номер, колония, город, почтовый код, El Salvador (например: "Avenida Roosevelt 123, Colonia Escalón, San Salvador, 1101, El Salvador")';
            break;
          case 'BZ':
            addressFormat = 'улица, номер, район, город, почтовый код, Belize (например: "Albert Street 123, Fort George, Belize City, 00000, Belize")';
            break;
          case 'JM':
            addressFormat = 'улица, номер, район, город, почтовый код, Jamaica (например: "Half Way Tree Road 123, St. Andrew, Kingston, 10, Jamaica")';
            break;
          case 'TT':
            addressFormat = 'улица, номер, район, город, почтовый код, Trinidad and Tobago (например: "Independence Square 123, Port of Spain, Trinidad and Tobago")';
            break;
          case 'BB':
            addressFormat = 'улица, номер, приход, почтовый код, Barbados (например: "Broad Street 123, St. Michael, BB11000, Barbados")';
            break;
          case 'GD':
            addressFormat = 'улица, номер, район, город, почтовый код, Grenada (например: "Young Street 123, St. George, Grenada")';
            break;
          case 'LC':
            addressFormat = 'улица, номер, район, город, почтовый код, Saint Lucia (например: "Bridge Street 123, Castries, Saint Lucia")';
            break;
          case 'VC':
            addressFormat = 'улица, номер, район, город, почтовый код, Saint Vincent and the Grenadines (например: "Bay Street 123, Kingstown, Saint Vincent and the Grenadines")';
            break;
          case 'AG':
            addressFormat = 'улица, номер, район, город, почтовый код, Antigua and Barbuda (например: "High Street 123, St. John, Antigua and Barbuda")';
            break;
          case 'DM':
            addressFormat = 'улица, номер, район, город, почтовый код, Dominica (например: "Great George Street 123, Roseau, Dominica")';
            break;
          case 'KN':
            addressFormat = 'улица, номер, район, город, почтовый код, Saint Kitts and Nevis (например: "Fort Street 123, Basseterre, Saint Kitts and Nevis")';
            break;
          case 'BS':
            addressFormat = 'улица, номер, район, город, почтовый код, Bahamas (например: "Bay Street 123, Nassau, Bahamas")';
            break;
          case 'NZ':
            addressFormat = 'улица, номер, пригород, город, почтовый код, New Zealand (например: "Queen Street 123, Auckland Central, Auckland, 1010, New Zealand")';
            break;
          case 'FJ':
            addressFormat = 'улица, номер, район, город, почтовый код, Fiji (например: "Victoria Parade 123, Suva, Fiji")';
            break;
          case 'PG':
            addressFormat = 'улица, номер, район, город, почтовый код, Papua New Guinea (например: "Douglas Street 123, Port Moresby, Papua New Guinea")';
            break;
          case 'SB':
            addressFormat = 'улица, номер, район, город, почтовый код, Solomon Islands (например: "Mendana Avenue 123, Honiara, Solomon Islands")';
            break;
          case 'VU':
            addressFormat = 'улица, номер, район, город, почтовый код, Vanuatu (например: "Lini Highway 123, Port Vila, Vanuatu")';
            break;
          case 'NC':
            addressFormat = 'улица, номер, район, город, почтовый код, Nouvelle-Calédonie (например: "Rue de Sébastopol 123, Nouméa, 98800, Nouvelle-Calédonie")';
            break;
          case 'PF':
            addressFormat = 'улица, номер, район, город, почтовый код, Polynésie française (например: "Boulevard Pomare 123, Papeete, 98714, Polynésie française")';
            break;
          case 'TO':
            addressFormat = 'улица, номер, район, город, почтовый код, Tonga (например: "Taufa\'ahau Road 123, Nuku\'alofa, Tonga")';
            break;
          case 'WS':
            addressFormat = 'улица, номер, район, город, почтовый код, Samoa (например: "Beach Road 123, Apia, Samoa")';
            break;
          case 'KI':
            addressFormat = 'улица, номер, район, город, почтовый код, Kiribati (например: "Bairiki Street 123, Tarawa, Kiribati")';
            break;
          case 'TV':
            addressFormat = 'улица, номер, район, город, почтовый код, Tuvalu (например: "Government Road 123, Funafuti, Tuvalu")';
            break;
          case 'NR':
            addressFormat = 'улица, номер, район, город, почтовый код, Nauru (например: "Government Road 123, Yaren, Nauru")';
            break;
          case 'PW':
            addressFormat = 'улица, номер, район, город, почтовый код, Palau (например: "Capitol Hill Road 123, Ngerulmud, Palau")';
            break;
          case 'FM':
            addressFormat = 'улица, номер, район, город, почтовый код, Micronesia (например: "Kaselehlie Street 123, Palikir, Micronesia")';
            break;
          case 'MH':
            addressFormat = 'улица, номер, район, город, почтовый код, Marshall Islands (например: "Lagoon Road 123, Majuro, Marshall Islands")';
            break;
          default:
            addressFormat = `полный адрес согласно местным стандартам адресации страны ${selectedCountry}, ОБЯЗАТЕЛЬНО включая название страны в конце адреса`;
            break;
        }
      } else {
        selectedCountry = 'не выбрана';
        addressFormat = 'полный адрес согласно местным стандартам адресации с указанием страны';
        countryCode = '';
      }
    } else {
      selectedCountry = 'не выбрана';
      addressFormat = 'полный адрес согласно местным стандартам адресации с указанием страны';
      countryCode = '';
    }
    
    return { selectedCountry, addressFormat, countryCode };
  };



  return (
    <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />} 
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Typography variant="h6" sx={{ color: '#e53935' }}>
          AI Парсер контента
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Paper sx={{ boxShadow: 'none' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>  
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {/* Скрываем кнопку "НАСТРОЙКИ ПАРСЕРА", но сохраняем функционал */}
              {false && (
                <Button
                  variant="outlined"
                  onClick={() => setShowSettings(true)}
                  sx={{
                    color: '#0288d1',
                    borderColor: '#0288d1',
                    '&:hover': {
                      borderColor: '#0277bd',
                      backgroundColor: 'rgba(2, 136, 209, 0.04)'
                    },
                    textTransform: 'none',
                    fontSize: '0.9rem'
                  }}
                  startIcon={
                    <Box sx={{ color: '#0288d1', display: 'flex', alignItems: 'center' }}>
                      <SettingsIcon />
                    </Box>
                  }
                >
                  НАСТРОЙКИ ПАРСЕРА
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => setShowGlobalSettings(true)}
                sx={{
                  color: '#e91e63',
                  borderColor: '#e91e63',
                  '&:hover': {
                    borderColor: '#d81b60',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)'
                  },
                  textTransform: 'none',
                  fontSize: '0.9rem'
                }}
                startIcon={
                  <Box sx={{ color: '#e91e63', display: 'flex', alignItems: 'center' }}>
                    <TuneIcon />
                  </Box>
                }
              >
                НАСТРОЙКИ КОНТЕНТА
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setShowStyleManager(true)}
                sx={{
                  color: '#4caf50',
                  borderColor: '#4caf50',
                  '&:hover': {
                    borderColor: '#43a047',
                    backgroundColor: 'rgba(76, 175, 80, 0.04)'
                  },
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  mr: 1
                }}
                startIcon={
                  <Box sx={{ color: '#4caf50', display: 'flex', alignItems: 'center' }}>
                    <StyleIcon />
                  </Box>
                }
              >
                СТИЛИ САЙТА
              </Button>
              
              <Tooltip title="Применить случайный стиль ко всему сайту" placement="top">
                <IconButton 
                  onClick={applyRandomStyle}
                  size="small"
                  sx={{
                    color: '#4caf50',
                    border: '1px solid #4caf50',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    },
                    width: 34,
                    height: 34
                  }}
                >
                  <ShuffleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mr: 0.5, 
                    fontSize: '0.7rem', 
                    color: singleStyleMode ? '#bdbdbd' : '#4caf50',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={applyRandomStyle}
                >
                  ALL
                </Typography>
                <Switch
                  checked={singleStyleMode}
                  onChange={(e) => setSingleStyleMode(e.target.checked)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4caf50',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.08)'
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4caf50'
                    }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 0.5, 
                    fontSize: '0.7rem', 
                    color: singleStyleMode ? '#4caf50' : '#bdbdbd',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={applyRandomStyle}
                >
                  1
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Добавляем компонент глобальных настроек с новой функцией */}
          <GlobalSettings
            open={showGlobalSettings}
            onClose={() => setShowGlobalSettings(false)}
            settings={globalSettings}
            onSettingsChange={handleGlobalSettingsChange}
          />
          
          {/* Добавляем компонент настроек промпта полного сайта */}
          <FullSitePromptSettings
            open={showFullSiteSettings}
            onClose={() => setShowFullSiteSettings(false)}
            onSave={handleFullSiteSettingsSave}
            onCopyOnly={handleCopyPromptOnly}
            initialSettings={fullSiteSettings}
            isGenerating={isGeneratingAI}
            generationProgress={aiGenerationProgress}
          />
            
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="section-select-label">Выберите раздел для заполнения</InputLabel>
              <Select
                labelId="section-select-label"
                value={targetSection}
                label="Выберите раздел для заполнения"
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <MenuItem value="FULL_SITE">Полный сайт</MenuItem>
                <MenuItem value="HERO">Hero секция</MenuItem>
                <MenuItem value="ABOUT">О нас</MenuItem>
                <MenuItem value="FEATURES">Преимущества</MenuItem>
                <MenuItem value="SERVICES">Услуги</MenuItem>
                <MenuItem value="TESTIMONIALS">Отзывы</MenuItem>
                <MenuItem value="FAQ">Вопросы и ответы</MenuItem>
                <MenuItem value="NEWS">Новости</MenuItem>
                <MenuItem value="CONTACTS">Свяжитесь с нами</MenuItem>
                <MenuItem value="MERCI">Сообщение благодарности</MenuItem>
                <MenuItem value="LEGAL">Правовые документы</MenuItem>
              </Select>
            </FormControl>
              
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              '& .MuiButton-root': {
                minWidth: '120px',
                height: '32px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.8125rem',
                padding: '4px 12px',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  transform: 'translateY(-1px)'
                }
              }
            }}>
              <Tooltip title={targetSection === 'FULL_SITE' ? "Настроить и скопировать промпт" : "Скопировать шаблон промпта"} arrow placement="top">
                <span>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={copyPromptToClipboard}
                    startIcon={<ContentCopyIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={!targetSection || targetSection === 'AUTO'}
                    sx={{
                      borderWidth: '1px',
                      '&:hover': {
                        borderWidth: '1px'
                      }
                    }}
                  >
                    {targetSection === 'FULL_SITE' ? 'Настроить' : 'Копировать'}
                </Button>
                </span>
              </Tooltip>
              <Tooltip title="Настроить шаблон промпта" arrow placement="top">
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenPromptEditor(targetSection)}
                    startIcon={<EditIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={!targetSection || targetSection === 'AUTO'}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                      }
                    }}
                  >
                    Изменить
                  </Button>
                </span>
              </Tooltip>

              </Box>
              
              <TextField
                multiline
                rows={10}
                fullWidth
              value={content}
                onChange={handleTextChange}
                onPaste={handleTextPaste}
                inputRef={textareaRef}
              placeholder="Вставьте сюда текст от AI для обработки..."
              />
              
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleParse}
                disabled={!content.trim()}
                >
                  Обработать и заполнить
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleClearText}
                >
                  Очистить
                </Button>
              </Box>
              
              {parserMessage && (
              <Alert severity="info" sx={{ mt: 2 }}>
                  {parserMessage}
                </Alert>
              )}
              
              {result && (
                <Accordion 
                  sx={{ mt: 2 }} 
                  defaultExpanded={false}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      Данные JSON:
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>
              )}
          </Box>

          {/* Диалог редактирования промпта */}
          <Dialog 
            open={showPromptEditor} 
            onClose={() => setShowPromptEditor(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Редактирование промпта для раздела {editingPromptType}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={20}
                value={editingPromptText}
                onChange={(e) => setEditingPromptText(e.target.value)}
                margin="dense"
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPromptEditor(false)}>Отмена</Button>
              <Button onClick={handleSavePrompt} variant="contained" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>

          {/* Диалог настроек */}
          <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
            <DialogTitle>Настройки парсера</DialogTitle>
            <DialogContent>
              <TextField
                label="Разделитель между элементами"
                fullWidth
                margin="dense"
                value={customDelimiter}
                onChange={(e) => setCustomDelimiter(e.target.value)}
                placeholder="\n\n"
                helperText="По умолчанию: двойной перенос строки"
              />
              
              <TextField
                label="Разделитель между заголовком и содержимым"
                fullWidth
                margin="dense"
                value={customTitleContentDelimiter}
                onChange={(e) => setCustomTitleContentDelimiter(e.target.value)}
                placeholder="\n"
                helperText="По умолчанию: одинарный перенос строки"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSettings(false)}>Закрыть</Button>
            </DialogActions>
          </Dialog>

          {/* Компонент управления стилями */}
          <SiteStyleManager 
            open={showStyleManager}
            onClose={() => setShowStyleManager(false)}
            headerData={headerData}
            sectionsData={sectionsData}
            heroData={heroData}
            contactData={contactData}
            footerData={{}}
            onApplyToWholeWebsite={handleApplyWholeWebsiteStyle}
            onHeaderChange={onHeaderChange}
            onSectionsChange={onSectionsChange}
            onHeroChange={onHeroChange}
            onContactChange={onContactChange}
          />
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default AiParser; 