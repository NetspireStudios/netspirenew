// Project Showcase Interactive Module

export function initProjectShowcase() {
  console.log('Initializing Project Showcase...');

  // Project data
  const projectsData = [
    {
      number: '01',
      category: 'E-Commerce',
      title: 'Digital Commerce Revolution',
      description: 'Next-generation e-commerce platform with AI-powered recommendations and seamless user experience.',
      placeholder: 'E-COMMERCE PLATFORM',
      tags: ['Next.js', 'AI/ML', 'Payment', 'Mobile-First']
    },
    {
      number: '02',
      category: 'SaaS Platform',
      title: 'Enterprise Analytics Suite',
      description: 'Comprehensive business intelligence platform with real-time data visualization and automated reporting.',
      placeholder: 'ANALYTICS PLATFORM',
      tags: ['React', 'D3.js', 'Analytics', 'Enterprise']
    },
    {
      number: '03',
      category: 'Healthcare',
      title: 'Telemedicine Gateway',
      description: 'Secure patient-doctor communication platform with integrated appointment scheduling and health tracking.',
      placeholder: 'HEALTH PLATFORM',
      tags: ['Security', 'HIPAA', 'React', 'Real-time']
    },
    {
      number: '04',
      category: 'Education',
      title: 'Learning Management Evolution',
      description: 'Modern LMS with interactive content delivery, progress tracking, and collaborative learning features.',
      placeholder: 'EDUCATION PLATFORM',
      tags: ['Vue.js', 'Interactive', 'Progress', 'Social']
    },
    {
      number: '05',
      category: 'Fintech',
      title: 'Financial Freedom App',
      description: 'Personal finance management with investment tracking, budgeting tools, and financial goal planning.',
      placeholder: 'FINTECH APP',
      tags: ['Finance', 'Security', 'Mobile', 'Analytics']
    }
  ];

  let currentProjectIndex = 0;
  let isTransitioning = false;

  // Get DOM elements
  const currentProjectEl = document.getElementById('currentProject');
  const projectNumberEl = document.getElementById('projectNumber');
  const projectCategoryEl = document.getElementById('projectCategory');
  const projectTitleEl = document.getElementById('projectTitle');
  const projectDescriptionEl = document.getElementById('projectDescription');
  const placeholderTextEl = document.getElementById('placeholderText');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');

  // Create indicator elements if they don't exist
  createIndicators();

  function createIndicators() {
    const indicatorContainer = document.querySelector('.project-indicators');
    if (!indicatorContainer) {
      const container = document.createElement('div');
      container.className = 'project-indicators';
      container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 40px;
      `;
      
      projectsData.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.style.cssText = `
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        `;
        
        // Add active state styles
        if (index === 0) {
          indicator.style.background = '#ffffff';
          indicator.style.borderColor = '#ffffff';
        }
        
        container.appendChild(indicator);
      });
      
      const projectDisplay = document.querySelector('.project-display');
      if (projectDisplay) {
        projectDisplay.appendChild(container);
      }
    }
  }

  const indicators = document.querySelectorAll('.indicator');

  // BULLETPROOF Update project display
  function updateProject(index) {
    console.log(`🎯 Updating to project ${index + 1}`);
    
    // Prevent out of bounds
    if (index < 0) index = projectsData.length - 1;
    if (index >= projectsData.length) index = 0;
    currentProjectIndex = index;
    
    // Force reset transition state
    isTransitioning = true;
    
    const project = projectsData[index];
    console.log(`📝 Project data:`, project);

    // Immediate content update with smooth transitions
    const updateContent = () => {
      if (currentProjectEl) {
        currentProjectEl.textContent = (index + 1).toString().padStart(2, '0');
        console.log(`✅ Updated counter: ${currentProjectEl.textContent}`);
      }
      if (projectNumberEl) projectNumberEl.textContent = project.number;
      if (projectCategoryEl) projectCategoryEl.textContent = project.category;
      if (projectTitleEl) projectTitleEl.textContent = project.title;
      if (projectDescriptionEl) projectDescriptionEl.textContent = project.description;
      if (placeholderTextEl) placeholderTextEl.textContent = project.placeholder;

      // Update tech tags
      const techContainer = document.querySelector('.project-tech');
      if (techContainer) {
        techContainer.innerHTML = project.tags.map(tag => 
          `<div class="tech-tag">${tag}</div>`
        ).join('');
      }
      
      console.log(`✅ All content updated for project ${index + 1}`);
    };

    // Use GSAP if available, otherwise CSS transitions
    if (typeof gsap !== 'undefined' && gsap.to) {
      gsap.to([projectNumberEl, projectCategoryEl, projectTitleEl, projectDescriptionEl, placeholderTextEl], {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          updateContent();
          gsap.to([projectNumberEl, projectCategoryEl, projectTitleEl, projectDescriptionEl, placeholderTextEl], {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              isTransitioning = false;
              console.log(`✅ GSAP transition complete for project ${index + 1}`);
            }
          });
        }
      });
    } else {
      // CSS fallback transition
      updateContent();
      setTimeout(() => {
        isTransitioning = false;
        console.log(`✅ CSS transition complete for project ${index + 1}`);
      }, 300);
    }

    // Update indicators
    indicators.forEach((indicator, i) => {
      const isActive = i === index;
      indicator.classList.toggle('active', isActive);
      indicator.style.background = isActive ? '#ffffff' : 'transparent';
      indicator.style.borderColor = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
    });
  }

  // BULLETPROOF Navigate to next project
  function nextProject() {
    console.log('🔄 Next project clicked');
    if (isTransitioning) {
      console.log('⚠️ Transition in progress, forcing next anyway');
      isTransitioning = false; // Force reset if stuck
    }
    
    const nextIndex = (currentProjectIndex + 1) % projectsData.length;
    console.log(`➡️ Moving from ${currentProjectIndex} to ${nextIndex}`);
    updateProject(nextIndex);
  }

  // BULLETPROOF Navigate to previous project
  function prevProject() {
    console.log('🔄 Previous project clicked');
    if (isTransitioning) {
      console.log('⚠️ Transition in progress, forcing previous anyway');
      isTransitioning = false; // Force reset if stuck
    }
    
    const prevIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
    console.log(`⬅️ Moving from ${currentProjectIndex} to ${prevIndex}`);
    updateProject(prevIndex);
  }

  // BULLETPROOF Event listeners
  if (nextBtn) {
    console.log('✅ Next button found, attaching event');
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextProject();
    });
  } else {
    console.error('❌ Next button not found');
  }

  if (prevBtn) {
    console.log('✅ Previous button found, attaching event');
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prevProject();
    });
  } else {
    console.error('❌ Previous button not found');
  }

  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index !== currentProjectIndex && !isTransitioning) {
        currentProjectIndex = index;
        updateProject(currentProjectIndex);
      }
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevProject();
    } else if (e.key === 'ArrowRight') {
      nextProject();
    }
  });

  // Enhanced drag/swipe support with animations
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTime = 0;
  const projectDisplay = document.querySelector('.project-display');
  
  if (projectDisplay) {
    // Mouse drag support
    projectDisplay.addEventListener('mousedown', handleStart);
    projectDisplay.addEventListener('mousemove', handleMove);
    projectDisplay.addEventListener('mouseup', handleEnd);
    projectDisplay.addEventListener('mouseleave', handleEnd);

    // Touch support
    projectDisplay.addEventListener('touchstart', handleStart, { passive: false });
    projectDisplay.addEventListener('touchmove', handleMove, { passive: false });
    projectDisplay.addEventListener('touchend', handleEnd);

    function handleStart(e) {
      if (isTransitioning) return;
      
      isDragging = true;
      startTime = Date.now();
      startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      currentX = startX;
      
      projectDisplay.style.cursor = 'grabbing';
      projectDisplay.style.transition = 'none';
      
      e.preventDefault();
    }

    function handleMove(e) {
      if (!isDragging || isTransitioning) return;
      
      currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const diff = currentX - startX;
      const maxDrag = 100;
      const constrainedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
      
      // Apply subtle transform for visual feedback
      projectDisplay.style.transform = `translateX(${constrainedDiff * 0.3}px)`;
      
      // Add resistance effect
      const opacity = 1 - Math.abs(constrainedDiff) / maxDrag * 0.1;
      projectDisplay.style.opacity = opacity;
    }

    function handleEnd(e) {
      if (!isDragging) return;
      
      isDragging = false;
      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      const distance = currentX - startX;
      const velocity = Math.abs(distance) / timeDiff;
      
      // Reset styles with smooth transition
      projectDisplay.style.cursor = 'grab';
      projectDisplay.style.transition = 'all 0.3s ease';
      projectDisplay.style.transform = 'translateX(0)';
      projectDisplay.style.opacity = '1';
      
      // Determine if swipe should trigger navigation
      const shouldNavigate = Math.abs(distance) > 50 || velocity > 0.5;
      
      if (shouldNavigate) {
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        setTimeout(() => {
          if (distance > 0) {
            prevProject();
          } else {
            nextProject();
          }
        }, 100);
      }
    }

    // Add visual indicator that element is draggable
    projectDisplay.style.cursor = 'grab';
    projectDisplay.style.userSelect = 'none';
  }

  // Auto-advance (optional)
  let autoAdvanceInterval;
  
  function startAutoAdvance() {
    autoAdvanceInterval = setInterval(nextProject, 8000); // 8 seconds
  }

  function stopAutoAdvance() {
    clearInterval(autoAdvanceInterval);
  }

  // Start auto-advance and pause on hover
  startAutoAdvance();
  
  if (projectDisplay) {
    projectDisplay.addEventListener('mouseenter', stopAutoAdvance);
    projectDisplay.addEventListener('mouseleave', startAutoAdvance);
  }

  // Initialize first project
  updateProject(0);

  console.log('✅ Project Showcase initialized with', projectsData.length, 'projects');
} 