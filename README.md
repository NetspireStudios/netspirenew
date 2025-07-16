# NETSPIRE - Cinematic Web Experience

A sophisticated, Cuberto-inspired website built with cutting-edge web technologies to deliver an immersive, cinematic user experience.

## 🎯 Project Overview

NETSPIRE is a modern, minimalist website featuring:
- **White background with black text theme**
- **Cinematic animations and transitions**
- **Custom cursor with interactive hover effects**
- **Smooth scrolling with Lenis**
- **Advanced GSAP animations**
- **Responsive design with mobile optimization**

## 🛠 Technology Stack

### Core Framework
- **Astro** - Static site generation with component islands
- **JavaScript** - Primary scripting language (no TypeScript per user preference)

### Animation Libraries
- **GSAP (GreenSock)** - Advanced animations and interactions
  - ScrollTrigger
  - SplitText
  - TextPlugin
  - MotionPathPlugin
  - 3D transforms
- **Lenis** - Smooth scrolling library

### Styling
- **CSS3** - Custom styles with modern features
- **CSS Grid & Flexbox** - Layout systems
- **CSS Custom Properties** - Theme management

## 📁 Project Structure

```
netspire/
├── public/
│   ├── images/
│   │   ├── preloader/
│   │   │   ├── image1.jpg
│   │   │   ├── image2.jpg
│   │   │   ├── image3.jpg
│   │   │   └── image4.jpg
│   │   ├── portfolio/
│   │   └── hero-video.mp4
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Cursor.astro
│   │   ├── Preloader.astro
│   │   ├── Navigation.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── Portfolio.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── about.astro
│   ├── scripts/
│   │   ├── cursor.js
│   │   ├── preloader.js
│   │   ├── navigation.js
│   │   ├── animations.js
│   │   └── smooth-scroll.js
│   └── styles/
│       ├── global.css
│       ├── components.css
│       └── animations.css
├── package.json
├── astro.config.mjs
├── .gitignore
└── README.md
```

## 🎨 Key Features

### 1. Custom Cursor System
- **Adaptive cursor** that changes based on hover targets
- **Smooth following animation** with GSAP
- **Text labels** that appear on specific elements
- **Scale and color transitions** for different UI elements

### 2. Preloader Experience
- **4 rectangular images** appearing simultaneously in center
- **Left-to-right reveal animation** using GSAP timeline
- **Smooth transition** to main content
- **No text elements** - purely visual experience

### 3. Hero Section
- **Large "NETSPIRE" title** on top-left
- **Burger menu** on top-right with hover effects
- **Background video** playing continuously
- **Logo scaling** on scroll with GSAP ScrollTrigger

### 4. Navigation System
- **Modern burger menu** with slide-in animation
- **Smooth pan transition** from right to left
- **Hover underline effects** on menu items
- **Home, Services, Portfolio, About Us, Contact Us** navigation

### 5. Content Sections
- **Quote Section**: Cinematic text reveal
- **Services**: "We don't just build, we innovate" with animated icons
- **Portfolio**: Circular images with unique scroll animations
- **Contact**: Large, underlined input forms
- **About Us**: Dedicated page/section with smooth transitions

### 6. Animation Features
- **GSAP 3D Elements**: Enhanced visual depth
- **Motion Paths**: Complex animation trajectories
- **Scroll Triggers**: Section-based animations
- **Split Text**: Character and word-level animations
- **Text Replace**: Dynamic content updates
- **Lenis Smooth Scroll**: Buttery-smooth scrolling experience

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netspire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## ⚠️ Potential Issues & Solutions

### 1. GSAP License Issues
**Problem**: GSAP premium plugins (SplitText, TextPlugin) require license
**Solution**: 
- Use GSAP's free alternatives or implement custom text splitting
- For production, obtain proper GSAP license
- Fallback to CSS animations if needed

### 2. Video Loading Performance
**Problem**: Large background videos causing slow loading
**Solution**:
- Compress videos to web-optimized formats (WebM, MP4)
- Implement lazy loading with intersection observer
- Provide fallback static images
- Use video preloading strategies

### 3. Mobile Performance
**Problem**: Complex animations causing performance issues on mobile
**Solution**:
- Implement `reducedMotion` media query detection
- Scale down animations on lower-end devices
- Use `will-change` CSS property strategically
- Optimize GSAP animations with proper cleanup

### 4. Browser Compatibility
**Problem**: Modern CSS features not supported in older browsers
**Solution**:
- Implement progressive enhancement
- Use PostCSS with autoprefixer
- Provide fallbacks for CSS Grid/Flexbox
- Test across different browsers

### 5. Smooth Scrolling Conflicts
**Problem**: Lenis conflicts with browser's native scrolling
**Solution**:
- Properly initialize Lenis after DOM load
- Handle scroll events carefully
- Disable on mobile if performance issues occur
- Implement proper cleanup on page transitions

### 6. Custom Cursor on Touch Devices
**Problem**: Custom cursor not relevant for touch interfaces
**Solution**:
- Detect touch devices and disable cursor
- Implement touch-specific interactions
- Use proper hover states for touch

### 7. Image Loading Order
**Problem**: Preloader images loading inconsistently
**Solution**:
- Preload critical images before showing preloader
- Use proper image loading promises
- Implement loading fallbacks
- Handle slow network conditions

## 🔧 Development Guidelines

### Animation Performance
- Use `transform` and `opacity` for animations
- Avoid animating layout properties
- Implement proper `will-change` usage
- Clean up animations and event listeners

### Code Organization
- Keep animations in separate modules
- Use consistent naming conventions
- Comment complex animation sequences
- Implement proper error handling

### Responsive Design
- Mobile-first approach
- Test on various screen sizes
- Optimize touch interactions
- Consider reduced motion preferences

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🎭 Design Philosophy

This website follows a **cinematic design approach** where:
- **Every interaction** is smooth and intentional
- **Animations enhance** the user experience without being distracting
- **Minimalism** is key - white background, black text, strategic use of space
- **Typography** varies with different fonts, italics, and weights for visual hierarchy
- **User journey** is guided through sophisticated transitions

## 📚 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)
- [Astro Documentation](https://docs.astro.build/)
- [Cuberto Design Inspiration](https://cuberto.com/)

## 🤝 Contributing

This project follows strict design and performance guidelines. Any contributions should:
- Maintain the cinematic feel
- Ensure smooth 60fps animations
- Follow the established code structure
- Test across multiple devices

---

**Built with ❤️ for exceptional user experiences**
