import { gsap } from 'gsap';

// Enhanced Preloader with Cinematic Design
class Preloader {
  constructor() {
    this.preloader = null;
    this.isComplete = false;
    this.images = [];
    this.progressBar = null;
    this.progressText = null;
    this.logoText = null;
    this.currentImageIndex = 0;
    
    // Enhanced image themes with beautiful patterns
    this.imageData = [
      {
        id: 'geometric',
        title: 'GEOMETRIC',
        pattern: this.createGeometricPattern(),
        color: '#6366f1'
      },
      {
        id: 'organic',
        title: 'ORGANIC',
        pattern: this.createOrganicPattern(),
        color: '#8b5cf6'
      },
      {
        id: 'minimal',
        title: 'MINIMAL',
        pattern: this.createMinimalPattern(),
        color: '#06b6d4'
      },
      {
        id: 'dynamic',
        title: 'DYNAMIC',
        pattern: this.createDynamicPattern(),
        color: '#f59e0b'
      }
    ];
    
    this.init();
  }
  
  init() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded, skipping preloader');
      this.completeImmediately();
      return;
    }
    
    this.createPreloader();
    this.bindEvents();
    this.startAnimation();
  }
  
  createGeometricPattern() {
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="geometric-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <rect x="40" y="40" width="120" height="120" fill="url(#geometric-grad)" rx="8"/>
        <rect x="60" y="60" width="80" height="80" fill="none" stroke="white" stroke-width="2" rx="4"/>
        <circle cx="100" cy="100" r="25" fill="white" opacity="0.8"/>
        <polygon points="100,85 110,105 90,105" fill="#6366f1"/>
      </svg>
    `;
  }
  
  createOrganicPattern() {
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="organic-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.3" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="80" ry="60" fill="url(#organic-grad)" transform="rotate(30 100 100)"/>
        <ellipse cx="100" cy="100" rx="50" ry="70" fill="none" stroke="white" stroke-width="2" opacity="0.6" transform="rotate(-15 100 100)"/>
        <circle cx="100" cy="100" r="20" fill="white" opacity="0.8"/>
      </svg>
    `;
  }
  
  createMinimalPattern() {
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="minimal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <rect x="50" y="50" width="100" height="100" fill="url(#minimal-grad)" rx="50"/>
        <rect x="70" y="70" width="60" height="60" fill="none" stroke="white" stroke-width="1" rx="30"/>
        <line x1="100" y1="60" x2="100" y2="140" stroke="white" stroke-width="2" opacity="0.8"/>
        <line x1="60" y1="100" x2="140" y2="100" stroke="white" stroke-width="2" opacity="0.8"/>
      </svg>
    `;
  }
  
  createDynamicPattern() {
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dynamic-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.4" />
          </radialGradient>
        </defs>
        <polygon points="100,30 170,100 100,170 30,100" fill="url(#dynamic-grad)"/>
        <polygon points="100,50 150,100 100,150 50,100" fill="none" stroke="white" stroke-width="2"/>
        <circle cx="100" cy="100" r="15" fill="white" opacity="0.9"/>
        <polygon points="100,90 105,100 100,110 95,100" fill="#f59e0b"/>
      </svg>
    `;
  }
  
  createPreloader() {
    this.preloader = document.createElement('div');
    this.preloader.className = 'preloader';
    
    this.preloader.innerHTML = `
      <div class="preloader-background">
        <div class="background-gradient"></div>
        <div class="background-noise"></div>
      </div>
      
      <div class="preloader-content">
        <div class="logo-container">
          <div class="logo-text">NETSPIRE</div>
          <div class="logo-subtitle">Digital Innovation</div>
        </div>
        
        <div class="images-container">
          ${this.imageData.map((data, index) => `
            <div class="preloader-image" data-theme="${data.id}" style="--accent-color: ${data.color}">
              <div class="image-pattern">${data.pattern}</div>
              <div class="image-overlay">
                <span class="image-title">${data.title}</span>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text">
            <span class="progress-percentage">0%</span>
            <span class="progress-label">Loading Experience</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.preloader);
    
    // Cache elements
    this.images = this.preloader.querySelectorAll('.preloader-image');
    this.progressBar = this.preloader.querySelector('.progress-fill');
    this.progressText = this.preloader.querySelector('.progress-percentage');
    this.logoText = this.preloader.querySelector('.logo-text');
    
    // Set initial states
    gsap.set(this.images, { 
      scale: 0.8, 
      opacity: 0, 
      rotationY: 180 
    });
    
    gsap.set('.logo-container', { 
      opacity: 0, 
      y: 50 
    });
    
    gsap.set('.progress-container', { 
      opacity: 0, 
      y: 30 
    });
  }
  
  bindEvents() {
    // Handle click to skip (optional)
    this.preloader.addEventListener('click', () => {
      if (!this.isComplete) {
        this.skipToEnd();
      }
    });
  }
  
  startAnimation() {
    if (this.isComplete) return;
    
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => this.revealWebsite(), 800);
      }
    });
    
    // Logo entrance
    tl.to('.logo-container', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })
    
    // Progress bar entrance
    .to('.progress-container', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    
    // Sequential image reveals with progress
    .add(() => {
      this.animateImagesSequence();
    }, '-=0.2');
  }
  
  animateImagesSequence() {
    const duration = 3000; // Total duration
    const intervalDuration = duration / this.images.length;
    let currentProgress = 0;
    
    const revealImage = (index) => {
      if (index >= this.images.length) {
        this.updateProgress(100);
        return;
      }
      
      const image = this.images[index];
      const progress = ((index + 1) / this.images.length) * 100;
      
      // Reveal current image
      gsap.to(image, {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
      
      // Update progress
      this.animateProgress(currentProgress, progress, 500);
      currentProgress = progress;
      
      // Add micro-interaction
      gsap.to(image, {
        rotationZ: '+=5',
        duration: 0.3,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      });
      
      // Schedule next image
      setTimeout(() => {
        // Hide current image
        gsap.to(image, {
          scale: 0.9,
          opacity: 0.3,
          duration: 0.4,
          ease: 'power2.in'
        });
        
        revealImage(index + 1);
      }, intervalDuration);
    };
    
    revealImage(0);
  }
  
  animateProgress(from, to, duration) {
    gsap.to({ value: from }, {
      value: to,
      duration: duration / 1000,
      ease: 'power2.out',
      onUpdate: function() {
        const progress = Math.round(this.targets()[0].value);
        if (this.progressText) {
          this.progressText.textContent = `${progress}%`;
        }
        if (this.progressBar) {
          this.progressBar.style.width = `${progress}%`;
        }
      }.bind(this)
    });
  }
  
  updateProgress(percentage) {
    if (this.progressText) {
      this.progressText.textContent = `${percentage}%`;
    }
    if (this.progressBar) {
      gsap.to(this.progressBar, {
        width: `${percentage}%`,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
  
  skipToEnd() {
    gsap.killTweensOf('*');
    this.updateProgress(100);
    setTimeout(() => this.revealWebsite(), 300);
  }
  
  revealWebsite() {
    if (this.isComplete) return;
    
    this.isComplete = true;
    
    const tl = gsap.timeline({
      onComplete: () => {
        this.preloader.remove();
        this.dispatchComplete();
      }
    });
    
    // Cinematic exit animation
    tl.to('.preloader-content', {
      scale: 1.1,
      opacity: 0,
      filter: 'blur(20px)',
      duration: 0.8,
      ease: 'power2.in'
    })
    
    .to('.preloader-background', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.4')
    
    .to(this.preloader, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: 1.2,
      ease: 'power4.inOut'
    }, '-=0.6');
  }
  
  completeImmediately() {
    this.isComplete = true;
    this.dispatchComplete();
  }
  
  dispatchComplete() {
    const event = new CustomEvent('preloaderComplete', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }
}

// Global initialization function
window.initPreloader = function() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, preloader disabled');
    return;
  }
  
  // Initialize preloader
  window.preloaderInstance = new Preloader();
  
  console.log('Enhanced preloader initialized');
};

// Auto-initialize if DOM is ready and GSAP is available
if (document.readyState !== 'loading' && typeof gsap !== 'undefined') {
  window.initPreloader();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      window.initPreloader();
    }
  });
} 