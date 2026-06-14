// Resume App - core builder functionality
class ResumeApp {
    constructor() {
        this.fields = [
            "name", "email", "phone", "linkedin", "summary",
            "degree", "college", "cgpa", "skills", "company",
            "role", "duration", "project", "languages", "certificate"
        ];
    }

    saveResume() {
        this.fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                localStorage.setItem(id, input.value);
            }
        });
        alert("✅ Resume saved successfully!");
    }

    generateAIContent() {
        const summaries = [
            "Motivated Computer Science student with strong analytical, communication and problem-solving skills. Passionate about building modern web applications using HTML, CSS and JavaScript while continuously learning emerging technologies and best development practices.",
            "Dynamic software engineer with 3+ years of experience in developing scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality code and meeting project deadlines.",
            "Results-driven professional with a background in data analysis and machine learning. Skilled in Python, SQL, and data visualization tools. Committed to leveraging technology to drive business growth and innovation."
        ];

        const summary = summaries[Math.floor(Math.random() * summaries.length)];
        const summaryInput = document.getElementById("summary");
        const previewSummary = document.getElementById("previewSummary");

        if (summaryInput) summaryInput.value = summary;
        if (previewSummary) previewSummary.textContent = summary;
        localStorage.setItem("summary", summary);

        if (typeof updateProgress === "function") {
            updateProgress();
        }
    }

    clearResume() {
        if (typeof clearResumeData === "function") {
            clearResumeData();
        }
    }
}

// Modern App Initialization
class ModernResumeApp {
    constructor() {
        this.initApp();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    initApp() {
        if (typeof ThemeManager !== "undefined" && !window.themeManager) {
            window.themeManager = new ThemeManager();
        }

        if (typeof PDFGenerator !== "undefined") {
            window.pdfGenerator = new PDFGenerator();
        }

        window.resumeApp = new ResumeApp();

        this.setupNavigation();
        this.setupCountersAnimation();
        this.setupFeatureCardsAnimation();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        if (!navLinks.length || !sections.length) return;

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const updateNavbarBackground = () => {
            const dark = document.body.classList.contains('dark-mode');
            if (dark) {
                if (window.pageYOffset > 50) {
                    navbar.style.background = 'rgba(7, 20, 37, 0.95)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
                } else {
                    navbar.style.background = 'rgba(7, 20, 37, 0.8)';
                    navbar.style.boxShadow = 'none';
                }
                navbar.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
            } else {
                if (window.pageYOffset > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                    navbar.style.boxShadow = 'none';
                }
                navbar.style.borderBottom = '1px solid rgba(226, 232, 240, 0.5)';
            }
        };

        window.addEventListener('scroll', updateNavbarBackground);
        document.addEventListener('themeChange', updateNavbarBackground);
        // Initialize immediately
        updateNavbarBackground();
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupCountersAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number').forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element) {
        const hasPlus = element.textContent.includes('+');
        const hasPercent = element.textContent.includes('%');
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const suffix = hasPlus ? '+' : (hasPercent ? '%' : '');

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.ceil(current) + suffix;
                setTimeout(updateCounter, 16);
            } else {
                element.textContent = target + suffix;
            }
        };

        updateCounter();
    }

    setupFeatureCardsAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
    }
}

const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
.shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    window.modernApp = new ModernResumeApp();
});
