document.addEventListener('DOMContentLoaded', function () {
    initializePortfolioModals();
    initializeHeaderScrollEffect();
    initializePortfolioHoverEffects();
    initializeSmoothScrolling();
    initializeContactFormValidation();
    checkCookieConsent();
});

function initializePortfolioModals() {
    // Modal functionality
    const modalTriggers = document.querySelectorAll('.portfolio-item');
    modalTriggers.forEach(trigger => attachModalEvents(trigger));

    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => attachCloseButtonEvents(button));

    window.addEventListener('click', event => closeModalOnOutsideClick(event));
}

function attachModalEvents(trigger) {
    trigger.addEventListener('click', function (event) {
        event.preventDefault();
        const modalId = this.getAttribute('data-modal-target');
        const targetModal = document.querySelector(modalId);
        if (targetModal) {
            targetModal.classList.add('active');
            targetModal.style.display = 'block';
        }
    });
}

function attachCloseButtonEvents(button) {
    button.addEventListener('click', function () {
        const modal = this.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    });
}

function closeModalOnOutsideClick(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        setTimeout(() => event.target.style.display = 'none', 300);
    }
}

function initializeContactFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            let valid = true;
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            if (formData.name === "" || formData.email === "" || formData.message === "") {
                valid = false;
                alert('All fields are required.');
            }

            // Check for name length
            if (formData.name.length > 100) {
                valid = false;
                alert('Name must be 100 characters or less.');
            }

            // Check for email length
            if (formData.email.length > 100) {
                valid = false;
                alert('Email must be 100 characters or less.');
            }

            // Check for message length
            if (formData.message.length > 500) {
                valid = false;
                alert('Message must be 500 characters or less.');
            }

            if (!valid) {
                e.preventDefault();
            }
        });
    }
}

function initializeHeaderScrollEffect() {
    window.addEventListener("scroll", function () {
        const header = document.querySelector(".header");
        header.classList.toggle("shrink", window.scrollY > 0);
    });
}

function initializePortfolioHoverEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.opacity = '0.8');
        item.addEventListener('mouseleave', () => item.style.opacity = '1');
    });
}

function initializeSmoothScrolling() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function checkCookieConsent() {
    var cookieConsent = getCookie("cookieConsent");
    if (!cookieConsent) {
        var cookieConsentContainer = document.getElementById("cookieConsentContainer");
        if (cookieConsentContainer) {
            cookieConsentContainer.style.display = "block";
            document.getElementById("acceptCookieConsent").onclick = function () {
                setCookie("cookieConsent", "true", 30);
                cookieConsentContainer.style.display = "none";
            };
        }
    }
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
