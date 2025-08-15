// Project Showcase Interactive Module

export function initProjectShowcase() {
  console.log('Initializing Project Showcase...');

  // Wait a moment for DOM to be fully ready
  if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, waiting...');
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initProjectShowcase, 100);
    });
    return;
  }

  // Updated project data to match our new concepts
  const projectsData = [
    {
      number: '01',
      category: 'AI & Automation',
      title: 'Intelligent Business Solutions',
      description: 'Sophisticated yet approachable design for AI services. Features interactive demos, trust signals, and clear ROI calculators.',
      placeholder: 'AI AGENTS PLATFORM',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format',
      tags: ['24/7 Support', 'Automation', 'Analytics', 'AI Training']
    },
    {
      number: '02',
      category: 'Mobile Development',
      title: 'App Development Showcase',
      description: 'Clean, modern design highlighting app portfolios with interactive prototypes and detailed development process.',
      placeholder: 'APP DEVELOPMENT STUDIO',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&auto=format',
      tags: ['iOS Apps', 'Android', 'Cross-Platform', 'App Store']
    },
    {
      number: '03',
      category: 'Web Development',
      title: 'Professional Web Agency',
      description: 'Authority-building design with comprehensive service pages, live speed tests, and social proof integration.',
      placeholder: 'WEB DEVELOPMENT AGENCY',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format',
      tags: ['Frontend', 'Backend', 'E-commerce', 'Security']
    },
    {
      number: '04',
      category: 'Performance & Speed',
      title: 'Speed Optimization Dashboard',
      description: 'Technical yet accessible design showcasing performance improvements with live metrics and instant audits.',
      placeholder: 'PERFORMANCE OPTIMIZATION',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format',
      tags: ['Speed Tests', 'Caching', 'CDN', 'Monitoring']
    },
    {
      number: '05',
      category: 'SEO & Marketing',
      title: 'SEO Growth Platform',
      description: 'Credibility-focused design with live ranking displays, detailed case studies, and transparent reporting tools.',
      placeholder: 'SEO GROWTH PLATFORM',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop&auto=format',
      tags: ['Keyword Research', 'Rankings', 'Analytics', 'Reports']
    },
    {
      number: '06',
      category: 'API & Integration',
      title: 'Developer Platform',
      description: 'Technical yet user-friendly design with interactive documentation, API testing tools, and comprehensive guides.',
      placeholder: 'API INTEGRATION PLATFORM',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&auto=format',
      tags: ['REST API', 'GraphQL', 'Webhooks', 'Documentation']
    }
  ];

  let currentProjectIndex = 0;

  // Get DOM elements
  const currentProjectEl = document.getElementById('currentProject');
  const projectNumberEl = document.getElementById('projectNumber');
  const projectCategoryEl = document.getElementById('projectCategory');
  const projectTitleEl = document.getElementById('projectTitle');
  const projectDescriptionEl = document.getElementById('projectDescription');
  const placeholderTextEl = document.getElementById('placeholderText');
  const projectTechEl = document.getElementById('projectTech');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const indicators = document.querySelectorAll('.indicator');

  console.log('🔍 Found elements:', {
    currentProject: !!currentProjectEl,
    projectNumber: !!projectNumberEl,
    projectCategory: !!projectCategoryEl,
    projectTitle: !!projectTitleEl,
    projectDescription: !!projectDescriptionEl,
    placeholderText: !!placeholderTextEl,
    projectTech: !!projectTechEl,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn,
    indicators: indicators.length
  });

  // Simple function to update project content
  function updateProject(index) {
    console.log(`🎯 Updating to project ${index + 1}`);
    
    // Make sure index is valid
    if (index < 0) index = projectsData.length - 1;
    if (index >= projectsData.length) index = 0;
    
    const project = projectsData[index];
    console.log('📝 Project data:', project);

    // Update all content immediately with error checking
    try {
      if (currentProjectEl) {
        currentProjectEl.textContent = (index + 1).toString().padStart(2, '0');
        console.log('✅ Updated counter to:', currentProjectEl.textContent);
      } else {
        console.warn('⚠️ Current project element not found');
      }

      if (projectNumberEl) {
        projectNumberEl.textContent = project.number;
        console.log('✅ Updated project number to:', project.number);
      } else {
        console.warn('⚠️ Project number element not found');
      }

      if (projectCategoryEl) {
        projectCategoryEl.textContent = project.category;
        console.log('✅ Updated category to:', project.category);
      } else {
        console.warn('⚠️ Project category element not found');
      }

      if (projectTitleEl) {
        projectTitleEl.textContent = project.title;
        console.log('✅ Updated title to:', project.title);
      } else {
        console.warn('⚠️ Project title element not found');
      }

      if (projectDescriptionEl) {
        projectDescriptionEl.textContent = project.description;
        console.log('✅ Updated description');
      } else {
        console.warn('⚠️ Project description element not found');
      }

      if (placeholderTextEl) {
        placeholderTextEl.textContent = project.placeholder;
        console.log('✅ Updated placeholder to:', project.placeholder);
      } else {
        console.warn('⚠️ Placeholder text element not found');
      }

      // Update tech tags
      if (projectTechEl && project.tags) {
        projectTechEl.innerHTML = project.tags.map(tag => 
          `<div class="tech-tag">${tag}</div>`
        ).join('');
        console.log('✅ Updated tech tags');
      } else {
        console.warn('⚠️ Project tech element not found or no tags');
      }

      // Update indicators
      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
      console.log('✅ Updated indicators');

      currentProjectIndex = index;
      console.log(`✅ Project ${index + 1} update complete`);
      
    } catch (error) {
      console.error('❌ Error updating project:', error);
    }
  }

  // Simple navigation functions
  function goToNext() {
    console.log('➡️ Next button clicked');
    const nextIndex = (currentProjectIndex + 1) % projectsData.length;
    updateProject(nextIndex);
  }

  function goToPrevious() {
    console.log('⬅️ Previous button clicked');
    const prevIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
    updateProject(prevIndex);
  }

  // Add event listeners
  if (nextBtn) {
    console.log('🔗 Adding next button listener');
    
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🖱️ Next button clicked - going to next project');
      goToNext();
    });
    
    nextBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('👆 Next button touched - going to next project');
      goToNext();
    });
    
  } else {
    console.error('❌ Next button not found');
  }

  if (prevBtn) {
    console.log('🔗 Adding previous button listener');
    
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🖱️ Previous button clicked - going to previous project');
      goToPrevious();
    });
    
    prevBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('👆 Previous button touched - going to previous project');
      goToPrevious();
    });
    
  } else {
    console.error('❌ Previous button not found');
  }

  // Add indicator click functionality with better mobile support
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`🎯 Indicator ${index + 1} clicked - going to project ${index + 1}`);
      updateProject(index);
    });
    
    indicator.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`👆 Indicator ${index + 1} touched - going to project ${index + 1}`);
      updateProject(index);
    });
  });

  // Initialize with first project
  updateProject(0);

  console.log('✅ Project Showcase initialized successfully with', projectsData.length, 'projects');
  
  // Add debugging method to global scope for testing
  window.testProjectButtons = function() {
    console.log('🧪 Testing project buttons...');
    console.log('Next button:', nextBtn ? 'Found' : 'Missing');
    console.log('Prev button:', prevBtn ? 'Found' : 'Missing');
    console.log('Indicators:', indicators.length);
    
    if (nextBtn) {
      console.log('🔥 Triggering next button...');
      goToNext();
    }
  };
  
  // Final safety check - retry in 2 seconds if buttons don't work
  setTimeout(() => {
    if (!nextBtn || !prevBtn) {
      console.warn('⚠️ Buttons not found, retrying initialization...');
      initProjectShowcase();
    }
  }, 2000);
} 