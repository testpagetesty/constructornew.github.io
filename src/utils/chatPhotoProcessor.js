import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Функция для получения случайного фото оператора и его оптимизации
export const getRandomOperatorPhoto = async () => {
  try {
    console.log('🎭 Selecting random operator photo...');
    
    const chatImagesDir = path.join(process.cwd(), 'public', 'images', 'chat');
    
    // Проверяем существование папки
    if (!fs.existsSync(chatImagesDir)) {
      console.warn('❌ Chat images directory not found:', chatImagesDir);
      return null;
    }

    // Получаем список всех изображений в папке
    const files = fs.readdirSync(chatImagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.jfif'].includes(ext) && file !== 'operator.jpg';
    });

    if (imageFiles.length === 0) {
      console.warn('❌ No images found in chat directory:', chatImagesDir);
      return null;
    }

    console.log(`📁 Found ${imageFiles.length} images in chat directory`);

    // Случайно выбираем фото
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const selectedFile = imageFiles[randomIndex];
    const selectedPath = path.join(chatImagesDir, selectedFile);

    console.log(`🎲 Selected random photo: ${selectedFile}`);

    // Проверяем существование файла
    if (!fs.existsSync(selectedPath)) {
      console.warn(`❌ Selected file does not exist: ${selectedPath}`);
      return null;
    }

    // Проверяем размер файла
    const stats = fs.statSync(selectedPath);
    if (stats.size === 0) {
      console.warn(`❌ Selected file is empty: ${selectedFile}`);
      return null;
    }

    console.log(`📊 File size: ${stats.size} bytes`);

    // Оптимизируем изображение для чата
    const optimizedBuffer = await sharp(selectedPath)
      .resize(64, 64, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 90,
        progressive: true
      })
      .toBuffer();

    if (!optimizedBuffer || optimizedBuffer.length === 0) {
      console.warn('❌ Optimization produced empty buffer');
      return null;
    }

    console.log(`✅ Photo optimized: ${optimizedBuffer.length} bytes`);

    return {
      buffer: optimizedBuffer,
      originalFile: selectedFile,
      size: optimizedBuffer.length
    };

  } catch (error) {
    console.error('❌ Error processing operator photo:', error);
    
    // Более детальная информация об ошибке
    if (error.code === 'ENOENT') {
      console.error('❌ File not found error');
    } else if (error.message.includes('sharp')) {
      console.error('❌ Sharp image processing error');
    } else if (error.message.includes('permission')) {
      console.error('❌ Permission denied error');
    }
    
    return null;
  }
}; 