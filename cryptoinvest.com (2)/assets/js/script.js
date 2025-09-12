
      document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Close menu when clicking a link
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Smooth scroll to anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Form submission handler
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Send form data
          fetch('https://formspree.io/f/mqalqbeo', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          }).finally(() => {
            // Always redirect to merci.html
            window.location.href = 'merci.html';
          });
        };

        // Cards and images scroll animation
        const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-on-scroll');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        animatedEls.forEach(el => observer.observe(el));
        
        // Initialize automatic image slideshows
        initImageGalleries();
        
      });
      
      // Function to initialize all image galleries on the page
      function initImageGalleries() {
        const galleries = document.querySelectorAll('.section-gallery');
        
        galleries.forEach(gallery => {
          const images = gallery.querySelectorAll('.gallery-img');
          const dots = gallery.querySelectorAll('.gallery-dot');
          let currentIndex = 0;
          let interval = null;
          
          // If there are less than 2 images, do nothing
          if (images.length < 2) return;
          
          // Function to switch slides
          function showSlide(index) {
                          // Hide all images
            images.forEach(img => img.style.display = 'none');
            
                          // Reset active dots
            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
            
                          // Show selected image
            if (images[index]) {
              images[index].style.display = 'block';
            }
            
                          // Update active dot
            if (dots[index]) {
              dots[index].style.backgroundColor = '#ffffff';
            }
            
            currentIndex = index;
          }
          
          // Set handlers for navigation dots
          dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              clearInterval(interval); // Stop auto-scroll on manual switch
              showSlide(index);
                              startAutoScroll(); // Restart auto-scroll
            });
          });
          
          // Function to start auto-scroll
          function startAutoScroll() {
                          // Clear previous interval if it exists
            if (interval) {
              clearInterval(interval);
            }
            
                          // Set new interval
            interval = setInterval(() => {
              const nextIndex = (currentIndex + 1) % images.length;
              showSlide(nextIndex);
            }, 3000); // 3 seconds interval between slides
          }
          
          // Add handlers to stop auto-scroll on hover
          gallery.addEventListener('mouseenter', () => {
            clearInterval(interval);
          });
          
          gallery.addEventListener('mouseleave', () => {
            startAutoScroll();
          });
          
          // Start auto-scroll on load
          startAutoScroll();
          
          // Add swipe on mobile devices
          let touchStartX = 0;
          let touchEndX = 0;
          
          gallery.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
          }, false);
          
          gallery.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          }, false);
          
          function handleSwipe() {
            if (touchEndX < touchStartX) {
              // Swipe left - next slide
              clearInterval(interval);
              showSlide((currentIndex + 1) % images.length);
              startAutoScroll();
            } else if (touchEndX > touchStartX) {
              // Swipe right - previous slide
              clearInterval(interval);
              showSlide((currentIndex - 1 + images.length) % images.length);
              startAutoScroll();
            }
          }
        });
      }
      
      
      // Мгновенное появление hero секции
      document.addEventListener('DOMContentLoaded', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.style.opacity = '1';
          
          // Принудительно убираем рамки с hero секции
          hero.style.border = 'none';
          hero.style.outline = 'none';
          hero.style.boxShadow = 'none';
          
          // Убираем рамки со всех дочерних элементов
          const allElements = hero.querySelectorAll('*');
          allElements.forEach(element => {
            if (element.style) {
              element.style.border = 'none';
              element.style.outline = 'none';
              element.style.boxShadow = 'none';
            }
          });
        }
      });

      // Мгновенное появление контента
      document.addEventListener('DOMContentLoaded', function() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.opacity = '1';
        }
      });

      // Быстрое появление секций
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          const sections = document.querySelectorAll('.section');
          sections.forEach((section, index) => {
            setTimeout(() => {
              section.style.opacity = '1';
            }, index * 50);
          });
        }, 100);
      });

      // Force hide video controls and remove borders on scroll
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const heroVideo = document.getElementById('heroVideo');
          if (heroVideo) {
            // Принудительно скрываем все элементы управления
            const controls = heroVideo.querySelectorAll('*');
            controls.forEach(control => {
              if (control.style) {
                control.style.pointerEvents = 'none';
                control.style.userSelect = 'none';
              }
            });
          }
          
          // Постоянно убираем рамки с hero секции
          const hero = document.querySelector('.hero');
          if (hero) {
            hero.style.border = 'none';
            hero.style.outline = 'none';
            hero.style.boxShadow = 'none';
            
            const allElements = hero.querySelectorAll('*');
            allElements.forEach(element => {
              if (element.style) {
                element.style.border = 'none';
                element.style.outline = 'none';
                element.style.boxShadow = 'none';
              }
            });
          }
        }, 100);
      });

      // Initialize video and GIF preloading
      initializeVideoPreloading();
      
      function initializeVideoPreloading() {
        const heroVideo = document.getElementById('heroVideo');
        const heroGif = document.getElementById('heroGif');
        const videoLoadingOverlay = document.getElementById('videoLoadingOverlay');
        const gifLoadingOverlay = document.getElementById('gifLoadingOverlay');
        
        // Initialize video preloading
        if (heroVideo && videoLoadingOverlay) {
          videoLoadingOverlay.classList.remove('hidden');
          heroVideo.classList.add('loading');
          
          heroVideo.addEventListener('canplay', function() {
            heroVideo.classList.remove('loading');
            heroVideo.classList.add('loaded');
            setTimeout(() => {
              videoLoadingOverlay.classList.add('hidden');
            }, 500);
          });
          
          heroVideo.addEventListener('error', function() {
            videoLoadingOverlay.classList.add('hidden');
            heroVideo.classList.remove('loading');
          });
          
          // Force video to start loading
          heroVideo.load();
        }
        
        // Initialize GIF preloading
        if (heroGif && gifLoadingOverlay) {
          gifLoadingOverlay.classList.remove('hidden');
          heroGif.classList.add('loading');
          
          heroGif.addEventListener('load', function() {
            heroGif.classList.remove('loading');
            heroGif.classList.add('loaded');
            setTimeout(() => {
              gifLoadingOverlay.classList.add('hidden');
            }, 500);
          });
          
          heroGif.addEventListener('error', function() {
            gifLoadingOverlay.classList.add('hidden');
            heroGif.classList.remove('loading');
          });
          
          // Force GIF to start loading
          heroGif.src = heroGif.src;
        }
      }
    