// Tickets Page Logic

// Check authentication on page load
checkAuth();

// State variables
let tickets = [];
let currentTicket = null;
let isEditMode = false;

// Load tickets on page load
loadTickets();

/**
 * Load tickets from localStorage
 */
function loadTickets() {
    const stored = localStorage.getItem('tickets');
    tickets = stored ? JSON.parse(stored) : [];
    renderTickets();
}

/**
 * Save tickets to localStorage
 */
function saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

/**
 * Render tickets to the grid
 */
function renderTickets() {
    const grid = document.getElementById('tickets-grid');
    const emptyState = document.getElementById('empty-state');

    if (tickets.length === 0) {
        emptyState.style.display = 'block';
        grid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        grid.style.display = 'grid';
        grid.innerHTML = tickets.map(ticket => createTicketCard(ticket)).join('');
    }
}

/**
 * Create HTML for a ticket card
 */
function createTicketCard(ticket) {
    const statusClass = ticket.status;
    const statusLabel = getStatusLabel(ticket.status);
    const date = formatDate(ticket.createdAt);
    const priorityHTML = ticket.priority ? `
        <span class="ticket-priority">
            Priority: <strong>${ticket.priority}</strong>
        </span>
    ` : '';

    return `
        <div class="ticket-card">
            <div class="ticket-header">
                <h3 class="ticket-title">${escapeHtml(ticket.title)}</h3>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            
            ${ticket.description ? `
                <p class="ticket-description">${escapeHtml(ticket.description)}</p>
            ` : ''}
            
            <div class="ticket-meta">
                ${priorityHTML}
                <span class="ticket-date">${date}</span>
            </div>

            <div class="ticket-actions">
                <button onclick="openEditModal(${ticket.id})" class="btn-action btn-edit">
                    ✏️ Edit
                </button>
                <button onclick="openDeleteModal(${ticket.id})" class="btn-action btn-delete">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
}

/**
 * Open create modal
 */
function openCreateModal() {
    isEditMode = false;
    currentTicket = null;
    document.getElementById('modal-title').textContent = 'Create New Ticket';
    document.getElementById('submit-btn').textContent = 'Create Ticket';
    resetForm();
    document.getElementById('modal-overlay').style.display = 'flex';
}

/**
 * Open edit modal
 */
function openEditModal(ticketId) {
    isEditMode = true;
    currentTicket = tickets.find(t => t.id === ticketId);
    
    if (currentTicket) {
        document.getElementById('modal-title').textContent = 'Edit Ticket';
        document.getElementById('submit-btn').textContent = 'Update Ticket';
        
        // Fill form with current ticket data
        document.getElementById('title').value = currentTicket.title;
        document.getElementById('description').value = currentTicket.description || '';
        document.getElementById('status').value = currentTicket.status;
        document.getElementById('priority').value = currentTicket.priority || '';
        
        document.getElementById('modal-overlay').style.display = 'flex';
    }
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    resetForm();
}

/**
 * Close modal when clicking overlay
 */
function closeModalOnOverlay(event) {
    if (event.target.id === 'modal-overlay') {
        closeModal();
    }
}

/**
 * Reset form fields and errors
 */
function resetForm() {
    document.getElementById('ticket-form').reset();
    document.getElementById('title-error').style.display = 'none';
    document.getElementById('status-error').style.display = 'none';
    document.getElementById('title').classList.remove('error');
    document.getElementById('status').classList.remove('error');
}

/**
 * Validate form
 */
function validateForm() {
    let isValid = true;
    const title = document.getElementById('title').value.trim();
    const status = document.getElementById('status').value;

    // Clear previous errors
    document.getElementById('title-error').style.display = 'none';
    document.getElementById('status-error').style.display = 'none';
    document.getElementById('title').classList.remove('error');
    document.getElementById('status').classList.remove('error');

    // Validate title
    if (!title) {
        document.getElementById('title-error').textContent = 'Title is required';
        document.getElementById('title-error').style.display = 'block';
        document.getElementById('title').classList.add('error');
        isValid = false;
    }

    // Validate status
    if (!status) {
        document.getElementById('status-error').textContent = 'Status is required';
        document.getElementById('status-error').style.display = 'block';
        document.getElementById('status').classList.add('error');
        isValid = false;
    } else if (!['open', 'in_progress', 'closed'].includes(status)) {
        document.getElementById('status-error').textContent = 'Invalid status selected';
        document.getElementById('status-error').style.display = 'block';
        document.getElementById('status').classList.add('error');
        isValid = false;
    }

    return isValid;
}

/**
 * Handle form submission
 */
document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }

    const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value
    };

    if (isEditMode && currentTicket) {
        // Update existing ticket
        const index = tickets.findIndex(t => t.id === currentTicket.id);
        if (index !== -1) {
            tickets[index] = {
                ...currentTicket,
                ...formData
            };
            showToast('Ticket updated successfully!', 'success');
        }
    } else {
        // Create new ticket
        const newTicket = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };
        tickets.unshift(newTicket);
        showToast('Ticket created successfully!', 'success');
    }

    saveTickets();
    renderTickets();
    closeModal();
});

/**
 * Open delete confirmation modal
 */
function openDeleteModal(ticketId) {
    currentTicket = tickets.find(t => t.id === ticketId);
    if (currentTicket) {
        document.getElementById('delete-ticket-title').textContent = `"${currentTicket.title}"`;
        document.getElementById('delete-modal').style.display = 'flex';
    }
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    currentTicket = null;
}

/**
 * Close delete modal when clicking overlay
 */
function closeDeleteModalOnOverlay(event) {
    if (event.target.id === 'delete-modal') {
        closeDeleteModal();
    }
}

/**
 * Confirm and delete ticket
 */
function confirmDeleteTicket() {
    if (currentTicket) {
        tickets = tickets.filter(t => t.id !== currentTicket.id);
        saveTickets();
        renderTickets();
        closeDeleteModal();
        showToast('Ticket deleted successfully', 'success');
    }
}

/**
 * Get status label
 */
function getStatusLabel(status) {
    const labels = {
        open: 'Open',
        in_progress: 'In Progress',
        closed: 'Closed'
    };
    return labels[status] || status;
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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