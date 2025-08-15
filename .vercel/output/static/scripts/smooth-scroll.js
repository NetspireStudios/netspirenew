import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.isInitialized = false;
    this.isTouch = false;
    
    this.init();
  }
  
  init() {
    // Check if touch device
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip smooth scrolling for users who prefer reduced motion
      this.initScrollTrigger();
      return;
    }
    
    this.createLenis();
    this.bindEvents();
    this.startRAF();
    this.initScrollTrigger();
    
    this.isInitialized = true;
  }
  
  createLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
      autoResize: true,
      syncTouch: false
    });
    
    // Add Lenis class to html
    document.documentElement.classList.add('lenis');
  }
  
  bindEvents() {
    // Scroll event
    this.lenis.on('scroll', (e) => {
      this.onScroll(e);
    });
    
    // Update ScrollTrigger on Lenis scroll
    this.lenis.on('scroll', ScrollTrigger.update);
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.lenis.resize();
    });
    
    // Handle route changes (for SPAs)
    window.addEventListener('popstate', () => {
      this.scrollToTop();
    });
    
    // Prevent scroll during preloader
    document.addEventListener('preloaderComplete', () => {
      this.enable();
    });
  }
  
  startRAF() {
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    
    requestAnimationFrame(raf);
  }
  
  initScrollTrigger() {
    // Configure ScrollTrigger to work with Lenis
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          this.lenis && this.lenis.scrollTo(value, { duration: 0, immediate: true });
        }
        return this.lenis ? this.lenis.animatedScroll : window.pageYOffset;
      },
      
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    });
    
    // Update ScrollTrigger when Lenis updates
    ScrollTrigger.addEventListener('refresh', () => {
      this.lenis && this.lenis.resize();
    });
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }
  
  onScroll(e) {
    // Custom scroll events can be handled here
    this.updateScrollProgress(e.progress);
    this.handleScrollDirection(e.direction);
  }
  
  updateScrollProgress(progress) {
    // Update CSS custom property for scroll progress
    document.documentElement.style.setProperty('--scroll-progress', progress);
    
    // Dispatch custom scroll progress event
    const event = new CustomEvent('scrollProgress', {
      detail: { progress }
    });
    document.dispatchEvent(event);
  }
  
  handleScrollDirection(direction) {
    // Add classes based on scroll direction
    if (direction === 1) {
      document.body.classList.add('scroll-down');
      document.body.classList.remove('scroll-up');
    } else if (direction === -1) {
      document.body.classList.add('scroll-up');
      document.body.classList.remove('scroll-down');
    }
  }
  
  // Public methods
  scrollTo(target, options = {}) {
    if (!this.lenis) return;
    
    const defaultOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    };
    
    this.lenis.scrollTo(target, defaultOptions);
  }
  
  scrollToTop(options = {}) {
    this.scrollTo(0, options);
  }
  
  scrollToElement(element, options = {}) {
    if (!element) return;
    
    const defaultOptions = {
      offset: 0,
      ...options
    };
    
    this.scrollTo(element, defaultOptions);
  }
  
  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }
  
  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }
  
  disable() {
    if (this.lenis) {
      this.lenis.stop();
      document.body.classList.add('lenis-disabled');
    }
  }
  
  enable() {
    if (this.lenis) {
      this.lenis.start();
      document.body.classList.remove('lenis-disabled');
    }
  }
  
  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
      document.documentElement.classList.remove('lenis');
      document.body.classList.remove('scroll-up', 'scroll-down', 'lenis-disabled');
    }
    
    this.isInitialized = false;
  }
  
  // Utility methods for smooth scrolling to sections
  scrollToSection(sectionId, options = {}) {
    const section = document.getElementById(sectionId);
    if (section) {
      this.scrollToElement(section, {
        offset: -100, // Account for fixed header
        ...options
      });
    }
  }
  
  // Method to temporarily disable smooth scrolling
  disableTemporarily(duration = 1000) {
    this.disable();
    setTimeout(() => {
      this.enable();
    }, duration);
  }
  
  // Get current scroll position
  getScrollY() {
    return this.lenis ? this.lenis.animatedScroll : window.pageYOffset;
  }
  
  // Check if scrolling is at top
  isAtTop() {
    return this.getScrollY() <= 0;
  }
  
  // Check if scrolling is at bottom
  isAtBottom() {
    const scrollY = this.getScrollY();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    return scrollY + windowHeight >= documentHeight - 10; // 10px threshold
  }
}

// Singleton instance
let smoothScrollInstance = null;

// Initialize smooth scroll
function initSmoothScroll() {
  if (!smoothScrollInstance) {
    smoothScrollInstance = new SmoothScroll();
    
    // Make instance globally available
    window.smoothScroll = smoothScrollInstance;
    
    // Add smooth scroll navigation functionality
    addSmoothScrollNavigation();
  }
  
  return smoothScrollInstance;
}

// Add smooth scroll to navigation links
function addSmoothScrollNavigation() {
  // Handle anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    
    if (link && smoothScrollInstance) {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        smoothScrollInstance.scrollToElement(target, {
          offset: -80 // Account for header height
        });
      }
    }
  });
  
  // Handle navigation menu items
  const navItems = document.querySelectorAll('[data-scroll-to]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = item.getAttribute('data-scroll-to');
      if (smoothScrollInstance) {
        smoothScrollInstance.scrollToSection(targetId);
      }
    });
  });
}

// Auto-initialize after preloader
document.addEventListener('preloaderComplete', () => {
  setTimeout(() => {
    initSmoothScroll();
  }, 100);
});

// Fallback initialization
if (!window.smoothScrollInitialized) {
  window.smoothScrollInitialized = true;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Only initialize if preloader hasn't completed yet
      setTimeout(() => {
        if (!smoothScrollInstance) {
          initSmoothScroll();
        }
      }, 1000);
    });
  }
}

export { SmoothScroll, initSmoothScroll, smoothScrollInstance }; 