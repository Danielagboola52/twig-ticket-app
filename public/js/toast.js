// Toast notification system

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'success', duration = 3000) {
    // Get or create toast container
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✓ ';
            break;
        case 'error':
            icon = '✕ ';
            break;
        case 'warning':
            icon = '⚠ ';
            break;
        case 'info':
            icon = 'ℹ ';
            break;
    }
    toast.textContent = icon + message;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Add toast styles dynamically if not already present
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        #toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .toast {
            background: white;
            color: #1e293b;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 250px;
            max-width: 400px;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 0.95rem;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        .toast-success {
            border-left: 4px solid #10b981;
        }

        .toast-error {
            border-left: 4px solid #dc2626;
        }

        .toast-warning {
            border-left: 4px solid #f59e0b;
        }

        .toast-info {
            border-left: 4px solid #3b82f6;
        }

        @media (max-width: 768px) {
            #toast-container {
                top: 10px;
                right: 10px;
                left: 10px;
            }

            .toast {
                min-width: auto;
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}