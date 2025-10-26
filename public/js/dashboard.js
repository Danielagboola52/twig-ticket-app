// Dashboard Page Logic

// Check authentication on page load
checkAuth();

// Load stats when page loads
loadStats();

// Reload stats when the page becomes visible (user comes back from another page)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadStats();
    }
});

// Also reload stats when window gets focus
window.addEventListener('focus', function() {
    loadStats();
});

/**
 * Load and display dashboard statistics from backend
 */
async function loadStats() {
    try {
        const response = await fetch('/tickets_api.php?action=get_stats');
        const result = await response.json();
        
        if (result.success) {
            const stats = result.data.stats;
            
            // Update the display with animation
            animateValue('total-tickets', 0, parseInt(stats.total) || 0, 500);
            animateValue('open-tickets', 0, parseInt(stats.open) || 0, 500);
            animateValue('resolved-tickets', 0, parseInt(stats.closed) || 0, 500);
        } else {
            console.error('Failed to load stats:', result.message);
            
            // Set default values
            document.getElementById('total-tickets').textContent = '0';
            document.getElementById('open-tickets').textContent = '0';
            document.getElementById('resolved-tickets').textContent = '0';
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        
        // Set default values on error
        document.getElementById('total-tickets').textContent = '0';
        document.getElementById('open-tickets').textContent = '0';
        document.getElementById('resolved-tickets').textContent = '0';
        
        if (typeof showToast === 'function') {
            showToast('Error loading dashboard data', 'error');
        }
    }
}

/**
 * Animate number counting up
 */
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
    }, 16);
}

// Mobile menu variables
let menuOpen = false;

function toggleMobileMenu() {
    menuOpen = !menuOpen;
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.getElementById('menu-icon');
    
    if (menuOpen) {
        navLinks.classList.add('mobile-open');
        menuIcon.textContent = '✕';
    } else {
        navLinks.classList.remove('mobile-open');
        menuIcon.textContent = '☰';
    }
}

function closeMenu() {
    menuOpen = false;
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.getElementById('menu-icon');
    navLinks.classList.remove('mobile-open');
    menuIcon.textContent = '☰';
}