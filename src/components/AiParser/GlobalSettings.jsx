import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

// Предустановленные тематики сайтов
export const WEBSITE_THEMES = {
  LAW: 'Юридическая компания',
  MEDICAL: 'Медицинская клиника',
  CONSTRUCTION: 'Строительная компания',
  EDUCATION: 'Образовательный центр',
  REAL_ESTATE: 'Агентство недвижимости',
  RESTAURANT: 'Ресторан/Кафе',
  BEAUTY: 'Салон красоты',
  AUTO: 'Автосервис',
  RETAIL: 'Магазин/Торговля',
  TELECOM_UAE: 'Телеком-оператор в ОАЭ',
  CUSTOM: 'Другое'
};

// Доступные языки с русскими названиями для поиска
export const LANGUAGES = [
  { code: 'RU', label: 'Русский (ru)', searchTerms: 'русский ru russia' },
  { code: 'EN', label: 'Английский - English (en)', searchTerms: 'английский english en usa uk' },
  { code: 'ES', label: 'Испанский - Español (es)', searchTerms: 'испанский spanish es spain' },
  { code: 'FR', label: 'Французский - Français (fr)', searchTerms: 'французский french fr france' },
  { code: 'DE', label: 'Немецкий - Deutsch (de)', searchTerms: 'немецкий german de germany' },
  { code: 'IT', label: 'Итальянский - Italiano (it)', searchTerms: 'итальянский italian it italy' },
  { code: 'PT', label: 'Португальский - Português (pt)', searchTerms: 'португальский portuguese pt portugal brazil' },
  { code: 'NL', label: 'Нидерландский - Nederlands (nl)', searchTerms: 'нидерландский dutch nl netherlands' },
  { code: 'PL', label: 'Польский - Polski (pl)', searchTerms: 'польский polish pl poland' },
  { code: 'AR', label: 'Арабский - العربية (ar)', searchTerms: 'арабский arabic ar saudi arabia' },
  { code: 'ZH', label: 'Китайский - 中文 (zh)', searchTerms: 'китайский chinese zh china' },
  { code: 'JA', label: 'Японский - 日本語 (ja)', searchTerms: 'японский japanese ja japan' },
  { code: 'KO', label: 'Корейский - 한국어 (ko)', searchTerms: 'корейский korean ko korea' },
  { code: 'TR', label: 'Турецкий - Türkçe (tr)', searchTerms: 'турецкий turkish tr turkey' },
  { code: 'HE', label: 'Иврит - עברית (he)', searchTerms: 'иврит hebrew he israel' },
  { code: 'HI', label: 'Хинди - हिन्दी (hi)', searchTerms: 'хинди hindi hi india' },
  { code: 'UK', label: 'Украинский - Українська (uk)', searchTerms: 'украинский ukrainian uk ukraine' },
  { code: 'BE', label: 'Белорусский - Беларуская (be)', searchTerms: 'белорусский belarusian be belarus' },
  { code: 'CS', label: 'Чешский - Čeština (cs)', searchTerms: 'чешский czech cs czechia' },
  { code: 'DA', label: 'Датский - Dansk (da)', searchTerms: 'датский danish da denmark' },
  { code: 'FI', label: 'Финский - Suomi (fi)', searchTerms: 'финский finnish fi finland' },
  { code: 'EL', label: 'Греческий - Ελληνικά (el)', searchTerms: 'греческий greek el greece' },
  { code: 'HU', label: 'Венгерский - Magyar (hu)', searchTerms: 'венгерский hungarian hu hungary' },
  { code: 'NO', label: 'Норвежский - Norsk (no)', searchTerms: 'норвежский norwegian no norway' },
  { code: 'RO', label: 'Румынский - Română (ro)', searchTerms: 'румынский romanian ro romania' },
  { code: 'SV', label: 'Шведский - Svenska (sv)', searchTerms: 'шведский swedish sv sweden' },
  { code: 'TH', label: 'Тайский - ไทย (th)', searchTerms: 'тайский thai th thailand' },
  { code: 'VI', label: 'Вьетнамский - Tiếng Việt (vi)', searchTerms: 'вьетнамский vietnamese vi vietnam' },
  { code: 'BG', label: 'Болгарский - Български (bg)', searchTerms: 'болгарский bulgarian bg bulgaria' },
  { code: 'SR', label: 'Сербский - Српски (sr)', searchTerms: 'сербский serbian sr serbia' },
  { code: 'SK', label: 'Словацкий - Slovenčina (sk)', searchTerms: 'словацкий slovak sk slovakia' },
  { code: 'SL', label: 'Словенский - Slovenščina (sl)', searchTerms: 'словенский slovenian sl slovenia' },
  { code: 'CUSTOM', label: 'Другой язык по коду ISO 639-1', searchTerms: 'другой custom iso' }
];

// Список стран для выбора
export const COUNTRIES = [
  // Европа
  { code: 'RU', label: 'Россия', searchTerms: 'россия russia russian' },
  { code: 'DE', label: 'Германия', searchTerms: 'германия germany german немецкий' },
  { code: 'FR', label: 'Франция', searchTerms: 'франция france french французский' },
  { code: 'GB', label: 'Великобритания', searchTerms: 'великобритания england uk британский' },
  { code: 'IT', label: 'Италия', searchTerms: 'италия italy italian итальянский' },
  { code: 'ES', label: 'Испания', searchTerms: 'испания spain spanish испанский' },
  { code: 'PT', label: 'Португалия', searchTerms: 'португалия portugal portuguese португальский' },
  { code: 'NL', label: 'Нидерланды', searchTerms: 'нидерланды netherlands dutch голландский' },
  { code: 'PL', label: 'Польша', searchTerms: 'польша poland polish польский' },
  { code: 'UA', label: 'Украина', searchTerms: 'украина ukraine ukrainian украинский' },
  { code: 'BY', label: 'Беларусь', searchTerms: 'беларусь belarus белорусский' },
  { code: 'CZ', label: 'Чехия', searchTerms: 'чехия czech republic чешский' },
  { code: 'SK', label: 'Словакия', searchTerms: 'словакия slovakia slovak словацкий' },
  { code: 'HU', label: 'Венгрия', searchTerms: 'венгрия hungary hungarian венгерский' },
  { code: 'AT', label: 'Австрия', searchTerms: 'австрия austria austrian австрийский' },
  { code: 'CH', label: 'Швейцария', searchTerms: 'швейцария switzerland swiss швейцарский' },
  { code: 'BE', label: 'Бельгия', searchTerms: 'бельгия belgium belgian бельгийский' },
  { code: 'DK', label: 'Дания', searchTerms: 'дания denmark danish датский' },
  { code: 'SE', label: 'Швеция', searchTerms: 'швеция sweden swedish шведский' },
  { code: 'NO', label: 'Норвегия', searchTerms: 'норвегия norway norwegian норвежский' },
  { code: 'FI', label: 'Финляндия', searchTerms: 'финляндия finland finnish финский' },
  { code: 'EE', label: 'Эстония', searchTerms: 'эстония estonia estonian эстонский' },
  { code: 'LV', label: 'Латвия', searchTerms: 'латвия latvia latvian латвийский' },
  { code: 'LT', label: 'Литва', searchTerms: 'литва lithuania lithuanian литовский' },
  { code: 'BG', label: 'Болгария', searchTerms: 'болгария bulgarian bg bulgaria' },
  { code: 'RO', label: 'Румыния', searchTerms: 'румыния romania romanian румынский' },
  { code: 'GR', label: 'Греция', searchTerms: 'греция greece greek греческий' },
  { code: 'HR', label: 'Хорватия', searchTerms: 'хорватия croatia croatian хорватский' },
  { code: 'RS', label: 'Сербия', searchTerms: 'сербия serbia serbian сербский' },
  { code: 'SI', label: 'Словения', searchTerms: 'словения slovenia slovenian словенский' },
  { code: 'IE', label: 'Ирландия', searchTerms: 'ирландия ireland irish ирландский' },
  { code: 'IS', label: 'Исландия', searchTerms: 'исландия iceland icelandic исландский' },
  { code: 'LU', label: 'Люксембург', searchTerms: 'люксембург luxembourg luxembourgish' },
  { code: 'MT', label: 'Мальта', searchTerms: 'мальта malta maltese мальтийский' },
  { code: 'CY', label: 'Кипр', searchTerms: 'кипр cyprus cypriot кипрский' },
  { code: 'MC', label: 'Монако', searchTerms: 'монако monaco monégasque' },
  { code: 'SM', label: 'Сан-Марино', searchTerms: 'сан-марино san marino sammarinese' },
  { code: 'VA', label: 'Ватикан', searchTerms: 'ватикан vatican' },
  { code: 'AD', label: 'Андорра', searchTerms: 'андорра andorra andorran' },
  { code: 'LI', label: 'Лихтенштейн', searchTerms: 'лихтенштейн liechtenstein' },
  { code: 'AL', label: 'Албания', searchTerms: 'албания albania albanian албанский' },
  { code: 'BA', label: 'Босния и Герцеговина', searchTerms: 'босния herzegovina bosnian боснийский' },
  { code: 'ME', label: 'Черногория', searchTerms: 'черногория montenegro montenegrin черногорский' },
  { code: 'MK', label: 'Северная Македония', searchTerms: 'македония macedonia macedonian македонский' },
  { code: 'XK', label: 'Косово', searchTerms: 'косово kosovo kosovar' },
  { code: 'MD', label: 'Молдова', searchTerms: 'молдова moldova moldovan молдавский' },
  
  // Азия
  { code: 'KZ', label: 'Казахстан', searchTerms: 'казахстан kazakhstan казахский' },
  { code: 'UZ', label: 'Узбекистан', searchTerms: 'узбекистан uzbekistan uzbek узбекский' },
  { code: 'KG', label: 'Кыргызстан', searchTerms: 'кыргызстан kyrgyzstan kyrgyz киргизский' },
  { code: 'TJ', label: 'Таджикистан', searchTerms: 'таджикистан tajikistan tajik таджикский' },
  { code: 'TM', label: 'Туркменистан', searchTerms: 'туркменистан turkmenistan turkmen туркменский' },
  { code: 'CN', label: 'Китай', searchTerms: 'китай china chinese китайский' },
  { code: 'JP', label: 'Япония', searchTerms: 'япония japan japanese японский' },
  { code: 'KR', label: 'Южная Корея', searchTerms: 'корея korea korean корейский' },
  { code: 'KP', label: 'Северная Корея', searchTerms: 'северная корея north korea корейский' },
  { code: 'IN', label: 'Индия', searchTerms: 'индия india indian индийский' },
  { code: 'PK', label: 'Пакистан', searchTerms: 'пакистан pakistan pakistani пакистанский' },
  { code: 'BD', label: 'Бангладеш', searchTerms: 'бангладеш bangladesh bangladeshi бангладешский' },
  { code: 'LK', label: 'Шри-Ланка', searchTerms: 'шри-ланка sri lanka sri lankan' },
  { code: 'MM', label: 'Мьянма', searchTerms: 'мьянма myanmar burmese бирманский' },
  { code: 'TH', label: 'Таиланд', searchTerms: 'таиланд thailand thai тайский' },
  { code: 'VN', label: 'Вьетнам', searchTerms: 'вьетнам vietnam vietnamese вьетнамский' },
  { code: 'KH', label: 'Камбоджа', searchTerms: 'камбоджа cambodia cambodian камбоджийский' },
  { code: 'LA', label: 'Лаос', searchTerms: 'лаос laos laotian лаосский' },
  { code: 'ID', label: 'Индонезия', searchTerms: 'индонезия indonesia indonesian индонезийский' },
  { code: 'MY', label: 'Малайзия', searchTerms: 'малайзия malaysia malaysian малайзийский' },
  { code: 'SG', label: 'Сингапур', searchTerms: 'сингапур singapore singaporean сингапурский' },
  { code: 'PH', label: 'Филиппины', searchTerms: 'филиппины philippines filipino филиппинский' },
  { code: 'BN', label: 'Бруней', searchTerms: 'бруней brunei bruneian брунейский' },
  { code: 'TL', label: 'Восточный Тимор', searchTerms: 'восточный тимор east timor timorese' },
  { code: 'MN', label: 'Монголия', searchTerms: 'монголия mongolia mongolian монгольский' },
  { code: 'AF', label: 'Афганистан', searchTerms: 'афганистан afghanistan afghan афганский' },
  { code: 'IR', label: 'Иран', searchTerms: 'иран iran iranian иранский' },
  { code: 'IQ', label: 'Ирак', searchTerms: 'ирак iraq iraqi иракский' },
  { code: 'SY', label: 'Сирия', searchTerms: 'сирия syria syrian сирийский' },
  { code: 'LB', label: 'Ливан', searchTerms: 'ливан lebanon lebanese ливанский' },
  { code: 'JO', label: 'Иордания', searchTerms: 'иордания jordan jordanian иорданский' },
  { code: 'IL', label: 'Израиль', searchTerms: 'израиль israel israeli израильский' },
  { code: 'PS', label: 'Палестина', searchTerms: 'палестина palestine palestinian палестинский' },
  { code: 'SA', label: 'Саудовская Аравия', searchTerms: 'саудовская аравия saudi arabia арабский' },
  { code: 'AE', label: 'ОАЭ', searchTerms: 'оаэ uae emirates эмираты' },
  { code: 'QA', label: 'Катар', searchTerms: 'катар qatar qatari катарский' },
  { code: 'BH', label: 'Бахрейн', searchTerms: 'бахрейн bahrain bahraini бахрейнский' },
  { code: 'KW', label: 'Кувейт', searchTerms: 'кувейт kuwait kuwaiti кувейтский' },
  { code: 'OM', label: 'Оман', searchTerms: 'оман oman omani оманский' },
  { code: 'YE', label: 'Йемен', searchTerms: 'йемен yemen yemeni йеменский' },
  { code: 'GE', label: 'Грузия', searchTerms: 'грузия georgia georgian грузинский' },
  { code: 'AM', label: 'Армения', searchTerms: 'армения armenia armenian армянский' },
  { code: 'AZ', label: 'Азербайджан', searchTerms: 'азербайджан azerbaijan azerbaijani азербайджанский' },
  { code: 'TR', label: 'Турция', searchTerms: 'турция turkey turkish турецкий' },
  { code: 'CY', label: 'Кипр', searchTerms: 'кипр cyprus cypriot кипрский' },
  { code: 'NP', label: 'Непал', searchTerms: 'непал nepal nepali непальский' },
  { code: 'BT', label: 'Бутан', searchTerms: 'бутан bhutan bhutanese бутанский' },
  { code: 'MV', label: 'Мальдивы', searchTerms: 'мальдивы maldives maldivian мальдивский' },
  
  // Америка
  { code: 'US', label: 'США', searchTerms: 'сша usa america американский' },
  { code: 'CA', label: 'Канада', searchTerms: 'канада canada canadian канадский' },
  { code: 'MX', label: 'Мексика', searchTerms: 'мексика mexico mexican мексиканский' },
  { code: 'GT', label: 'Гватемала', searchTerms: 'гватемала guatemala guatemalan гватемальский' },
  { code: 'BZ', label: 'Белиз', searchTerms: 'белиз belize belizean белизский' },
  { code: 'SV', label: 'Сальвадор', searchTerms: 'сальвадор salvador salvadoran сальвадорский' },
  { code: 'HN', label: 'Гондурас', searchTerms: 'гондурас honduras honduran гондурасский' },
  { code: 'NI', label: 'Никарагуа', searchTerms: 'никарагуа nicaragua nicaraguan никарагуанский' },
  { code: 'CR', label: 'Коста-Рика', searchTerms: 'коста-рика costa rica costa rican костариканский' },
  { code: 'PA', label: 'Панама', searchTerms: 'панама panama panamanian панамский' },
  { code: 'CU', label: 'Куба', searchTerms: 'куба cuba cuban кубинский' },
  { code: 'JM', label: 'Ямайка', searchTerms: 'ямайка jamaica jamaican ямайский' },
  { code: 'HT', label: 'Гаити', searchTerms: 'гаити haiti haitian гаитянский' },
  { code: 'DO', label: 'Доминиканская Республика', searchTerms: 'доминиканская dominican доминиканский' },
  { code: 'PR', label: 'Пуэрто-Рико', searchTerms: 'пуэрто-рико puerto rico puerto rican' },
  { code: 'TT', label: 'Тринидад и Тобаго', searchTerms: 'тринидад tobago trinidadian тобагский' },
  { code: 'BB', label: 'Барбадос', searchTerms: 'барбадос barbados barbadian барбадосский' },
  { code: 'GD', label: 'Гренада', searchTerms: 'гренада grenada grenadian гренадский' },
  { code: 'VC', label: 'Сент-Винсент и Гренадины', searchTerms: 'сент-винсент vincent grenadines' },
  { code: 'LC', label: 'Сент-Люсия', searchTerms: 'сент-люсия saint lucia lucian' },
  { code: 'DM', label: 'Доминика', searchTerms: 'доминика dominica dominican доминиканский' },
  { code: 'AG', label: 'Антигуа и Барбуда', searchTerms: 'антигуа antigua barbuda antiguan' },
  { code: 'KN', label: 'Сент-Китс и Невис', searchTerms: 'сент-китс saint kitts nevis' },
  { code: 'BS', label: 'Багамы', searchTerms: 'багамы bahamas bahamian багамский' },
  { code: 'BR', label: 'Бразилия', searchTerms: 'бразилия brazil brazilian бразильский' },
  { code: 'AR', label: 'Аргентина', searchTerms: 'аргентина argentina argentine аргентинский' },
  { code: 'CL', label: 'Чили', searchTerms: 'чили chile chilean чилийский' },
  { code: 'PE', label: 'Перу', searchTerms: 'перу peru peruvian перуанский' },
  { code: 'BO', label: 'Боливия', searchTerms: 'боливия bolivia bolivian боливийский' },
  { code: 'CO', label: 'Колумбия', searchTerms: 'колумбия colombia colombian колумбийский' },
  { code: 'VE', label: 'Венесуэла', searchTerms: 'венесуэла venezuela venezuelan венесуэльский' },
  { code: 'GY', label: 'Гайана', searchTerms: 'гайана guyana guyanese гайанский' },
  { code: 'SR', label: 'Суринам', searchTerms: 'суринам suriname surinamese суринамский' },
  { code: 'GF', label: 'Французская Гвиана', searchTerms: 'французская гвиана french guiana' },
  { code: 'EC', label: 'Эквадор', searchTerms: 'эквадор ecuador ecuadorian эквадорский' },
  { code: 'UY', label: 'Уругвай', searchTerms: 'уругвай uruguay uruguayan уругвайский' },
  { code: 'PY', label: 'Парагвай', searchTerms: 'парагвай paraguay paraguayan парагвайский' },
  
  // Африка
  { code: 'EG', label: 'Египет', searchTerms: 'египет egypt egyptian египетский' },
  { code: 'LY', label: 'Ливия', searchTerms: 'ливия libya libyan ливийский' },
  { code: 'TN', label: 'Тунис', searchTerms: 'тунис tunisia tunisian тунисский' },
  { code: 'DZ', label: 'Алжир', searchTerms: 'алжир algeria algerian алжирский' },
  { code: 'MA', label: 'Марокко', searchTerms: 'марокко morocco moroccan марокканский' },
  { code: 'SD', label: 'Судан', searchTerms: 'судан sudan sudanese суданский' },
  { code: 'SS', label: 'Южный Судан', searchTerms: 'южный судан south sudan' },
  { code: 'ET', label: 'Эфиопия', searchTerms: 'эфиопия ethiopia ethiopian эфиопский' },
  { code: 'ER', label: 'Эритрея', searchTerms: 'эритрея eritrea eritrean эритрейский' },
  { code: 'DJ', label: 'Джибути', searchTerms: 'джибути djibouti djiboutian джибутийский' },
  { code: 'SO', label: 'Сомали', searchTerms: 'сомали somalia somali сомалийский' },
  { code: 'KE', label: 'Кения', searchTerms: 'кения kenya kenyan кенийский' },
  { code: 'UG', label: 'Уганда', searchTerms: 'уганда uganda ugandan угандийский' },
  { code: 'TZ', label: 'Танзания', searchTerms: 'танзания tanzania tanzanian танзанийский' },
  { code: 'RW', label: 'Руанда', searchTerms: 'руанда rwanda rwandan руандийский' },
  { code: 'BI', label: 'Бурунди', searchTerms: 'бурунди burundi burundian бурундийский' },
  { code: 'MG', label: 'Мадагаскар', searchTerms: 'мадагаскар madagascar malagasy малагасийский' },
  { code: 'MU', label: 'Маврикий', searchTerms: 'маврикий mauritius mauritian маврикийский' },
  { code: 'SC', label: 'Сейшелы', searchTerms: 'сейшелы seychelles seychellois сейшельский' },
  { code: 'KM', label: 'Коморы', searchTerms: 'коморы comoros comorian коморский' },
  { code: 'MW', label: 'Малави', searchTerms: 'малави malawi malawian малавийский' },
  { code: 'ZM', label: 'Замбия', searchTerms: 'замбия zambia zambian замбийский' },
  { code: 'ZW', label: 'Зимбабве', searchTerms: 'зимбабве zimbabwe zimbabwean зимбабвийский' },
  { code: 'BW', label: 'Ботсвана', searchTerms: 'ботсвана botswana botswanan ботсванский' },
  { code: 'NA', label: 'Намибия', searchTerms: 'намибия namibia namibian намибийский' },
  { code: 'SZ', label: 'Эсватини', searchTerms: 'эсватини swaziland swazi свазилендский' },
  { code: 'LS', label: 'Лесото', searchTerms: 'лесото lesotho lesothan лесотский' },
  { code: 'ZA', label: 'ЮАР', searchTerms: 'юар south africa южноафриканский' },
  { code: 'MZ', label: 'Мозамбик', searchTerms: 'мозамбик mozambique mozambican мозамбикский' },
  { code: 'AO', label: 'Ангола', searchTerms: 'ангола angola angolan анголийский' },
  { code: 'ZR', label: 'ДР Конго', searchTerms: 'конго congo congolese конголезский' },
  { code: 'CG', label: 'Республика Конго', searchTerms: 'республика конго congo congolese' },
  { code: 'CM', label: 'Камерун', searchTerms: 'камерун cameroon cameroonian камерунский' },
  { code: 'CF', label: 'ЦАР', searchTerms: 'цар central african republic' },
  { code: 'TD', label: 'Чад', searchTerms: 'чад chad chadian чадский' },
  { code: 'NE', label: 'Нигер', searchTerms: 'нигер niger nigerien нигерский' },
  { code: 'NG', label: 'Нигерия', searchTerms: 'нигерия nigeria nigerian нигерийский' },
  { code: 'BJ', label: 'Бенин', searchTerms: 'бенин benin beninese бенинский' },
  { code: 'TG', label: 'Того', searchTerms: 'того togo togolese тоголезский' },
  { code: 'GH', label: 'Гана', searchTerms: 'гана ghana ghanaian ганский' },
  { code: 'BF', label: 'Буркина-Фасо', searchTerms: 'буркина-фасо burkina faso burkinabe' },
  { code: 'CI', label: 'Кот-д\'Ивуар', searchTerms: 'кот-д\'ивуар ivory coast ivorian' },
  { code: 'LR', label: 'Либерия', searchTerms: 'либерия liberia liberian либерийский' },
  { code: 'SL', label: 'Сьерра-Леоне', searchTerms: 'сьерра-леоне sierra leone sierra leonean' },
  { code: 'GN', label: 'Гвинея', searchTerms: 'гвинея guinea guinean гвинейский' },
  { code: 'GW', label: 'Гвинея-Бисау', searchTerms: 'гвинея-бисау guinea-bissau bissau-guinean' },
  { code: 'SN', label: 'Сенегал', searchTerms: 'сенегал senegal senegalese сенегальский' },
  { code: 'GM', label: 'Гамбия', searchTerms: 'гамбия gambia gambian гамбийский' },
  { code: 'ML', label: 'Мали', searchTerms: 'мали mali malian малийский' },
  { code: 'MR', label: 'Мавритания', searchTerms: 'мавритания mauritania mauritanian мавританский' },
  { code: 'CV', label: 'Кабо-Верде', searchTerms: 'кабо-верде cape verde cape verdean' },
  { code: 'ST', label: 'Сан-Томе и Принсипи', searchTerms: 'сан-томе principe sao tome' },
  { code: 'GQ', label: 'Экваториальная Гвинея', searchTerms: 'экваториальная гвинея equatorial guinea' },
  { code: 'GA', label: 'Габон', searchTerms: 'габон gabon gabonese габонский' },
  
  // Океания
  { code: 'AU', label: 'Австралия', searchTerms: 'австралия australia australian австралийский' },
  { code: 'NZ', label: 'Новая Зеландия', searchTerms: 'новая зеландия new zealand new zealander' },
  { code: 'PG', label: 'Папуа-Новая Гвинея', searchTerms: 'папуа-новая гвинея papua new guinea' },
  { code: 'FJ', label: 'Фиджи', searchTerms: 'фиджи fiji fijian фиджийский' },
  { code: 'NC', label: 'Новая Каледония', searchTerms: 'новая каледония new caledonia' },
  { code: 'VU', label: 'Вануату', searchTerms: 'вануату vanuatu vanuatuan вануатский' },
  { code: 'SB', label: 'Соломоновы Острова', searchTerms: 'соломоновы острова solomon islands' },
  { code: 'PF', label: 'Французская Полинезия', searchTerms: 'французская полинезия french polynesia' },
  { code: 'WS', label: 'Самоа', searchTerms: 'самоа samoa samoan самоанский' },
  { code: 'AS', label: 'Американское Самоа', searchTerms: 'американское самоа american samoa' },
  { code: 'TO', label: 'Тонга', searchTerms: 'тонга tonga tongan тонганский' },
  { code: 'CK', label: 'Острова Кука', searchTerms: 'острова кука cook islands' },
  { code: 'NU', label: 'Ниуэ', searchTerms: 'ниуэ niue niuean' },
  { code: 'KI', label: 'Кирибати', searchTerms: 'кирибати kiribati i-kiribati' },
  { code: 'TV', label: 'Тувалу', searchTerms: 'тувалу tuvalu tuvaluan тувалуанский' },
  { code: 'NR', label: 'Науру', searchTerms: 'науру nauru nauruan науруанский' },
  { code: 'PW', label: 'Палау', searchTerms: 'палау palau palauan палауанский' },
  { code: 'FM', label: 'Микронезия', searchTerms: 'микронезия micronesia micronesian микронезийский' },
  { code: 'MH', label: 'Маршалловы Острова', searchTerms: 'маршалловы острова marshall islands' },
  { code: 'GU', label: 'Гуам', searchTerms: 'гуам guam guamanian гуамский' },
  { code: 'MP', label: 'Северные Марианские острова', searchTerms: 'северные марианские northern mariana' },
  
  { code: 'CUSTOM', label: 'Другая страна', searchTerms: 'другая custom' }
];

// Предустановленные стили контента
export const CONTENT_STYLES = {
  FORMAL: 'Формальный',
  CASUAL: 'Неформальный',
  PROFESSIONAL: 'Профессиональный',
  FRIENDLY: 'Дружелюбный'
};

const GlobalSettings = ({ open, onClose, settings, onSettingsChange }) => {
  const [languageInputValue, setLanguageInputValue] = useState('');
  const [countryInputValue, setCountryInputValue] = useState('');
  
  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  // Находим выбранный язык для отображения
  const selectedLanguage = useMemo(() => {
    if (!settings.language) return null;
    return LANGUAGES.find(lang => lang.code === settings.language) || null;
  }, [settings.language]);

  // Находим выбранную страну для отображения
  const selectedCountry = useMemo(() => {
    if (!settings.country) return null;
    return COUNTRIES.find(country => country.code === settings.country) || null;
  }, [settings.country]);

  // Фильтрация языков для поиска
  const filteredLanguages = useMemo(() => {
    if (!languageInputValue) return LANGUAGES;
    
    const searchTerm = languageInputValue.toLowerCase();
    return LANGUAGES.filter(lang => 
      lang.label.toLowerCase().includes(searchTerm) ||
      lang.searchTerms.toLowerCase().includes(searchTerm) ||
      lang.code.toLowerCase().includes(searchTerm)
    );
  }, [languageInputValue]);

  // Фильтрация стран для поиска
  const filteredCountries = useMemo(() => {
    if (!countryInputValue) return COUNTRIES;
    
    const searchTerm = countryInputValue.toLowerCase();
    return COUNTRIES.filter(country => 
      country.label.toLowerCase().includes(searchTerm) ||
      country.searchTerms.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    );
  }, [countryInputValue]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          marginTop: '40px',
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <TuneIcon /> Глобальные настройки контента
      </DialogTitle>
      <DialogContent sx={{ pt: 5 }}>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Тематика сайта</InputLabel>
              <Select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                label="Тематика сайта"
              >
                {Object.entries(WEBSITE_THEMES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {settings.theme === 'CUSTOM' && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Своя тематика"
                value={settings.customTheme}
                onChange={(e) => handleChange('customTheme', e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={filteredLanguages}
              value={selectedLanguage}
              onChange={(event, newValue) => {
                handleChange('language', newValue ? newValue.code : '');
              }}
              inputValue={languageInputValue}
              onInputChange={(event, newInputValue) => {
                setLanguageInputValue(newInputValue);
              }}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  <Typography variant="body2">
                    {option.label}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите язык"
                  placeholder={selectedLanguage ? "" : "Выберите язык"}
                  helperText="Например: русский, английский, spanish, deutsch..."
                  variant="outlined"
                />
              )}
              noOptionsText="Язык не найден"
              clearText="Очистить"
              openText="Открыть список"
              closeText="Закрыть список"
              isClearable
              clearOnBlur={false}
              selectOnFocus
            />
            {settings.language === 'CUSTOM' && (
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                label="Введите двухбуквенный код языка (ISO 639-1)"
                placeholder="Например: ru, en, fr, de, es..."
                value={settings.customLanguage || ''}
                onChange={(e) => handleChange('customLanguage', e.target.value.toLowerCase().substring(0, 2))}
                helperText="Пример: ru - русский, en - английский, es - испанский"
                inputProps={{ maxLength: 2 }}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={filteredCountries}
              value={selectedCountry}
              onChange={(event, newValue) => {
                handleChange('country', newValue ? newValue.code : '');
              }}
              inputValue={countryInputValue}
              onInputChange={(event, newInputValue) => {
                setCountryInputValue(newInputValue);
              }}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  <Typography variant="body2">
                    {option.label}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите страну"
                  placeholder={selectedCountry ? "" : "Выберите страну"}
                  helperText="Например: россия, германия, usa, france..."
                  variant="outlined"
                />
              )}
              noOptionsText="Страна не найдена"
              clearText="Очистить"
              openText="Открыть список"
              closeText="Закрыть список"
              isClearable
              clearOnBlur={false}
              selectOnFocus
            />
            {settings.country === 'CUSTOM' && (
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                label="Введите название страны"
                placeholder="Например: Казахстан, Узбекистан, Молдова..."
                value={settings.customCountry || ''}
                onChange={(e) => handleChange('customCountry', e.target.value)}
                helperText="Укажите полное название страны"
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Стиль контента</InputLabel>
              <Select
                value={settings.contentStyle}
                onChange={(e) => handleChange('contentStyle', e.target.value)}
                label="Стиль контента"
              >
                {Object.entries(CONTENT_STYLES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'red', 
                fontWeight: 'bold', 
                mb: 1 
              }}
            >
              ОБЯЗАТЕЛЬНО укажите страну и язык из Заказа! Например: страна Россия язык русский
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Ключевые особенности"
              placeholder="Например: страна Россия язык русский, современный подход, инновационные технологии"
              value={settings.additionalKeywords}
              onChange={(e) => handleChange('additionalKeywords', e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'red'
                }
              }}
            />
            
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1976d2', fontWeight: 'bold' }}>
                📋 Пошаговый гайд по настройке:
              </Typography>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Ввести тематику сайта</strong> - выберите подходящую категорию из списка выше
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Обязательно выбрать язык контента</strong> - укажите язык для генерации всего контента
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Выбрать страну</strong> - укажите страну для адаптации контента под местную специфику
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0 }}>
                  <strong>В ключевых особенностях прописать по порядку:</strong>
                  <br />
                  <Typography 
                    variant="body2" 
                    component="span" 
                    sx={{ 
                      color: '#d32f2f',
                      fontWeight: 'bold',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  >
                    Страна → Язык сайта → Ключевые особенности
                  </Typography>
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1, 
                  fontStyle: 'italic', 
                  color: '#666'
                }}
              >
                Пример: "страна Германия, язык немецкий, премиум качество, экологичность"
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', p: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          color="primary"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalSettings; 