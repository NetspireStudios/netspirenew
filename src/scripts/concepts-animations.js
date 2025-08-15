// Concepts Page Animations and Interactions

// Initialize hero animations
export function initHeroAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping hero animations');
    return;
  }

  console.log('Initializing hero animations...');

  // Hero badge animation
  gsap.to('.hero-badge', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.2
  });

  // Hero title word-by-word animation
  gsap.to('.title-word', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
    delay: 0.5
  });

  // Hero description animation
  gsap.to('.hero-description', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 1.2
  });

  console.log('✅ Hero animations initialized');
}

// Initialize title animation
export function initTitleAnimation() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Fast cinematic title reveal
  const titleTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.cinematic-title-container',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  });

  titleTl
    .to('.title-background-text', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
    .to('.title-word', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.1
    }, '-=0.2')
    .to('.subtitle-container', {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.1');

  console.log('✅ Title animation initialized');
}

// Initialize page transitions
export function initPageTransitions() {
  const transitionOverlay = document.getElementById('pageTransition');
  const transitionBg = document.querySelector('.transition-background');

  if (!transitionOverlay || !transitionBg) return;

  // Check if we're coming from a page transition
  if (sessionStorage.getItem('pageTransition') === 'true') {
    sessionStorage.removeItem('pageTransition');
    
    // Start with overlay covering screen, then slide out
    setTimeout(() => {
      transitionBg.classList.add('slide-out');
      
      // Clean up after animation
      setTimeout(() => {
        transitionBg.style.left = '-100%';
      }, 600);
    }, 100);
  }

  // Handle navigation links
  const navLinks = document.querySelectorAll('a[href^="/"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const currentPath = window.location.pathname;
      
      // Only handle internal navigation between about and concepts
      if ((href === '/about' || href === '/concepts') && href !== currentPath) {
        e.preventDefault();
        
        // Mark that we're transitioning
        sessionStorage.setItem('pageTransition', 'true');
        
        // Start transition: slide in from left
        transitionBg.classList.add('slide-in');
        
        // Navigate after overlay covers screen
        setTimeout(() => {
          window.location.href = href;
        }, 350);
      }
    });
  });

  console.log('✅ Page transitions initialized');
} 