document.addEventListener('DOMContentLoaded', function() {
  // Back to top button
  const backToTopButton = document.getElementById('backToTop');
  
  // Mobile menu elements
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
  
  // Show/hide back to top button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
    
    // Animate elements on scroll
    animateOnScroll();
  });
  
  // Smooth scroll to top when back to top button is clicked
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Toggle mobile menu
  mobileMenuButton.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu when a link is clicked
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuButton.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.getAttribute('href') !== '#') {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  });
  
  // Add hover effect to project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Add hover class on mouseenter
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    });
    
    // Remove hover class on mouseleave
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
    
    // Handle touch devices
    card.addEventListener('touchstart', function() {
      this.classList.add('hover');
    });
    
    card.addEventListener('touchend', function() {
      this.classList.remove('hover');
    });
  });
  
  // Animate elements on scroll
  function animateOnScroll() {
    const elements = document.querySelectorAll('.project-card, .section-header');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('fade-in-up');
      }
    });
  }
  
  // Initialize animations on page load
  window.addEventListener('load', function() {
    // Add loaded class to body to enable transitions
    document.body.classList.add('loaded');
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Add animation to header elements with a slight delay
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
      setTimeout(() => {
        headerContent.style.opacity = '1';
        headerContent.style.transform = 'translateY(0)';
      }, 300);
    }
  });
  
  // Add loading animation to images
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (!img.complete) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
      
      // Fallback in case image fails to load
      img.addEventListener('error', function() {
        this.style.opacity = '1';
      });
    }
  });
  
  // Add focus styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });
  
  // Add intersection observer for better performance with many elements
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    document.querySelectorAll('.project-card, .section-header').forEach(element => {
      observer.observe(element);
    });
  }
});
