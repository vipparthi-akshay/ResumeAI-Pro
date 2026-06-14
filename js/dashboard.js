// Dashboard with charts and animations
class Dashboard {
    constructor() {
        this.initCharts();
        this.setupAnimations();
        this.setupInteractiveElements();
    }

    initCharts() {
        // Create a simple bar chart for resume statistics
        this.createStatsChart();

        // Create a line chart for activity over time
        this.createActivityChart();
    }

    createStatsChart() {
        const ctx = document.getElementById('statsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Resumes Created',
                    data: [12, 19, 8, 15, 22, 18],
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Downloads',
                    data: [65, 78, 45, 92],
                    borderColor: 'rgba(37, 99, 235, 1)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    setupAnimations() {
        // Animate cards on load
        this.animateCards();

        // Animate progress bars
        this.animateProgressBars();

        // Setup hover effects
        this.setupHoverEffects();
    }

    animateCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';

            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = width;
            }, 500);
        });
    }

    setupHoverEffects() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            });
        });
    }

    setupInteractiveElements() {
        // Setup sidebar navigation
        this.setupSidebarNavigation();

        // Setup quick action buttons
        this.setupQuickActions();

        // Setup theme toggle
        this.setupThemeToggle();
    }

    setupSidebarNavigation() {
        const navItems = document.querySelectorAll('.sidebar li, .nav-menu .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    setupQuickActions() {
        const buttons = document.querySelectorAll('.quick-actions button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.animateButton(button);
                this.showNotification(`Action triggered: ${button.textContent}`);
            });
        });
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.animateThemeToggle();
            // Also call theme manager toggle to switch theme (if available)
            if (window.themeManager && typeof window.themeManager.toggle === 'function') {
                window.themeManager.toggle();
            }
        });
    }

    animateThemeToggle() {
        const icon = document.getElementById('themeToggle');
        if (!icon) return;
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = 'transform 0.5s ease';

        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 500);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2563eb;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dashboard-container') || document.querySelector('.dashboard-nav')) {
        window.dashboard = new Dashboard();
    }
});
