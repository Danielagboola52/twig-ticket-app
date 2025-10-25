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
 * Load and display dashboard statistics
 */
function loadStats() {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'closed').length;

    // Update the display
    document.getElementById('total-tickets').textContent = totalTickets;
    document.getElementById('open-tickets').textContent = openTickets + inProgressTickets;
    document.getElementById('resolved-tickets').textContent = resolvedTickets;
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