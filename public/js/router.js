// Router utility functions

/**
 * Navigate to a different page
 */
function navigateTo(page) {
    window.location.href = `/?page=${page}`;
}

/**
 * Get current page from URL
 */
function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('page') || 'landing';
}

/**
 * Redirect with delay
 */
function redirectTo(page, delay = 0) {
    setTimeout(() => {
        navigateTo(page);
    }, delay);
}