/**
 * Сервис для обработки видео
 * Включает функциональность для удаления постбека (логотипа) из видео
 */

class VideoProcessor {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.video = null;
  }

  /**
   * Инициализация canvas для обработки видео
   */
  initCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  /**
   * Создание временного видео элемента для обработки
   */
  createVideoElement() {
    if (!this.video) {
      this.video = document.createElement('video');
      this.video.muted = true;
      this.video.playsInline = true;
    }
  }

  /**
   * Обработка видео для удаления постбека
   * @param {File|Blob} videoFile - исходный видео файл
   * @param {Object} options - опции обработки
   * @param {number} options.cropBottom - количество пикселей для обрезки снизу (по умолчанию 60)
   * @param {number} options.cropRight - количество пикселей для обрезки справа (по умолчанию 60)
   * @param {number} options.cropTop - количество пикселей для обрезки сверху (по умолчанию 0)
   * @param {number} options.cropLeft - количество пикселей для обрезки слева (по умолчанию 0)
   * @returns {Promise<Blob>} - обработанное видео
   */
  async processVideoForPostback(videoFile, options = {}) {
    const {
      cropBottom = 60,    // По умолчанию обрезаем 60px снизу
      cropRight = 60,     // По умолчанию обрезаем 60px справа
      cropTop = 0,        // Сверху не обрезаем
      cropLeft = 0        // Слева не обрезаем
    } = options;

    return new Promise((resolve, reject) => {
      try {
        this.createVideoElement();
        this.initCanvas();

        const videoUrl = URL.createObjectURL(videoFile);
        
        this.video.onloadedmetadata = () => {
          const originalWidth = this.video.videoWidth;
          const originalHeight = this.video.videoHeight;
          
          // Вычисляем новые размеры после обрезки
          const newWidth = originalWidth - cropLeft - cropRight;
          const newHeight = originalHeight - cropTop - cropBottom;
          
          // Устанавливаем размеры canvas
          this.canvas.width = newWidth;
          this.canvas.height = newHeight;
          
          console.log(`🎬 Обработка видео: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
          console.log(`✂️ Обрезка: верх=${cropTop}, низ=${cropBottom}, лево=${cropLeft}, право=${cropRight}`);
          
          // Начинаем обработку кадров
          this.processVideoFrames(videoUrl, newWidth, newHeight, cropLeft, cropTop, resolve, reject);
        };
        
        this.video.onerror = () => {
          reject(new Error('Ошибка загрузки видео'));
        };
        
        this.video.src = videoUrl;
        this.video.load();
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Обработка кадров видео
   */
  async processVideoFrames(videoUrl, newWidth, newHeight, cropLeft, cropTop, resolve, reject) {
    try {
      const mediaRecorder = new MediaRecorder(this.canvas.captureStream(30), {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const processedVideo = new Blob(chunks, { type: 'video/webm' });
        console.log(`✅ Видео обработано: ${processedVideo.size} байт`);
        resolve(processedVideo);
      };
      
      mediaRecorder.start();
      
      // Обрабатываем видео по кадрам
      this.video.currentTime = 0;
      this.video.play();
      
      const processFrame = () => {
        if (this.video.ended || this.video.paused) {
          mediaRecorder.stop();
          return;
        }
        
        // Рисуем кадр с обрезкой
        this.ctx.drawImage(
          this.video,
          cropLeft, cropTop, newWidth, newHeight,  // источник (с обрезкой)
          0, 0, newWidth, newHeight                 // назначение (полный canvas)
        );
        
        // Продолжаем обработку
        requestAnimationFrame(processFrame);
      };
      
      processFrame();
      
    } catch (error) {
      reject(error);
    }
  }

  /**
   * Автоматическое определение области постбека и его удаление
   * @param {File|Blob} videoFile - исходный видео файл
   * @returns {Promise<Blob>} - обработанное видео
   */
  async autoRemovePostback(videoFile) {
    // По умолчанию используем консервативные настройки обрезки
    // которые должны убрать большинство постбеков
    return this.processVideoForPostback(videoFile, {
      cropBottom: 80,   // Увеличиваем обрезку снизу для надежности
      cropRight: 80,    // Увеличиваем обрезку справа для надежности
      cropTop: 0,
      cropLeft: 0
    });
  }

  /**
   * Получение информации о видео
   * @param {File|Blob} videoFile - видео файл
   * @returns {Promise<Object>} - информация о видео
   */
  async getVideoInfo(videoFile) {
    return new Promise((resolve, reject) => {
      this.createVideoElement();
      
      const videoUrl = URL.createObjectURL(videoFile);
      
      this.video.onloadedmetadata = () => {
        const info = {
          width: this.video.videoWidth,
          height: this.video.videoHeight,
          duration: this.video.duration,
          size: videoFile.size,
          type: videoFile.type
        };
        
        URL.revokeObjectURL(videoUrl);
        resolve(info);
      };
      
      this.video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Не удалось получить информацию о видео'));
      };
      
      this.video.src = videoUrl;
      this.video.load();
    });
  }

  /**
   * Очистка ресурсов
   */
  cleanup() {
    if (this.video) {
      this.video.src = '';
      this.video = null;
    }
    if (this.canvas) {
      this.canvas = null;
      this.ctx = null;
    }
  }
}

export const videoProcessor = new VideoProcessor();
