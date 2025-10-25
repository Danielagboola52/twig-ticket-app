// Authentication utility functions

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return localStorage.getItem('ticketapp_session') !== null;
}

/**
 * Check authentication and redirect if not logged in
 */
function checkAuth() {
    if (!isAuthenticated()) {
        showToast('Please log in to access this page', 'error');
        setTimeout(() => {
            window.location.href = '/?page=login';
        }, 1500);
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    localStorage.removeItem('ticketapp_session');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

/**
 * Get current user info
 */
function getCurrentUser() {
    return {
        email: localStorage.getItem('user_email') || 'user@example.com',
        name: localStorage.getItem('user_name') || 'User'
    };
}