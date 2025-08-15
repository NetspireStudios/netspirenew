import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Enhanced Animation System with Cinematic Effects
class Animations {
  constructor() {
    this.animations = [];
    this.isInitialized = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Register GSAP plugins
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Enhanced GSAP defaults for smoother animations
      gsap.defaults({
        ease: 'power2.out',
        duration: 0.8
      });
      
      // Set ScrollTrigger defaults
      ScrollTrigger.defaults({
        toggleActions: 'play pause resume reverse',
        markers: false
      });
    }
  }
  
  init() {
    if (this.reducedMotion) {
      console.log('Reduced motion detected - using simplified animations');
      this.initSimplifiedAnimations();
      return;
    }
    
    // Wait for fonts and initial content to load
    Promise.all([
      document.fonts.ready,
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      })
    ]).then(() => {
      this.initializeAnimations();
      this.setupScrollAnimations();
      this.setupHoverAnimations();
      this.setupUtilityAnimations();
      this.setupCinematicEffects();
      
      this.isInitialized = true;
      console.log('Enhanced animations initialized');
    });
  }
  
  initializeAnimations() {
    // Enhanced GSAP settings for smoother performance
    gsap.set('*', { willChange: 'auto' });
    
    // Create master timeline for coordinated animations
    this.masterTimeline = gsap.timeline({ paused: true });
    
    // Refresh ScrollTrigger after initialization
    ScrollTrigger.refresh();
  }
  
  setupCinematicEffects() {
    // Cinematic page entrance animation
    this.createPageEntranceAnimation();
    
    // Enhanced parallax system
    this.setupEnhancedParallax();
    
    // Magnetic hover effects
    this.setupMagneticEffects();
    
    // Smooth morphing backgrounds
    this.setupMorphingBackgrounds();
    
    // Advanced text animations
    this.setupAdvancedTextAnimations();
  }
  
  createPageEntranceAnimation() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const tl = gsap.timeline({ delay: 0.5 });
    
    // Create cinematic reveal
    tl.set(mainContent, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' })
      .to(mainContent, {
        clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
        duration: 1.6,
        ease: 'power4.inOut'
      });
    
    this.animations.push(tl);
  }
  
  setupEnhancedParallax() {
    // Multi-layer parallax system
    const parallaxLayers = document.querySelectorAll('[data-parallax]');
    
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.dataset.parallax) || 0.5;
      const direction = layer.dataset.parallaxDirection || 'vertical';
      
      let animationProps = { ease: 'none' };
      
      if (direction === 'horizontal') {
        animationProps.xPercent = -50 * speed;
      } else {
        animationProps.yPercent = -50 * speed;
      }
      
      gsap.to(layer, {
        ...animationProps,
        scrollTrigger: {
          trigger: layer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    });
  }
  
  setupMagneticEffects() {
    // Magnetic cursor attraction for interactive elements
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
      const strength = parseFloat(element.dataset.magnetic) || 0.3;
      
      element.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = element.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) * strength;
        const y = (e.clientY - top - height / 2) * strength;
        
        gsap.to(element, {
          x,
          y,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }
  
  setupMorphingBackgrounds() {
    // Create smooth morphing background effects
    const morphingBgs = document.querySelectorAll('[data-morph-bg]');
    
    morphingBgs.forEach(bg => {
      const colors = bg.dataset.morphBg.split(',');
      
      gsap.to(bg, {
        background: `linear-gradient(45deg, ${colors.join(', ')})`,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });
  }
  
  setupAdvancedTextAnimations() {
    // Character-by-character text reveals
    const charRevealElements = document.querySelectorAll('[data-char-reveal]');
    
    charRevealElements.forEach(element => {
      const text = element.textContent;
      element.innerHTML = '';
      
      // Create spans for each character
      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100px) rotateX(90deg)';
        element.appendChild(span);
      });
      
      const chars = element.querySelectorAll('span');
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: 'back.out(1.7)'
          });
        }
      });
    });
  }
  
  setupScrollAnimations() {
    // Enhanced section animations with more cinematic timing
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach((section, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play pause resume reverse'
        }
      });
      
      // Cinematic entrance
      tl.fromTo(section, {
        opacity: 0,
        y: 80,
        scale: 0.98,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out'
      });
      
      this.animations.push(tl);
    });
    
    // Enhanced text reveal animations
    this.setupTextRevealAnimations();
    
    // Smooth counter animations
    this.setupCounterAnimations();
    
    // Progress bars with easing
    this.setupProgressAnimations();
  }
  
  setupTextRevealAnimations() {
    const textElements = document.querySelectorAll('[data-text-reveal]');
    
    textElements.forEach(element => {
      const words = element.textContent.split(' ');
      element.innerHTML = '';
      
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.innerHTML = word + (index < words.length - 1 ? '&nbsp;' : '');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100px)';
        span.style.willChange = 'transform, opacity';
        element.appendChild(span);
      });
      
      const wordSpans = element.querySelectorAll('span');
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(wordSpans, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out'
          });
        }
      });
    });
  }
  
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.counter);
      const duration = parseFloat(counter.dataset.duration) || 2;
      
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
          gsap.to({ value: 0 }, {
            value: target,
            duration: duration,
            ease: 'power2.out',
            onUpdate: function() {
              counter.textContent = Math.round(this.targets()[0].value);
            }
          });
        }
      });
    });
  }
  
  setupProgressAnimations() {
    const progressBars = document.querySelectorAll('[data-progress]');
    
    progressBars.forEach(bar => {
      const progress = parseFloat(bar.dataset.progress) || 100;
      
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(bar, {
            scaleX: 0,
            transformOrigin: 'left center'
          }, {
            scaleX: progress / 100,
            duration: 1.5,
            ease: 'power3.out'
          });
        }
      });
    });
  }
  
  setupHoverAnimations() {
    // Enhanced hover effects for interactive elements
    const hoverElements = document.querySelectorAll('[data-hover]');
    
    hoverElements.forEach(element => {
      const hoverType = element.dataset.hover;
      
      let hoverTl = gsap.timeline({ paused: true });
      
      switch (hoverType) {
        case 'lift':
          hoverTl.to(element, {
            y: -8,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            duration: 0.4,
            ease: 'power2.out'
          });
          break;
          
        case 'glow':
          hoverTl.to(element, {
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
            duration: 0.3,
            ease: 'power2.out'
          });
          break;
          
        case 'rotate':
          hoverTl.to(element, {
            rotationZ: 5,
            scale: 1.05,
            duration: 0.4,
            ease: 'back.out(1.7)'
          });
          break;
          
        case 'card':
          const cardImage = element.querySelector('img');
          const cardContent = element.querySelector('.card-content');
          
          hoverTl
            .to(element, {
              y: -10,
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              duration: 0.4,
              ease: 'power2.out'
            })
            .to(cardImage, {
              scale: 1.05,
              duration: 0.4,
              ease: 'power2.out'
            }, 0)
            .to(cardContent, {
              y: -5,
              duration: 0.4,
              ease: 'power2.out'
            }, 0);
          break;
      }
      
      element.addEventListener('mouseenter', () => hoverTl.play());
      element.addEventListener('mouseleave', () => hoverTl.reverse());
    });
  }
  
  setupUtilityAnimations() {
    // Enhanced fade animations
    const fadeElements = document.querySelectorAll('[data-fade]');
    
    fadeElements.forEach(element => {
      const direction = element.dataset.fade || 'up';
      const delay = parseFloat(element.dataset.delay) || 0;
      const distance = parseInt(element.dataset.distance) || 50;
      
      let fromProps = { opacity: 0 };
      let toProps = { opacity: 1 };
      
      switch (direction) {
        case 'up':
          fromProps.y = distance;
          toProps.y = 0;
          break;
        case 'down':
          fromProps.y = -distance;
          toProps.y = 0;
          break;
        case 'left':
          fromProps.x = distance;
          toProps.x = 0;
          break;
        case 'right':
          fromProps.x = -distance;
          toProps.x = 0;
          break;
        case 'scale':
          fromProps.scale = 0.8;
          toProps.scale = 1;
          break;
        case 'blur':
          fromProps.filter = 'blur(10px)';
          toProps.filter = 'blur(0px)';
          break;
      }
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(element, fromProps, {
            ...toProps,
            duration: 1,
            delay: delay,
            ease: 'power3.out'
          });
        }
      });
    });
    
    // Enhanced stagger animations
    const staggerGroups = document.querySelectorAll('[data-stagger]');
    
    staggerGroups.forEach(group => {
      const children = Array.from(group.children);
      const staggerDelay = parseFloat(group.dataset.stagger) || 0.1;
      const staggerType = group.dataset.staggerType || 'sequence';
      
      ScrollTrigger.create({
        trigger: group,
        start: 'top 85%',
        onEnter: () => {
          if (staggerType === 'random') {
            // Randomize order
            children.sort(() => Math.random() - 0.5);
          }
          
          gsap.fromTo(children, {
            opacity: 0,
            y: 60,
            scale: 0.9
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: staggerDelay,
            ease: 'power3.out'
          });
        }
      });
    });
  }
  
  initSimplifiedAnimations() {
    // Simplified animations for reduced motion preference
    const fadeElements = document.querySelectorAll('[data-fade], [data-text-reveal]');
    
    fadeElements.forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        onEnter: () => {
          element.style.opacity = '1';
          element.style.transform = 'none';
        }
      });
    });
  }
  
  // Enhanced utility methods
  fadeIn(element, options = {}) {
    const defaults = {
      duration: 0.8,
      ease: 'power3.out',
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(element, {
      opacity: 0
    }, {
      opacity: 1,
      ...config
    });
  }
  
  fadeOut(element, options = {}) {
    const defaults = {
      duration: 0.6,
      ease: 'power2.in',
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.to(element, {
      opacity: 0,
      ...config
    });
  }
  
  slideIn(element, direction = 'up', options = {}) {
    const defaults = {
      duration: 0.8,
      ease: 'power3.out',
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    const distance = options.distance || 60;
    
    let fromProps = { opacity: 0 };
    let toProps = { opacity: 1 };
    
    switch (direction) {
      case 'up':
        fromProps.y = distance;
        toProps.y = 0;
        break;
      case 'down':
        fromProps.y = -distance;
        toProps.y = 0;
        break;
      case 'left':
        fromProps.x = distance;
        toProps.x = 0;
        break;
      case 'right':
        fromProps.x = -distance;
        toProps.x = 0;
        break;
    }
    
    return gsap.fromTo(element, fromProps, {
      ...toProps,
      ...config
    });
  }
  
  scaleIn(element, options = {}) {
    const defaults = {
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(element, {
      opacity: 0,
      scale: 0.5
    }, {
      opacity: 1,
      scale: 1,
      ...config
    });
  }
  
  morphElement(element, options = {}) {
    const defaults = {
      duration: 1,
      ease: 'power2.inOut'
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.to(element, config);
  }
  
  createCinematicTransition(fromElement, toElement, options = {}) {
    const defaults = {
      duration: 1.2,
      ease: 'power2.inOut'
    };
    
    const config = { ...defaults, ...options };
    const tl = gsap.timeline();
    
    tl.to(fromElement, {
      scale: 1.1,
      opacity: 0,
      filter: 'blur(10px)',
      duration: config.duration / 2,
      ease: 'power2.in'
    })
    .fromTo(toElement, {
      scale: 0.9,
      opacity: 0,
      filter: 'blur(10px)'
    }, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: config.duration / 2,
      ease: 'power2.out'
    });
    
    return tl;
  }
  
  destroy() {
    this.animations.forEach(anim => {
      if (anim.kill) anim.kill();
    });
    
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.animations = [];
    this.isInitialized = false;
  }
}

// Enhanced global animation utilities
const AnimationUtils = {
  // Quick animation functions
  fadeIn: (element, options) => new Animations().fadeIn(element, options),
  fadeOut: (element, options) => new Animations().fadeOut(element, options),
  slideIn: (element, direction, options) => new Animations().slideIn(element, direction, options),
  scaleIn: (element, options) => new Animations().scaleIn(element, options),
  morphElement: (element, options) => new Animations().morphElement(element, options),
  
  // Create cinematic transitions
  cinematicTransition: (from, to, options) => new Animations().createCinematicTransition(from, to, options),
  
  // Enhanced stagger animation
  stagger: (elements, options = {}) => {
    const defaults = {
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    };
    
    const config = { ...defaults, ...options };
    
    return gsap.fromTo(elements, {
      opacity: 0,
      y: 60,
      scale: 0.95
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      ...config
    });
  },
  
  // Create timeline with enhanced defaults
  createTimeline: (options = {}) => {
    const defaults = {
      ease: 'power2.out'
    };
    
    return gsap.timeline({ ...defaults, ...options });
  },
  
  // Page transition utilities
  pageTransitionIn: (element) => {
    return gsap.fromTo(element, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(5px)'
    }, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out'
    });
  },
  
  pageTransitionOut: (element) => {
    return gsap.to(element, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(5px)',
      duration: 0.8,
      ease: 'power2.in'
    });
  }
};

// Initialize enhanced animations
let animationsInstance = null;

window.initAnimations = function() {
  if (!animationsInstance && typeof gsap !== 'undefined') {
    animationsInstance = new Animations();
    animationsInstance.init();
    
    // Make globally available
    window.animations = animationsInstance;
    window.AnimationUtils = AnimationUtils;
    
    console.log('Enhanced NETSPIRE animations initialized');
  }
  
  return animationsInstance;
};

// Auto-initialize if GSAP is available
if (document.readyState !== 'loading' && typeof gsap !== 'undefined') {
  window.initAnimations();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      window.initAnimations();
    }
  });
} 