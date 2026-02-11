document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contact-form');
    const output = document.getElementById('terminal-output');
    const btnText = document.querySelector('.btn-text');
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const textSpan = document.querySelector(".type-text");
    const homeLink = document.querySelector('a[href="#home"]');
    const revealElements = document.querySelectorAll('.reveal');
    const phrases = ["Machine Learning", "Data Visualization", "Statistics"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            output.style.color = "var(--accent-color)";
            output.textContent = "> INITIALIZING TRANSMISSION...";
            btnText.textContent = "SENDING...";
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    output.textContent = "> Success!";
                    form.reset();
                    btnText.textContent = "EXECUTE";
                    setTimeout(() => {
                        output.textContent = "";
                    }, 2000);
                } else {
                    throw new Error();
                }
            } catch (error) {
                output.style.color = "#ff5f56";
                output.textContent = "> ERROR: DATA PACKET LOST. RE-TRY LATER.";
                btnText.textContent = "RETRY";
            }
        });
    }

    function toggleMenu() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

    if (burger) {
        burger.addEventListener('click', () => {
            toggleMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    });

    document.addEventListener('click', (event) => {
        const isMenuOpen = nav.classList.contains('nav-active');
        const clickedInsideMenu = nav.contains(event.target);
        const clickedBurger = burger.contains(event.target);

        if (isMenuOpen && !clickedInsideMenu && !clickedBurger) {
            toggleMenu();
        }
    });

    function type() {
        if (!textSpan) return;
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    if (textSpan) setTimeout(type, 1000);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});