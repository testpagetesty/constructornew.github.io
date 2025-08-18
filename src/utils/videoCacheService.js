const CACHE_NAME = 'site-videos-cache-v1';
const METADATA_CACHE_NAME = 'site-videos-metadata-v1';

class VideoCacheService {
  constructor() {
    this.db = null;
    this.dbName = 'site-videos-db';
    this.storeName = 'videos';
    this.init();
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async saveVideo(key, file) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(file, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving video to cache:', error);
      throw error;
    }
  }

  async getVideo(key) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting video from cache:', error);
      throw error;
    }
  }

  async deleteVideo(key) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting video from cache:', error);
      throw error;
    }
  }

  async saveMetadata(key, metadata) {
    try {
      localStorage.setItem(key, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw error;
    }
  }

  getMetadata(key) {
    try {
      const metadata = localStorage.getItem(key);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      console.error('Error getting metadata:', error);
      return null;
    }
  }

  deleteMetadata(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting metadata:', error);
    }
  }

  // Получить все видео из кэша с ключами
  async getAllVideos() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = async () => {
          try {
            const keys = request.result;
            const videosWithKeys = [];
            
            for (const key of keys) {
              try {
                const video = await this.getVideo(key);
                if (video) {
                  videosWithKeys.push({
                    key: key,
                    value: video,
                    name: key,
                    blob: video,
                    size: video.size || 0,
                    type: video.type || 'video/mp4'
                  });
                }
              } catch (videoError) {
                console.warn(`Error getting video with key ${key}:`, videoError);
              }
            }
            
            resolve(videosWithKeys);
          } catch (error) {
            reject(error);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all videos from cache:', error);
      throw error;
    }
  }

  // Очистить весь кэш видео
  async clearCache() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing video cache:', error);
      throw error;
    }
  }

  // Получить все ключи видео из кэша
  async getAllVideoKeys() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all video keys from cache:', error);
      throw error;
    }
  }

  // Получить размер кэша
  async getCacheSize() {
    try {
      const videos = await this.getAllVideos();
      return videos.reduce((total, video) => total + (video.size || 0), 0);
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  // Простой метод для получения всех видео (более надежный)
  async getAllVideosSimple() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const videos = request.result;
          console.log('Raw videos from IndexedDB:', videos);
          
          // Преобразуем в нужный формат
          const formattedVideos = videos.map((video, index) => ({
            key: `video_${index}`,
            value: video,
            name: `video_${index}`,
            blob: video,
            size: video.size || 0,
            type: video.type || 'video/mp4'
          }));
          
          console.log('Formatted videos:', formattedVideos);
          resolve(formattedVideos);
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all videos simple:', error);
      throw error;
    }
  }
}

export const videoCacheService = new VideoCacheService();
