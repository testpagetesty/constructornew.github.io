import { getRandomOperatorPhoto } from '../../utils/chatPhotoProcessor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎭 API: Processing chat operator photo...');
    
    // Добавляем таймаут для обработки фото
    const photoPromise = getRandomOperatorPhoto();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Photo processing timeout')), 10000); // 10 секунд
    });
    
    const operatorPhoto = await Promise.race([photoPromise, timeoutPromise]);
    
    if (!operatorPhoto || !operatorPhoto.buffer || operatorPhoto.buffer.length === 0) {
      console.warn('❌ API: No valid photo data received');
      return res.status(404).json({ 
        error: 'No photos available or processing failed' 
      });
    }

    // Возвращаем фото как бинарные данные
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', operatorPhoto.buffer.length);
    res.setHeader('X-Original-File', operatorPhoto.originalFile);
    res.setHeader('X-Photo-Size', operatorPhoto.size.toString());
    res.setHeader('X-Processing-Time', Date.now().toString());
    
    console.log(`✅ API: Returning optimized photo: ${operatorPhoto.originalFile} (${operatorPhoto.size} bytes)`);
    
    res.status(200).send(operatorPhoto.buffer);

  } catch (error) {
    console.error('❌ API Error processing chat operator photo:', error);
    
    if (error.message === 'Photo processing timeout') {
      res.status(408).json({ 
        error: 'Photo processing timeout - server is busy',
        details: 'Try again in a few seconds'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to process chat operator photo',
        details: error.message 
      });
    }
  }
} 