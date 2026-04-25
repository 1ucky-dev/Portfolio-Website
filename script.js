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

    // --- Matrix Rain (Full Page) ---
    const bgCanvas = document.getElementById('bg-matrix-canvas');
    if (bgCanvas) {
        const bCtx = bgCanvas.getContext('2d');

        function resizeBgCanvas() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
        resizeBgCanvas();
        window.addEventListener('resize', resizeBgCanvas);

        const bgChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]';
        const bgFontSize = 14;
        let bgColumns = Math.floor(bgCanvas.width / bgFontSize);
        let bgDrops = Array.from({ length: bgColumns }, () => Math.random() * -100);

        function drawBgMatrix() {
            // Fade out existing characters to transparent
            bCtx.globalCompositeOperation = 'destination-out';
            bCtx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            bCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
            bCtx.globalCompositeOperation = 'source-over';

            bgColumns = Math.floor(bgCanvas.width / bgFontSize);
            if (bgDrops.length !== bgColumns) {
                bgDrops = Array.from({ length: bgColumns }, () => Math.random() * -100);
            }

            bCtx.font = `${bgFontSize}px monospace`;

            for (let i = 0; i < bgDrops.length; i++) {
                const char = bgChars[Math.floor(Math.random() * bgChars.length)];
                const r = Math.random();
                if (r > 0.96) {
                    bCtx.fillStyle = '#ff8080';
                } else if (r > 0.7) {
                    bCtx.fillStyle = '#bd2626';
                } else {
                    bCtx.fillStyle = '#6b0f0f';
                }
                bCtx.fillText(char, i * bgFontSize, bgDrops[i] * bgFontSize);

                if (bgDrops[i] * bgFontSize > bgCanvas.height && Math.random() > 0.97) {
                    bgDrops[i] = 0;
                }
                bgDrops[i]++;
            }
        }

        setInterval(drawBgMatrix, 45);
    }

    // --- Form Handling ---
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
                    btnText.textContent = "Send";
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

    // --- Hamburger Logic ---
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
        // Only run if nav and burger exist to prevent console errors
        if (!nav || !burger) return;

        const isMenuOpen = nav.classList.contains('nav-active');
        const clickedInsideMenu = nav.contains(event.target);
        const clickedBurger = burger.contains(event.target);

        if (isMenuOpen && !clickedInsideMenu && !clickedBurger) {
            toggleMenu();
        }
    });

    // --- Typing Effect ---
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

    if (textSpan) setTimeout(type, 1000);    // --- Modern Scroll Reveal (Elastic & Fast) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));


    // --- Smooth Scroll for Home ---
    if (homeLink) {
        homeLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Scroll Progress Bar + Navbar glass + Active Nav ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    function updateActiveNavLink() {
        let currentSection = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
        });
    }

    window.addEventListener('scroll', () => {
        // Progress bar
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = ((winScroll / height) * 100) + '%';
        }

        // Navbar glass on scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }

        updateActiveNavLink();
    });

    // Run on initial load
    updateActiveNavLink();
});
