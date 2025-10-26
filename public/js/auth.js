// auth.js - Authentication helper functions

// Check if user is logged in
async function checkAuth() {
    try {
        const formData = new FormData();
        formData.append('action', 'check_session');
        
        const response = await fetch('/auth.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        return result.success;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Handle logout
async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('action', 'logout');
        
        const response = await fetch('/auth.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear any localStorage data
            localStorage.clear();
            
            // Show success message
            if (typeof showToast === 'function') {
                showToast('Logged out successfully', 'success');
            }
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = '/?page=login';
            }, 500);
        }
    } catch (error) {
        console.error('Logout error:', error);
        if (typeof showToast === 'function') {
            showToast('Error logging out', 'error');
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.getElementById('menu-icon');
    
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuIcon.textContent = '☰';
    } else {
        navLinks.classList.add('active');
        menuIcon.textContent = '✕';
    }
}

// Close mobile menu
function closeMenu() {
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.getElementById('menu-icon');
    
    navLinks.classList.remove('active');
    menuIcon.textContent = '☰';
}

// Initialize auth check on protected pages
document.addEventListener('DOMContentLoaded', async function() {
    const currentPage = new URLSearchParams(window.location.search).get('page');
    const protectedPages = ['dashboard', 'tickets'];
    
    // Only check auth on protected pages
    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = await checkAuth();
        
        if (!isLoggedIn) {
            window.location.href = '/?page=login';
        }
    }
});