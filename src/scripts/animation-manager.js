// Centralized Animation Manager for NETSPIRE
// Prevents GSAP conflicts and manages performance

class AnimationManager {
  constructor() {
    this.isInitialized = false;
    this.animations = new Map();
    this.scrollTriggers = new Set();
    this.isMobile = this.detectMobile();
    this.reducedMotion = this.detectReducedMotion();
    this.isLowPower = this.detectLowPower();
    
    console.log('🎬 Animation Manager initialized', {
      mobile: this.isMobile,
      reducedMotion: this.reducedMotion,
      lowPower: this.isLowPower
    });
  }

  // Device Detection
  detectMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  detectReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  detectLowPower() {
    return navigator.deviceMemory && navigator.deviceMemory <= 4;
  }

  // Initialize GSAP once
  async initGSAP() {
    if (this.isInitialized) return true;

    return new Promise((resolve) => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        console.log('✅ GSAP already loaded');
        this.setupGSAP();
        resolve(true);
      } else {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkGSAP = () => {
          attempts++;
          if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            console.log('✅ GSAP loaded after', attempts, 'attempts');
            this.setupGSAP();
            resolve(true);
          } else if (attempts >= maxAttempts) {
            console.warn('⚠️ GSAP failed to load, using fallback');
            resolve(false);
          } else {
            setTimeout(checkGSAP, 100);
          }
        };
        
        checkGSAP();
      }
    });
  }

  setupGSAP() {
    if (this.isInitialized) return;

    // Register plugins once
    gsap.registerPlugin(ScrollTrigger);
    
    // Global GSAP settings optimized for performance
    gsap.defaults({
      ease: 'power2.out',
      duration: this.isMobile ? 0.4 : 0.8
    });

    // ScrollTrigger performance settings
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      ignoreMobileResize: true
    });

    // Disable animations on low-power devices
    if (this.reducedMotion || this.isLowPower) {
      gsap.globalTimeline.timeScale(10); // Speed up animations dramatically
    }

    this.isInitialized = true;
    console.log('✅ GSAP centrally initialized');
  }

  // Safe animation creation with cleanup tracking
  createAnimation(id, animationFunction, cleanup = null) {
    if (this.reducedMotion) return null;

    try {
      const animation = animationFunction();
      
      // Store animation with cleanup function
      this.animations.set(id, {
        animation,
        cleanup: cleanup || (() => {
          if (animation && typeof animation.kill === 'function') {
            animation.kill();
          }
        })
      });

      return animation;
    } catch (error) {
      console.warn(`⚠️ Animation ${id} failed:`, error);
      return null;
    }
  }

  // Safe ScrollTrigger creation
  createScrollTrigger(id, config) {
    if (this.reducedMotion || !this.isInitialized) return null;

    try {
      const trigger = ScrollTrigger.create({
        ...config,
        id: id,
        // Performance optimization
        fastScrollEnd: true,
        preventOverlaps: true
      });

      this.scrollTriggers.add(trigger);
      return trigger;
    } catch (error) {
      console.warn(`⚠️ ScrollTrigger ${id} failed:`, error);
      return null;
    }
  }

  // Mobile-safe animation wrapper
  animateOnDesktop(animationFunction) {
    if (this.isMobile || this.isLowPower) {
      return null;
    }
    return animationFunction();
  }

  // Performance-aware scroll animation
  animateOnScroll(trigger, animationFunction, options = {}) {
    const defaultOptions = {
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      fastScrollEnd: true,
      ...options
    };

    return this.createScrollTrigger(`scroll-${Date.now()}`, {
      trigger,
      ...defaultOptions,
      onEnter: () => {
        if (typeof animationFunction === 'function') {
          animationFunction();
        }
      }
    });
  }

  // Cleanup all animations
  cleanup() {
    console.log('🧹 Cleaning up animations...');

    // Kill all stored animations
    this.animations.forEach((item, id) => {
      try {
        item.cleanup();
        console.log(`✅ Cleaned animation: ${id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to clean animation ${id}:`, error);
      }
    });

    // Kill all ScrollTriggers
    this.scrollTriggers.forEach(trigger => {
      try {
        trigger.kill();
      } catch (error) {
        console.warn('⚠️ Failed to kill ScrollTrigger:', error);
      }
    });

    // Clear collections
    this.animations.clear();
    this.scrollTriggers.clear();

    // Global cleanup
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

    console.log('✅ Animation cleanup complete');
  }

  // Refresh ScrollTrigger (performance-safe)
  refresh() {
    if (this.isInitialized && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Check if we should skip heavy animations
  shouldSkipHeavyAnimations() {
    return this.isMobile || this.isLowPower || this.reducedMotion;
  }
}

// Create global instance
window.animationManager = new AnimationManager();

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.animationManager) {
    window.animationManager.cleanup();
  }
});

// Auto-refresh on resize (throttled)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.animationManager) {
      window.animationManager.refresh();
    }
  }, 150);
});

export default AnimationManager; 