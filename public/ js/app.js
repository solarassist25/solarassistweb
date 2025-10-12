// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');

mobileMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Simple Email Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value || 'Not provided',
            message: document.getElementById('message').value
        };
        
        // Create email body
        const emailBody = `
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Message: ${formData.message}

Submitted from SolarAssist website on ${new Date().toLocaleString('en-IN')}
        `;
        
        // Use mailto
        const mailtoLink = `mailto:contact@solarassist.in?subject=New SolarAssist Lead: ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(emailBody)}`;
        
        // Show success message
        showNotification('Thank you! Opening email to send your message...', 'success');
        
        // Open email client after short delay
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
        // Reset form after a delay
        setTimeout(() => {
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Track in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'lead',
                    'event_label': 'Contact Form'
                });
            }
        }, 3000);
    });
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if(this.getAttribute('href') && this.getAttribute('href').startsWith('tel:')) {
            // Track phone calls
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'engagement',
                    'event_label': this.getAttribute('href')
                });
            }
        }
        
        if(this.getAttribute('href') && this.getAttribute('href').includes('wa.me')) {
            // Track WhatsApp clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': 'WhatsApp Contact'
                });
            }
        }
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
    
    if('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if(entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});
