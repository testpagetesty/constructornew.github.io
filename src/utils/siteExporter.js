import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportCookieConsentData } from './cookieConsentExporter';
import { cleanHTML, cleanCSS, cleanJavaScript } from './codeCleanup';
import { generateLiveChatHTML, generateLiveChatCSS, generateLiveChatJS } from './liveChatExporter';
import { videoCacheService } from './videoCacheService';
import { videoProcessor } from './videoProcessor';

// Function to remove all comments from code
const removeComments = (code) => {
  if (!code) return code;
  return code
    // Remove single-line comments
    .replace(/\/\/.*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove empty lines
    .replace(/^\s*[\r\n]/gm, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

export const exportSite = async (siteData) => {
  console.log('🚀 exportSite called with siteData:', siteData);
  console.log('🔍 liveChatData:', siteData.liveChatData);
  console.log('🔍 liveChatData.enabled:', siteData.liveChatData?.enabled);
  
  const zip = new JSZip();
  
  // Create assets directory structure
  const assetsDir = zip.folder('assets');
  const cssDir = assetsDir.folder('css');
  const jsDir = assetsDir.folder('js');
  const imagesDir = assetsDir.folder('images');
  const videosDir = assetsDir.folder('videos');
  
  // Принудительно проверяем наличие видео в кеше в начале
  console.log('🔍 Forcing video cache check at start...');
  try {
    // Пробуем оба метода
    console.log('🔄 Trying getAllVideos()...');
    let allVideosAtStart = await videoCacheService.getAllVideos();
    console.log(`🔍 getAllVideos() found ${allVideosAtStart.length} videos:`, allVideosAtStart);
    
    if (allVideosAtStart.length === 0) {
      console.log('🔄 Trying getAllVideosSimple()...');
      allVideosAtStart = await videoCacheService.getAllVideosSimple();
      console.log(`🔍 getAllVideosSimple() found ${allVideosAtStart.length} videos:`, allVideosAtStart);
    }
    
    // Если есть видео в кеше, но нет в heroData, добавляем информацию
    if (allVideosAtStart.length > 0) {
      console.log('✅ Videos found in cache at start:', allVideosAtStart.length);
    } else {
      console.log('⚠️ No videos found in cache at start');
      
      console.log('⚠️ No videos found in cache during initial check');
    }
  } catch (error) {
    console.error('❌ Error checking video cache at start:', error);
  }
  
  // Add hero video if exists
  console.log('🎬 Checking hero video conditions...');
  console.log('🔍 Full siteData:', siteData);
  console.log('🔍 Hero data:', siteData.heroData);
  console.log('🔍 Hero background type:', siteData.heroData?.backgroundType);
  console.log('🔍 Hero background video:', siteData.heroData?.backgroundVideo);
  
  // Проверяем все возможные условия для видео
  const hasHeroVideo = siteData.heroData?.backgroundType === 'video' && siteData.heroData?.backgroundVideo;
  const hasVideoMetadata = localStorage.getItem('heroVideoMetadata');
  const hasAnyVideoInCache = false; // Будет проверено ниже
  
  console.log('🔍 Video conditions check:', {
    hasHeroVideo,
    hasVideoMetadata: !!hasVideoMetadata,
    backgroundType: siteData.heroData?.backgroundType,
    backgroundVideo: siteData.heroData?.backgroundVideo
  });
  
  // Всегда пытаемся обработать видео, независимо от условий hero
  if (true) {
    try {
      console.log('🎬 Processing hero video...');
      
      // Получаем метаданные видео из localStorage (аналогично изображениям)
      const videoMetadata = JSON.parse(localStorage.getItem('heroVideoMetadata') || '{}');
      console.log('🔍 Hero video metadata:', videoMetadata);
      
      if (videoMetadata.filename) {
        // Получаем видео из кэша по имени файла из метаданных
        const videoFile = await videoCacheService.getVideo(videoMetadata.filename);
        if (videoFile) {
          // Проверяем, нужно ли обрабатывать видео для удаления постбека при экспорте
          let finalVideoFile = videoFile;
          
          if (siteData.heroData?.videoRemovePostback !== false && !videoMetadata.processed) {
            try {
              console.log('🎬 Применяю обработку постбека при экспорте...');
              
              const cropOptions = {
                cropBottom: siteData.heroData?.videoCropBottom !== false ? 80 : 0,
                cropRight: siteData.heroData?.videoCropRight !== false ? 80 : 0,
                cropTop: siteData.heroData?.videoCropTop !== false ? 0 : 0,
                cropLeft: 0
              };
              
              finalVideoFile = await videoProcessor.processVideoForPostback(videoFile, cropOptions);
              console.log('✅ Постбек удален при экспорте с настройками:', cropOptions);
            } catch (processingError) {
              console.warn('⚠️ Не удалось обработать видео при экспорте, используем оригинал:', processingError);
              finalVideoFile = videoFile;
            }
          } else {
            console.log('ℹ️ Обработка постбека не требуется или уже применена');
          }
          
          // Добавляем обработанное видео в экспорт
          videosDir.file(videoMetadata.filename, finalVideoFile);
          console.log(`✅ Hero video added to export: ${videoMetadata.filename} (${finalVideoFile.size} bytes)`);
          
          // Также добавляем в корень assets для совместимости
          assetsDir.file(videoMetadata.filename, finalVideoFile);
          console.log(`✅ Hero video also added to assets root: ${videoMetadata.filename}`);
          
        } else {
          console.warn('⚠️ Hero video not found in cache:', videoMetadata.filename);
        }
      } else {
        console.warn('⚠️ No hero video metadata found');
        
        // Пытаемся получить видео по стандартному имени
        try {
          const videoFile = await videoCacheService.getVideo('hero.mp4');
          if (videoFile) {
            videosDir.file('hero.mp4', videoFile);
            console.log(`✅ Hero video found by standard name: hero.mp4 (${videoFile.size} bytes)`);
        assetsDir.file('hero.mp4', videoFile);
      } else {
            console.warn('⚠️ Hero video not found by standard name either');
          }
        } catch (fallbackError) {
          console.error('❌ Fallback video check failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('❌ Error processing hero video:', error);
      

    }
  }
  
  // Export ALL videos from cache (similar to how images are exported)
  try {
    console.log('🎬 Processing ALL videos from cache...');
    
    // Get all videos from cache using both methods
    let allVideos = await videoCacheService.getAllVideos();
    console.log(`🔍 getAllVideos() found ${allVideos.length} videos`);
    
    if (allVideos.length === 0) {
      console.log('🔄 Trying getAllVideosSimple()...');
      allVideos = await videoCacheService.getAllVideosSimple();
      console.log(`🔍 getAllVideosSimple() found ${allVideos.length} videos`);
    }
    
    console.log(`🔍 Total videos found: ${allVideos.length}`);
    console.log('📹 All videos details:', allVideos.map(v => ({
      key: v.key,
      size: v.size,
      type: v.type
    })));
    
    if (allVideos.length > 0) {
      console.log(`📹 Processing ${allVideos.length} videos...`);
      
      for (const video of allVideos) {
        try {
          const videoKey = video.key || video.name || 'unknown';
          const videoBlob = video.value || video.blob || video;
          
          if (videoBlob && videoBlob.size) {
            // Добавляем в папку videos
            videosDir.file(videoKey, videoBlob);
            console.log(`✅ Video added to videos folder: ${videoKey} (${videoBlob.size} bytes)`);
            

          }
        } catch (videoError) {
          console.error(`❌ Error processing video ${video.key || 'unknown'}:`, videoError);
        }
      }
      

    } else {
      console.log('ℹ️ No videos found in cache');
    }
  } catch (error) {
    console.error('❌ Error processing videos:', error);
    

  }
  
  // Add chat open sound if live chat is enabled
  console.log('🔍 Checking live chat status:', {
    liveChatData: siteData.liveChatData,
    enabled: siteData.liveChatData?.enabled
  });
  
  if (siteData.liveChatData?.enabled) {
    try {
      console.log('🔊 Adding chat open sound...');
      
      // Try to fetch the sound file from different sources
      console.log('🔄 Attempting to fetch sound file...');
      
      // Try different paths including API endpoint
      const possiblePaths = [
        '/api/get-sound-file',  // API endpoint (priority)
        '/1.mp3', 
        './1.mp3', 
        './public/1.mp3', 
        '/public/1.mp3'
      ];
      let response = null;
      let successPath = null;
      
      for (const path of possiblePaths) {
        try {
          console.log('🔄 Trying path:', path);
          response = await fetch(path);
          console.log('📡 Response for', path, ':', response.status, response.statusText);
          
          if (response.ok) {
            successPath = path;
            console.log('✅ Found sound file at:', successPath);
            
            // Additional information for API endpoint
            if (path === '/api/get-sound-file') {
              const fileSize = response.headers.get('X-File-Size');
              const filePath = response.headers.get('X-File-Path');
              console.log('📊 API endpoint info - Size:', fileSize, 'bytes, Path:', filePath);
            }
            
            break;
          }
        } catch (error) {
          console.log('❌ Error fetching', path, ':', error.message);
        }
      }
      
      if (!successPath) {
        console.log('❌ Could not find sound file at any path');
        console.log('📝 Tried paths:', possiblePaths);
      }
      
      if (response && response.ok) {
        console.log('✅ Successfully fetched sound file from:', successPath);
        const soundBlob = await response.blob();
        console.log('📦 Sound blob size:', soundBlob.size, 'bytes');
        const soundBuffer = await soundBlob.arrayBuffer();
        console.log('🔄 Converting to ArrayBuffer, size:', soundBuffer.byteLength, 'bytes');
        
        // Add the original file as MP3
        assetsDir.file('chat-open.mp3', soundBuffer);
        
        // Also add as OGG and WAV with same data (browsers will handle decoding)
        assetsDir.file('chat-open.ogg', soundBuffer);
        assetsDir.file('chat-open.wav', soundBuffer);
        
        // Add to root directory as backup
        zip.file('chat-open.mp3', soundBuffer);
        zip.file('chat-open.ogg', soundBuffer);
        zip.file('chat-open.wav', soundBuffer);
        
        console.log('✅ Chat open sound added to export in multiple formats and locations');
        console.log(`📊 Final sound file size: ${soundBuffer.byteLength} bytes`);
        console.log('📁 Files added to assets/: chat-open.mp3, chat-open.ogg, chat-open.wav');
        console.log('📁 Files added to root/: chat-open.mp3, chat-open.ogg, chat-open.wav');
        

      } else {
        console.warn('⚠️ Could not load chat sound file from any path');
        console.warn('📝 Tried paths:', possiblePaths);
        console.warn('🔧 Creating instruction file instead');
        
        // Add manual instruction file
        assetsDir.file('README-SOUND.txt', 
          'CHAT SOUND ADDING INSTRUCTION\n' +
          '=====================================\n\n' +
          'Sound file was not found automatically.\n' +
          'Source file: C:\\Users\\840G5\\Desktop\\НОВЫЙ\\public\\1.mp3\n\n' +
          'Tried paths:\n' +
          possiblePaths.map(path => '- ' + path).join('\n') + '\n\n' +
          'WHAT TO DO:\n' +
          '1. Find file 1.mp3 in public/ folder\n' +
          '2. Copy it to assets/ folder of exported site\n' +
          '3. Rename to one of formats:\n' +
          '   - chat-open.ogg (priority 1)\n' +
          '   - chat-open.wav (priority 2)\n' +
          '   - chat-open.mp3 (priority 3)\n\n' +
          'ALTERNATIVELY:\n' +
          '- Place file in root folder of site\n' +
          '- JavaScript code will automatically find sound\n\n' +
          'ONLINE CONVERTERS (if OGG needed):\n' +
          '- https://convertio.co/mp3-ogg/\n' +
          '- https://online-audio-converter.com/\n' +
          '- https://cloudconvert.com/mp3-to-ogg\n\n' +
          'DEBUGGING:\n' +
          '- Open browser console (F12)\n' +
          '- Click on chat button\n' +
          '- Check sound loading messages'
        );
      }
    } catch (error) {
      console.error('❌ Error processing chat sound:', error);
      // Add manual instruction file with error details
      assetsDir.file('README-SOUND.txt', 
        'CHAT SOUND ADDING INSTRUCTION (ERROR)\n' +
        '============================================\n\n' +
        'Error occurred during automatic sound adding:\n' +
        'Error: ' + error.message + '\n\n' +
        'Source file: C:\\Users\\840G5\\Desktop\\НОВЫЙ\\public\\1.mp3\n\n' +
        'WHAT TO DO:\n' +
        '1. Find file 1.mp3 in public/ folder\n' +
        '2. Copy it to assets/ folder of exported site\n' +
        '3. Rename to one of formats:\n' +
        '   - chat-open.ogg (priority 1)\n' +
        '   - chat-open.wav (priority 2)\n' +
        '   - chat-open.mp3 (priority 3)\n\n' +
        'ALTERNATIVELY:\n' +
        '- Place file in root folder of site\n' +
        '- JavaScript code will automatically find sound\n\n' +
        'ONLINE CONVERTERS (if OGG needed):\n' +
        '- https://convertio.co/mp3-ogg/\n' +
        '- https://online-audio-converter.com/\n' +
        '- https://cloudconvert.com/mp3-to-ogg\n\n' +
        'TECHNICAL INFORMATION:\n' +
        'Error time: ' + new Date().toISOString() + '\n' +
        'User Agent: ' + (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown') + '\n' +
        'Error stack: ' + error.stack
      );
    }
  }
  
  // Process and add chat operator photo if live chat is enabled
  if (siteData.liveChatData?.enabled) {
    try {
      console.log('🎭 Processing chat operator photo...');
      const response = await fetch('/api/process-chat-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const photoBlob = await response.blob();
        const originalFile = response.headers.get('X-Original-File');
        const photoSize = response.headers.get('X-Photo-Size');
        
        imagesDir.file('operator.jpg', photoBlob);
        console.log(`✅ Chat operator photo added to export: ${originalFile} (${photoSize} bytes)`);
      } else {
        console.warn('⚠️ Could not process chat operator photo:', response.status);
      }
    } catch (error) {
      console.error('❌ Error processing chat operator photo:', error);
    }
  }
  
  // Generate and add styles
  const styles = generateStyles();
  cssDir.file('styles.css', cleanCSS(styles));
  
  // Generate and add HTML files
  const indexHtml = generateIndexHtml(siteData);
  zip.file('index.html', cleanHTML(indexHtml));
  
  // Add merci.html to root
  const merciHtml = await fetch('/merci.html').then(res => res.text());
  zip.file('merci.html', cleanHTML(merciHtml));
  
  // Add cookie consent data
  const cookieData = exportCookieConsentData();
  if (cookieData) {
    zip.file('cookie-consent-data.json', JSON.stringify(cookieData.data, null, 2));
  }
  
  // Add other necessary files
  zip.file('privacy-policy.html', cleanHTML(generatePrivacyPolicy(siteData)));
  zip.file('cookie-policy.html', cleanHTML(generateCookiePolicy(siteData)));
  zip.file('terms-of-service.html', cleanHTML(generateTermsOfService(siteData)));
  
  // Add robots.txt to the archive (unchanged from root directory)
  try {
    const robotsResponse = await fetch('/robots.txt');
    const robotsContent = await robotsResponse.text();
    zip.file('robots.txt', robotsContent);
    console.log('robots.txt successfully added to export zip');
  } catch (error) {
    console.warn('Could not fetch robots.txt for export, using default content');
    zip.file('robots.txt', 'User-agent: *\nDisallow:');
  }

  // Add sitemap.xml to the archive (dynamically generated with domain from settings)
  try {
    const sitemapContent = generateSitemap(siteData);
    zip.file('sitemap.xml', sitemapContent);
    console.log('sitemap.xml successfully added to export zip with domain:', siteData.headerData?.domain);
  } catch (error) {
    console.error('Error generating sitemap.xml for export:', error);
  }
  
  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  const fileName = generateSafeFileName(siteData);
  saveAs(content, `${fileName}.zip`);
};

const generateIndexHtml = (siteData) => {
  const headerData = siteData.headerData || {};
  const heroData = siteData.heroData || {};
  const liveChatData = siteData.liveChatData || {};
  const siteName = headerData.siteName || 'My Site';
  
  // Безопасное извлечение языка - проверяем что это строка
  let languageCode = 'ru';
  if (typeof headerData.language === 'string' && headerData.language.length > 0) {
    languageCode = headerData.language;
  } else if (typeof headerData.language === 'object' && headerData.language) {
    // Проверяем различные возможные структуры объекта
    if (headerData.language.value) {
      languageCode = headerData.language.value;
    } else if (headerData.language.code) {
      languageCode = headerData.language.code;
    } else if (headerData.language.id) {
      languageCode = headerData.language.id;
    } else {
      // Если это объект с неизвестной структурой, используем первое строковое значение
      const keys = Object.keys(headerData.language);
      for (const key of keys) {
        if (typeof headerData.language[key] === 'string' && headerData.language[key].length > 0) {
          languageCode = headerData.language[key];
          break;
        }
      }
    }
  }
  
  // Дополнительная проверка на валидность языкового кода
  if (typeof languageCode !== 'string' || languageCode.length === 0) {
    languageCode = 'ru';
  }
  
  console.log('🌐 Language extracted:', languageCode, 'from:', headerData.language);
  
  // Use description from headerData (already synchronized with heroData.subtitle in HeaderEditor)
  const metaDescription = headerData.description || 'Our site offers the best solutions';
  
  return `
    <!DOCTYPE html>
    <html lang="${languageCode}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${metaDescription}">
        <title>${siteName}</title>
        ${headerData.domain ? `<link rel="canonical" href="https://${headerData.domain}" />` : ''}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="assets/css/styles.css">
        <style>
          /* Main fonts */
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aXp-p7K4KLg.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aXp-p7K4KLg.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXp-p7K4KLg.woff2) format('woff2');
          }
          
          /* Live Chat Styles */
          ${liveChatData.enabled ? generateLiveChatCSS() : ''}
        </style>
      </head>
      <body>
        <div id="root">
          ${generateSiteContent(siteData)}
        </div>
        
        ${liveChatData.enabled ? generateLiveChatHTML(siteName, languageCode, liveChatData) : ''}
        
        <script>
          ${generateAppJs(siteData)}
          
          ${liveChatData.enabled ? generateLiveChatJS(siteName, languageCode, liveChatData) : ''}
        </script>
      </body>
    </html>
  `;
};

const generateStyles = () => {
  return `
    /* Video and GIF preloading styles */
    .hero-video,
    .hero-gif {
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
    
    .hero-video.loaded,
    .hero-gif.loaded {
      opacity: 1;
    }
    
    .hero-video.loading,
    .hero-gif.loading {
      opacity: 0.3;
    }
    
    /* Video and GIF loading overlay */
    .video-loading-overlay,
    .gif-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: opacity 0.5s ease-in-out;
    }
    
    .video-loading-overlay.hidden,
    .gif-loading-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .video-loading-spinner,
    .gif-loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
      background: #fff;
    }

    /* To prevent style conflicts */
    [data-nocards="true"] * {
      box-sizing: border-box;
    }

    /* Styles for sections without cards */
    .section-nocards {
      background: #102826;
      padding: 4rem 2rem;
      width: 100%;
      margin: 0;
      position: relative;
      overflow: hidden;
    }
    .section-nocards h2 {
      color: #00e6e6;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
      position: relative;
    }
    .section-nocards h2:after {
      content: '';
      display: block;
      width: 80px;
      height: 3px;
      background: #00e6e6;
      margin: 15px auto;
    }
    .section-nocards > p {
      color: #00e6e6;
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 3rem;
      text-align: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
      font-family: 'Montserrat', sans-serif;
    }
    .section-nocards .service-blocks {
      display: flex;
      flex-direction: column;
      gap: 32px;
      width: 100%;
    }
    .section-nocards .service-block {
      background: rgba(255,255,255,0.03);
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      margin-bottom: 0;
      padding: 2rem;
      text-align: left;
      transition: box-shadow 0.3s;
      animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
    }
    .section-nocards .service-block h3 {
      color: #00e6e6;
      margin-bottom: 1rem;
      font-size: 1.3rem;
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
    }
    .section-nocards .service-block p {
      color: #00e6e6;
      font-size: 1.1rem;
      line-height: 1.7;
      margin: 0;
      font-family: 'Montserrat', sans-serif;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .section-nocards {
        padding: 2rem 0.5rem;
      }
      .section-nocards .service-block {
        padding: 1.2rem;
      }
      .section-nocards h2 {
        font-size: 2rem;
      }
      .section-nocards > p {
        font-size: 1.1rem;
      }
    }

    /* Contact section styles */
    .contact-section {
      padding: 4rem 2rem;
      width: 100%;
      margin: 0;
      position: relative;
      z-index: 2;
    }
    
    .contact-container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .contact-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .contact-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      position: relative;
      display: inline-block;
    }
    
    .contact-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background-color: currentColor;
    }
    
    .contact-description {
      font-size: 1.1rem;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .contact-form-container {
      padding: 2.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #ddd;
    }
    
    .contact-form .form-group {
      margin-bottom: 1.5rem;
    }
    
    .contact-form label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .contact-form input,
    .contact-form textarea {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      font-family: inherit;
    }
    
    .contact-form textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .contact-form button {
      width: 100%;
      padding: 0.9rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .contact-form button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .contact-info-container {
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #ddd;
    }
    
    .info-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .contact-info p {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }
    
    .contact-info strong {
      margin-right: 0.5rem;
    }
    
    .contact-map {
      margin-top: 2rem;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .contact-map iframe {
      width: 100%;
      height: 300px;
      border: 0;
    }
    
    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
      }
      
      .contact-form-container,
      .contact-info-container {
        padding: 1.5rem;
      }
      
      .contact-title {
        font-size: 2rem;
      }
    }
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .contact-form-container h3,
    .contact-info-container h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      font-family: 'Montserrat', sans-serif;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      font-size: 0.9rem;
      font-family: 'Montserrat', sans-serif;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      font-family: 'Montserrat', sans-serif;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #1976d2;
    }

    .contact-form button {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-family: 'Montserrat', sans-serif;
    }

    .contact-form button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-info p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'Montserrat', sans-serif;
    }

    .contact-map {
      margin-top: 2rem;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .contact-map iframe {
      border-radius: 12px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .contact-section {
        padding: 2rem 1rem;
      }

      .contact-title {
        font-size: 2rem;
      }

      .contact-description {
        font-size: 1.1rem;
      }

      .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .contact-form-container,
      .contact-info-container {
        padding: 1.5rem;
      }

      .contact-map iframe {
        height: 250px;
      }
    }

    /* Footer styles */
    .site-footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 3rem 2rem 1rem;
      font-family: 'Montserrat', sans-serif;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-info h3,
    .footer-links h4,
    .footer-contact h4 {
      margin-bottom: 1rem;
      color: #3498db;
      font-weight: 600;
    }

    .footer-info p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .footer-links ul {
      list-style: none;
      padding: 0;
    }

    .footer-links li {
      margin-bottom: 0.5rem;
    }

    .footer-links a {
      color: #ecf0f1;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-links a:hover {
      color: #3498db;
    }

    .footer-contact p {
      margin-bottom: 0.5rem;
    }

    .footer-bottom {
      border-top: 1px solid #34495e;
      padding-top: 1rem;
      text-align: center;
    }

    .footer-bottom p {
      margin: 0;
      color: #95a5a6;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .site-footer {
        padding: 2rem 1rem 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `;
};

const generateAppJs = (siteData) => {
  const headerData = siteData.headerData || {};
  
  return cleanJavaScript(`
    document.addEventListener('DOMContentLoaded', function() {
      // Set CSS variables
      const root = document.documentElement;
      root.style.setProperty('--header-bg-color', '${headerData.backgroundColor || '#ffffff'}');
      root.style.setProperty('--header-title-color', '${headerData.titleColor || '#000000'}');
      root.style.setProperty('--header-link-color', '${headerData.linksColor || '#000000'}');
      
      // Initialize video preloading if hero video exists
      initializeVideoPreloading();
      
      initializeScripts();
      initializeAnimations();
      
      // Add a small delay to ensure DOM is fully loaded
      setTimeout(() => {
        console.log('Starting autoDisplayDomain function...');
        autoDisplayDomain();
        console.log('Finished autoDisplayDomain function');
      }, 100);
      
      // Also try without delay for immediate execution
      autoDisplayDomain();
    });
    
    function initializeVideoPreloading() {
      const heroVideo = document.getElementById('heroVideo');
      const heroGif = document.getElementById('heroGif');
      const videoLoadingOverlay = document.getElementById('videoLoadingOverlay');
      const gifLoadingOverlay = document.getElementById('gifLoadingOverlay');
      
      // Initialize video preloading
      if (heroVideo && videoLoadingOverlay) {
        console.log('🎬 Initializing video preloading...');
        
        // Show loading overlay initially
        videoLoadingOverlay.classList.remove('hidden');
        heroVideo.classList.add('loading');
        
        // Wait for video to be ready to play
        heroVideo.addEventListener('canplay', function() {
          console.log('✅ Video can play, starting playback...');
          heroVideo.classList.remove('loading');
          heroVideo.classList.add('loaded');
          
          // Hide loading overlay with smooth transition
          setTimeout(() => {
            videoLoadingOverlay.classList.add('hidden');
          }, 500);
        });
        
        // Handle video load errors
        heroVideo.addEventListener('error', function() {
          console.error('❌ Video loading error, hiding overlay...');
          videoLoadingOverlay.classList.add('hidden');
          heroVideo.classList.remove('loading');
        });
        
        // Force video to start loading
        heroVideo.load();
        
        // Start playing as soon as possible
        heroVideo.addEventListener('canplaythrough', function() {
          console.log('🎯 Video fully loaded, ensuring playback...');
          heroVideo.play().catch(e => {
            console.log('⚠️ Autoplay blocked, but video is ready');
          });
        });
      }
      
      // Initialize GIF preloading
      if (heroGif && gifLoadingOverlay) {
        console.log('🖼️ Initializing GIF preloading...');
        
        // Show loading overlay initially
        gifLoadingOverlay.classList.remove('hidden');
        heroGif.classList.add('loading');
        
        // Wait for GIF to be fully loaded
        heroGif.addEventListener('load', function() {
          console.log('✅ GIF fully loaded...');
          heroGif.classList.remove('loading');
          heroGif.classList.add('loaded');
          
          // Hide loading overlay with smooth transition
          setTimeout(() => {
            gifLoadingOverlay.classList.add('hidden');
          }, 500);
        });
        
        // Handle GIF load errors
        heroGif.addEventListener('error', function() {
          console.error('❌ GIF loading error, hiding overlay...');
          gifLoadingOverlay.classList.add('hidden');
          heroGif.classList.remove('loading');
        });
        
        // Force GIF to start loading
        heroGif.src = heroGif.src;
      }
    }

    function initializeScripts() {
      // Initialize menu toggle
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.querySelector('.nav-menu');
      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
          menuToggle.classList.toggle('active');
          navMenu.classList.toggle('active');
        });
      }

      // Initialize smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      });
    }

    function initializeAnimations() {
      // Create intersection observer for sections
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              
              // Ensure child elements get proper staggered animations
              const section = entry.target;
              const contentBlocks = section.querySelectorAll('.content-block');
              contentBlocks.forEach((block, index) => {
                block.style.setProperty('--index', index);
              });
              
              // Only unobserve if all animations are complete
              const lastDelay = contentBlocks.length * 0.15 + 1.8; // Maximum animation delay
              setTimeout(() => {
                sectionObserver.unobserve(entry.target);
              }, lastDelay * 1000);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px'
        }
      );

      // Observe all sections except no-cards sections (they have their own animations)
      document.querySelectorAll('.section:not([data-nocards="true"])').forEach(section => {
        // Reset any existing animations
        section.classList.remove('animate');
        
        // Start observing
        sectionObserver.observe(section);
        
        // Handle images loading
        const images = section.querySelectorAll('img');
        if (images.length > 0) {
          Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve; // Handle error case gracefully
            });
          })).then(() => {
            // Re-trigger animation after images are loaded
            if (section.classList.contains('animate')) {
              section.classList.remove('animate');
              requestAnimationFrame(() => {
                section.classList.add('animate');
              });
            }
          });
        }
      });
    }

    function autoDisplayDomain() {
      // Get current domain from browser
      const currentDomain = window.location.hostname;
      
      // Skip if localhost or IP address
      if (currentDomain === 'localhost' || 
          currentDomain === '127.0.0.1' || 
          currentDomain.includes('192.168.') ||
          currentDomain.includes('10.0.') ||
          /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(currentDomain)) {
        console.log('Skipping domain display for localhost/IP');
        return;
      }
      
      console.log('Auto-displaying domain:', currentDomain);
      
      // Find domain display element in header
      const domainElement = document.querySelector('.domain, .site-domain');
      
      if (domainElement) {
        // Update existing domain element
        domainElement.textContent = currentDomain;
        domainElement.style.display = 'block';
        console.log('Updated header domain element');
      } else {
        // Create new domain element if it doesn't exist
        const sitebranding = document.querySelector('.site-branding');
        if (sitebranding) {
          const domainDiv = document.createElement('div');
          domainDiv.className = 'domain';
          domainDiv.textContent = currentDomain;
          domainDiv.style.cssText = 'color: inherit; opacity: 0.8; font-size: 0.9rem; margin-top: 4px;';
          sitebranding.appendChild(domainDiv);
          console.log('Created new header domain element');
        }
      }
      
      // Update contact domain elements
      const allContactDomainElements = document.querySelectorAll('.contact-domain');
      console.log('Found contact domain elements:', allContactDomainElements.length);
      
      allContactDomainElements.forEach((domainElement, index) => {
        const oldText = domainElement.textContent;
        domainElement.textContent = currentDomain;
        domainElement.style.display = 'block'; // Show the element like in header
        console.log('Updated contact domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
      });
      
      // Update footer domain elements
      const allFooterDomainElements = document.querySelectorAll('.footer-domain');
      console.log('Found footer domain elements:', allFooterDomainElements.length);
      
      allFooterDomainElements.forEach((domainElement, index) => {
        const oldText = domainElement.textContent;
        domainElement.textContent = currentDomain;
        domainElement.style.display = 'block'; // Show the element like in header
        console.log('Updated footer domain element', index + 1, 'from:', oldText, 'to:', currentDomain);
      });
      
      // Update any other domain references on the page
      const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');
      domainPlaceholders.forEach(element => {
        element.textContent = currentDomain;
      });
      
      // Update contact email if it contains placeholder domain
      const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');
      emailElements.forEach(element => {
        const href = element.getAttribute('href') || '';
        const text = element.textContent || '';
        
        if (href.includes('@example.com') || text.includes('@example.com')) {
          const newHref = href.replace('@example.com', \`@\${currentDomain}\`);
          const newText = text.replace('@example.com', \`@\${currentDomain}\`);
          
          if (href !== newHref) element.setAttribute('href', newHref);
          if (text !== newText) element.textContent = newText;
        }
      });
    }
  `);
};

const generateSiteContent = (siteData) => {
  const headerData = siteData.headerData || {};
  const headerStyles = [];
  
  if (headerData.backgroundColor) {
    headerStyles.push(`--header-bg-color: ${headerData.backgroundColor}`);
  }
  if (headerData.titleColor) {
    headerStyles.push(`--header-title-color: ${headerData.titleColor}`);
  }
  if (headerData.linksColor) {
    headerStyles.push(`--header-link-color: ${headerData.linksColor}`);
  }

  return cleanHTML(`    <div class="site-container">
      <header class="site-header" style="${headerStyles.join('; ')}">
        <div class="header-content">
          <div class="site-branding">
            <h1 class="site-title">${headerData.siteName || 'My Site'}</h1>
            <div class="site-domain" style="display: none;">${headerData.domain || ''}</div>
          </div>
          <nav class="site-nav">
            ${(headerData.menuItems || []).map(item => `
              <a href="${item.url || '#'}" class="nav-link">${item.text || item.title}</a>
            `).join('')}
          </nav>
        </div>
      </header>
      ${generateMainContent(siteData)}
      ${generateFooter(siteData)}
    </div>
  `);
};

const generateHeader = (siteData) => {
  return cleanHTML(`    <header>
      <nav>
        ${generateNavigation(siteData)}
      </nav>
    </header>
  `);
};

const generateMainContent = (siteData) => {
  return cleanHTML(`
    <main>
      ${generateSections(siteData)}
      ${generateContactSection(siteData)}
    </main>
  `);
};

const generateFooter = (siteData) => {
  return cleanHTML(`
    <footer>
      ${generateFooterContent(siteData)}
    </footer>
  `);
};

const generateNavigation = (siteData) => {
  const headerData = siteData.headerData || {};
  return `
    <div class="nav-container">
      <div class="site-branding" style="display: flex; flex-direction: column; margin-right: 2rem;">
        <div class="logo">${headerData.siteName || 'My Site'}</div>
        <div class="domain" style="display: none;">${headerData.domain || ''}</div>
      </div>
      <button class="menu-toggle" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav-menu">
        ${(headerData.menuItems || []).map(item => `
          <li>
            <a href="${item.url || '#'}">${item.text || item.title}</a>
          </li>
        `).join('')}
        <li>
          <a href="#contact">Contact Us</a>
        </li>
      </ul>
    </div>
  `;
};

const generateFooterContent = (siteData) => {
  const footerData = siteData.footerData || {};
  const headerData = siteData.headerData || {};
  const currentYear = new Date().getFullYear();
  
  return `
    <div class="site-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>${headerData.siteName || 'My Site'}</h3>
            ${footerData.description ? `<p>${footerData.description}</p>` : ''}
          </div>
          ${footerData.showLinks !== false ? `
            <div class="footer-links">
              <h4>Ссылки</h4>
              <ul>
                ${(headerData.menuItems || []).map(item => `
                  <li><a href="${item.url || '#'}">${item.text || item.title}</a></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          ${footerData.showContact !== false ? `
            <div class="footer-contact">
              <h4>Контакты</h4>
              ${siteData.contactData?.phone ? `<p>Телефон: ${siteData.contactData.phone}</p>` : ''}
              ${siteData.contactData?.email ? `<p>Email: ${siteData.contactData.email}</p>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="footer-bottom">
          <p>&copy; ${currentYear} ${headerData.siteName || 'My Site'}. Все права защищены.</p>
        </div>
      </div>
    </div>
  `;
};

const generatePrivacyPolicy = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Privacy Policy</title>
      </head>
      <body>
        <!-- Add privacy policy content -->
      </body>
    </html>
  `;
};

const generateCookiePolicy = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Cookie Policy</title>
      </head>
      <body>
        <!-- Add cookie policy content -->
      </body>
    </html>
  `;
};

const generateTermsOfService = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Terms of Service</title>
      </head>
      <body>
        <!-- Add terms of service content -->
      </body>
    </html>
  `;
};

const generateSitemap = (siteData) => {
  const domain = siteData.headerData?.domain || 'example.com';
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const currentDate = new Date().toISOString().replace('Z', '+00:00');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
};

const generateSafeFileName = (siteData) => {
  let fileName = '';
  
  // Priority: domain, then site name
  if (siteData.headerData?.domain && siteData.headerData.domain.trim()) {
    fileName = siteData.headerData.domain.trim();
    // Remove protocol if present
    fileName = fileName.replace(/^https?:\/\//, '');
    // Remove www. if present
    fileName = fileName.replace(/^www\./, '');
  } else if (siteData.headerData?.siteName && siteData.headerData.siteName.trim()) {
    fileName = siteData.headerData.siteName.trim();
  } else {
    fileName = 'site';
  }
  
      // Replace invalid characters for filename
    fileName = fileName
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid Windows characters
          .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-\.]/g, '') // Keep only letters (including Cyrillic), numbers, dashes and dots
          .replace(/--+/g, '-') // Remove multiple dashes
      .replace(/^-+|-+$/g, ''); // Remove dashes at beginning and end
  
  return fileName || 'site';
};

const generateSitemapPHP = (siteData) => {
  const domain = siteData.headerData?.domain || 'example.com';
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const currentDate = new Date().toISOString().replace('Z', '+00:00');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/index.php</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/merci.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy.html</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;
};

const generateSections = (siteData) => {
  // Исключаем контактную секцию из обычных секций - она обрабатывается отдельно
  console.log('🔍 All sections before filtering:', siteData.sectionsData?.map(s => ({id: s.id, title: s.title})));
  
  const regularSections = siteData.sectionsData.filter(section => {
    const isContact = section.id === 'contact' || 
                     section.title === 'Contact Us' || 
                     section.title?.toLowerCase().includes('contact') ||
                     section.title?.toLowerCase().includes('контакт') ||
                     section.id === 'contacts';
    
    if (isContact) {
      console.log('🚫 Excluding contact section:', section.id, section.title);
    }
    return !isContact;
  });
  
  console.log('✅ Regular sections after filtering:', regularSections.map(s => ({id: s.id, title: s.title})));
  return regularSections.map(section => generateSectionHTML(section)).join('');
};

function generateSectionHTML(section) {
  // RADICALLY CHANGED CODE FOR TESTING
  if (section.cardType === 'none') {
    // Very noticeable red background
    return `
      <section style="background: #ff0000; padding: 20px; color: white; border: 10px solid yellow;">
        <h1 style="color: white; font-size: 36px; text-align: center;">⚠️ CHANGED ⚠️</h1>
        <h2 style="color: yellow; font-size: 24px;">${section.title || 'SECTION CHANGED'}</h2>
        ${section.description ? `<p style="color: white; font-size: 18px;">${section.description}</p>` : ''}
        <div style="margin-top: 20px;">
          ${(section.cards || []).map(card => `
            <div style="background: rgba(0,0,0,0.5); padding: 15px; margin: 10px 0; border-radius: 10px;">
              <h3 style="color: yellow; font-size: 20px;">${card.title || 'TITLE'}</h3>
              <p style="color: white;">${card.text || card.content || 'TEXT CHANGED'}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="section">
      <div class="section-content">
        <h2 class="section-title">${section.title || ''}</h2>
        ${section.description ? `
          <p class="section-description">${section.description}</p>
        ` : ''}
        <div class="cards-container">
          ${section.cards.map((card, index) => generateCardHTML(card, section.cardType, index)).join('')}
        </div>
      </div>
    </section>
  `;
}

function generateCardHTML(card, cardType, index) {
  const cardStyles = [];
  
  if (card.backgroundColor) {
    cardStyles.push(`--card-bg-color: ${card.backgroundColor}`);
  } else if (card.gradientStart && card.gradientEnd) {
    cardStyles.push(`--card-gradient-start: ${card.gradientStart}`);
    cardStyles.push(`--card-gradient-end: ${card.gradientEnd}`);
  }

  if (card.titleColor) {
    cardStyles.push(`--card-title-color: ${card.titleColor}`);
  }
  if (card.textColor) {
    cardStyles.push(`--card-text-color: ${card.textColor}`);
  }

  cardStyles.push(`--index: ${index}`);

  return `
    <div class="card" data-card-id="${card.id || ''}" style="${cardStyles.join('; ')}">
      ${card.imagePath ? `
        <div class="card-image">
          <img src="${card.imagePath}" alt="${card.title || ''}" loading="lazy">
        </div>
      ` : ''}
      <div class="card-content">
        ${card.title ? `<h3 class="card-title">${card.title}</h3>` : ''}
        ${card.text ? `<p class="card-text">${card.text}</p>` : ''}
        ${card.buttonText ? `
          <a href="${card.buttonLink || '#'}" class="card-button">
            ${card.buttonText}
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

const generateContactSection = (siteData) => {
  let contactData = siteData.contactData;
  console.log('🔍 generateContactSection called with siteData keys:', Object.keys(siteData));
  console.log('🔍 Full contactData structure:', JSON.stringify(contactData, null, 2));
  
  if (!contactData || !contactData.title) {
    console.log('❌ No contact data or title found, checking alternative locations...');
    
    // Проверяем альтернативные места где могут храниться данные контактов
    if (siteData.contact) {
      console.log('🔍 Found contact data in siteData.contact:', siteData.contact);
      contactData = siteData.contact;
    } else if (siteData.contactSection) {
      console.log('🔍 Found contact data in siteData.contactSection:', siteData.contactSection);
      contactData = siteData.contactSection;
    }
    
    if (!contactData || !contactData.title) {
      console.log('❌ Still no contact data found, returning empty string');
      return '';
    }
  }

  // Создаем inline стили для контактной секции на основе contactData
  const sectionStyles = [];
  
  console.log('🎨 Checking background styles in contactData...');
  console.log('🔍 backgroundType:', contactData.backgroundType);
  console.log('🔍 gradientColor1:', contactData.gradientColor1);
  console.log('🔍 gradientColor2:', contactData.gradientColor2);
  console.log('🔍 backgroundColor:', contactData.backgroundColor);
  
  // Улучшенная логика для фонов - проверяем разные варианты хранения данных
  if (contactData.backgroundType === 'gradient') {
    if (contactData.gradientColor1 && contactData.gradientColor2) {
      sectionStyles.push(`background: linear-gradient(${contactData.gradientDirection || 'to bottom'}, ${contactData.gradientColor1}, ${contactData.gradientColor2})`);
      console.log('✅ Applied gradient background:', contactData.gradientColor1, contactData.gradientColor2);
    }
  } else if (contactData.backgroundColor) {
    sectionStyles.push(`background-color: ${contactData.backgroundColor}`);
    console.log('✅ Applied solid background:', contactData.backgroundColor);
  }
  
  // Проверяем альтернативные названия полей для фонов
  if (!sectionStyles.length) {
    console.log('❌ No primary background found, checking alternatives...');
    
    const possibleBgFields = [
      'sectionBackgroundColor', 'bgColor', 'background', 'bg',
      'primaryColor', 'mainColor', 'themeColor'
    ];
    
    for (const field of possibleBgFields) {
      if (contactData[field]) {
        sectionStyles.push(`background-color: ${contactData[field]}`);
        console.log(`✅ Applied ${field}:`, contactData[field]);
        break;
      }
    }
    
    // Проверяем градиенты в альтернативных полях
    const possibleGradientFields = [
      ['gradientStart', 'gradientEnd'],
      ['gradient1', 'gradient2'],
      ['color1', 'color2'],
      ['startColor', 'endColor']
    ];
    
    for (const [field1, field2] of possibleGradientFields) {
      if (contactData[field1] && contactData[field2]) {
        sectionStyles.push(`background: linear-gradient(to bottom, ${contactData[field1]}, ${contactData[field2]})`);
        console.log(`✅ Applied gradient ${field1}/${field2}:`, contactData[field1], contactData[field2]);
        break;
      }
    }
  }
  
  // Принудительно применяем хотя бы какой-то фон для тестирования
  if (!sectionStyles.length) {
    console.log('⚠️  No background found anywhere, applying test background');
    sectionStyles.push(`background: linear-gradient(45deg, #ff0000, #00ff00)`);
    sectionStyles.push(`border: 5px solid yellow`);
    sectionStyles.push(`padding: 20px`);
  }
  
  // Стили для форм и информационных блоков
  const formStyles = [];
  const infoStyles = [];
  
  if (contactData.formBackgroundColor) {
    formStyles.push(`background-color: ${contactData.formBackgroundColor}`);
  }
  if (contactData.formBorderColor) {
    formStyles.push(`border: 1px solid ${contactData.formBorderColor}`);
  }
  
  if (contactData.infoBackgroundColor) {
    infoStyles.push(`background-color: ${contactData.infoBackgroundColor}`);
  }
  if (contactData.infoBorderColor) {
    infoStyles.push(`border: 1px solid ${contactData.infoBorderColor}`);
  }

  console.log('🎨 Final section styles:', sectionStyles);
  console.log('📋 Form styles:', formStyles);
  console.log('ℹ️ Info styles:', infoStyles);

  return `
    <section id="contact" class="contact-section" style="${sectionStyles.join('; ')}">
      <div class="contact-container">
        <div class="contact-header">
          <h2 class="contact-title" style="color: ${contactData.titleColor || '#1976d2'}">${contactData.title}</h2>
          ${contactData.description ? `<p class="contact-description" style="color: ${contactData.descriptionColor || '#666666'}">${contactData.description}</p>` : ''}
        </div>
        
        <div class="contact-content">
          ${contactData.showContactForm !== false ? `
            <div class="contact-form-container" style="${formStyles.join('; ')}">
              <h3 style="color: ${contactData.titleColor || '#1976d2'}">Свяжитесь с нами</h3>
              <form class="contact-form" action="merci.html" method="post">
                <div class="form-group">
                  <label style="color: ${contactData.labelColor || '#333333'}">Имя</label>
                  <input type="text" name="name" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};">
                </div>
                <div class="form-group">
                  <label style="color: ${contactData.labelColor || '#333333'}">Email</label>
                  <input type="email" name="email" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};">
                </div>
                <div class="form-group">
                  <label style="color: ${contactData.labelColor || '#333333'}">Сообщение</label>
                  <textarea name="message" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'}; min-height: 100px;"></textarea>
                </div>
                <button type="submit" style="background-color: ${contactData.buttonColor || '#1976d2'}; color: ${contactData.buttonTextColor || '#ffffff'};">
                  Отправить
                </button>
              </form>
            </div>
          ` : ''}
          
          ${contactData.showCompanyInfo !== false ? `
            <div class="contact-info-container" style="${infoStyles.join('; ')}">
              <h3 class="info-title" style="color: ${contactData.infoTitleColor || contactData.titleColor || '#1976d2'}">Контактная информация</h3>
              <div class="contact-info">
                ${contactData.companyName ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Компания:</strong> ${contactData.companyName}</p>` : ''}
                ${contactData.phone ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Телефон:</strong> ${contactData.phone}</p>` : ''}
                ${contactData.email ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Email:</strong> ${contactData.email}</p>` : ''}
                ${contactData.address ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Адрес:</strong> ${contactData.address}</p>` : ''}
                ${contactData.workingHours ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Часы работы:</strong> ${contactData.workingHours}</p>` : ''}
              </div>
            </div>
          ` : ''}
        </div>
        
        ${contactData.showMap && contactData.mapUrl ? `
          <div class="contact-map">
            <iframe src="${contactData.mapUrl}" style="width: 100%; height: 300px; border: 0;" allowfullscreen loading="lazy"></iframe>
          </div>
        ` : ''}
      </div>
    </section>
  `;
};





