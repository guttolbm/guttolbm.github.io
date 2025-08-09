document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
                mobileMenuBtn.classList.remove('active');
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
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
    });

    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form submission handling (Google Apps Script integration)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch("1BMEyea56lrQ4Am6klFUZ0KQBFao7LuMTp0wWcunC1zuYRH63nF3pfklM", { // <-- Substitua pela URL gerada no Google Apps Script
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(msg => {
                alert("Mensagem enviada com sucesso! ✅");
                this.reset();
            })
            .catch(err => {
                alert("Erro ao enviar. ❌ Tente novamente.");
                console.error(err);
            });
        });
    }

    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .value, .contact-method');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    document.querySelectorAll('.service-card, .value, .contact-method').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Handle responsive navigation on window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            navMenu.style.display = '';
        } else {
            navMenu.style.display = 'none';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});
