// Custom Cursor Implementation - No ES Modules
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorText = null;
    this.isTouch = false;
    this.isVisible = false;
    this.mouse = { x: 0, y: 0 };
    this.cursorPos = { x: 0, y: 0 };
    
    // Cursor states
    this.states = {
      default: { scale: 1, mixBlendMode: 'difference' },
      hover: { scale: 1.5, mixBlendMode: 'difference' },
      click: { scale: 0.8, mixBlendMode: 'difference' },
      drag: { scale: 1.2, mixBlendMode: 'normal' },
      text: { scale: 2, mixBlendMode: 'difference' },
      button: { scale: 1.8, mixBlendMode: 'difference' }
    };
    
    this.init();
  }
  
  init() {
    // Check if touch device or if GSAP is not available
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (this.isTouch || typeof gsap === 'undefined') {
      return; // Don't initialize cursor on touch devices or if GSAP not loaded
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createCursor());
    } else {
      this.createCursor();
    }
  }
  
  createCursor() {
    // Create cursor element
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    
    // Create cursor text
    this.cursorText = document.createElement('span');
    this.cursorText.className = 'cursor-text';
    this.cursor.appendChild(this.cursorText);
    
    document.body.appendChild(this.cursor);
    
    // Set initial styles with GSAP
    gsap.set(this.cursor, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: 20,
      height: 20,
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9999,
      mixBlendMode: 'difference',
      scale: 0,
      transformOrigin: 'center',
      willChange: 'transform'
    });
    
    gsap.set(this.cursorText, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '12px',
      fontWeight: '600',
      color: '#000000',
      whiteSpace: 'nowrap',
      opacity: 0
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    this.bindEvents();
    this.setupHoverEffects();
    this.startAnimation();
  }
  
  bindEvents() {
    // Mouse events
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseenter', () => this.onMouseEnter());
    document.addEventListener('mouseleave', () => this.onMouseLeave());
    document.addEventListener('mousedown', () => this.setState('click'));
    document.addEventListener('mouseup', () => this.setState('default'));
    
    // Handle visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.hide();
      } else {
        this.show();
      }
    });
  }
  
  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    if (!this.isVisible) {
      this.show();
    }
  }
  
  onMouseEnter() {
    this.show();
  }
  
  onMouseLeave() {
    this.hide();
  }
  
  show() {
    if (!this.isVisible && this.cursor) {
      this.isVisible = true;
      gsap.to(this.cursor, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    }
  }
  
  hide() {
    if (this.isVisible && this.cursor) {
      this.isVisible = false;
      gsap.to(this.cursor, {
        scale: 0,
        duration: 0.3,
        ease: "back.in(1.7)"
      });
    }
  }
  
  setState(state) {
    if (!this.cursor || !this.states[state]) return;
    
    const stateConfig = this.states[state];
    
    gsap.to(this.cursor, {
      scale: stateConfig.scale,
      duration: 0.3,
      ease: "power2.out"
    });
    
    if (stateConfig.mixBlendMode) {
      this.cursor.style.mixBlendMode = stateConfig.mixBlendMode;
    }
  }
  
  setText(text) {
    if (!this.cursorText) return;
    
    this.cursorText.textContent = text;
    
    if (text) {
      gsap.to(this.cursorText, {
        opacity: 1,
        duration: 0.2
      });
      gsap.to(this.cursor, {
        scale: 2,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(this.cursorText, {
        opacity: 0,
        duration: 0.2
      });
      this.setState('default');
    }
  }
  
  setupHoverEffects() {
    // Interactive elements
    const interactiveSelectors = [
      'a', 'button', '.btn', '.link',
      '[data-cursor="hover"]', '.hover-target'
    ];
    
    interactiveSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('mouseenter', () => {
          this.setState('hover');
          const text = element.getAttribute('data-cursor-text');
          if (text) this.setText(text);
        });
        
        element.addEventListener('mouseleave', () => {
          this.setState('default');
          this.setText('');
        });
      });
    });
    
    // Text elements
    const textSelectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div[contenteditable]'];
    
    textSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('mouseenter', () => {
          if (getComputedStyle(element).cursor === 'text' || element.contentEditable === 'true') {
            this.setState('text');
          }
        });
        
        element.addEventListener('mouseleave', () => {
          this.setState('default');
        });
      });
    });
  }
  
  startAnimation() {
    // Smooth cursor follow animation
    const updateCursor = () => {
      if (!this.cursor) return;
      
      // Smooth follow with lag
      this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * 0.1;
      this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * 0.1;
      
      gsap.set(this.cursor, {
        x: this.cursorPos.x,
        y: this.cursorPos.y
      });
      
      requestAnimationFrame(updateCursor);
    };
    
    updateCursor();
  }
  
  destroy() {
    if (this.cursor) {
      this.cursor.remove();
      document.body.style.cursor = 'auto';
    }
  }
}

// Global initialization function
window.initCursor = function() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, cursor disabled');
    return;
  }
  
  // Initialize cursor
  window.customCursor = new CustomCursor();
  
  console.log('Custom cursor initialized');
};

// Auto-initialize if DOM is ready and GSAP is available
if (document.readyState !== 'loading' && typeof gsap !== 'undefined') {
  window.initCursor();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      window.initCursor();
    }
  });
} 