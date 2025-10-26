<?php
// tickets_api.php - Handle ticket operations (CRUD)

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/database.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$db = Database::getInstance()->getConnection();
$userId = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

function sendResponse($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// GET ALL TICKETS for current user
if ($action === 'get_all') {
    $stmt = $db->prepare("
        SELECT id, title, description, status, priority, created_at, updated_at
        FROM tickets
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$userId]);
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Tickets retrieved', ['tickets' => $tickets]);
}

// GET SINGLE TICKET
if ($action === 'get') {
    $ticketId = $_GET['id'] ?? 0;
    
    $stmt = $db->prepare("
        SELECT id, title, description, status, priority, created_at, updated_at
        FROM tickets
        WHERE id = ? AND user_id = ?
    ");
    $stmt->execute([$ticketId, $userId]);
    $ticket = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$ticket) {
        sendResponse(false, 'Ticket not found');
    }
    
    sendResponse(true, 'Ticket retrieved', ['ticket' => $ticket]);
}

// CREATE TICKET
if ($action === 'create') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $status = trim($_POST['status'] ?? '');
    $priority = trim($_POST['priority'] ?? '');
    
    if (empty($title) || empty($status)) {
        sendResponse(false, 'Title and status are required');
    }
    
    $validStatuses = ['open', 'in_progress', 'closed'];
    if (!in_array($status, $validStatuses)) {
        sendResponse(false, 'Invalid status');
    }
    
    try {
        $stmt = $db->prepare("
            INSERT INTO tickets (user_id, title, description, status, priority)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $title, $description, $status, $priority]);
        
        $ticketId = $db->lastInsertId();
        
        sendResponse(true, 'Ticket created successfully', ['ticket_id' => $ticketId]);
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to create ticket');
    }
}

// UPDATE TICKET
if ($action === 'update') {
    $ticketId = $_POST['id'] ?? 0;
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $status = trim($_POST['status'] ?? '');
    $priority = trim($_POST['priority'] ?? '');
    
    if (empty($title) || empty($status)) {
        sendResponse(false, 'Title and status are required');
    }
    
    $validStatuses = ['open', 'in_progress', 'closed'];
    if (!in_array($status, $validStatuses)) {
        sendResponse(false, 'Invalid status');
    }
    
    // Check if ticket belongs to user
    $stmt = $db->prepare("SELECT id FROM tickets WHERE id = ? AND user_id = ?");
    $stmt->execute([$ticketId, $userId]);
    
    if (!$stmt->fetch()) {
        sendResponse(false, 'Ticket not found or access denied');
    }
    
    try {
        $stmt = $db->prepare("
            UPDATE tickets
            SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$title, $description, $status, $priority, $ticketId, $userId]);
        
        sendResponse(true, 'Ticket updated successfully');
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to update ticket');
    }
}

// DELETE TICKET
if ($action === 'delete') {
    $ticketId = $_POST['id'] ?? 0;
    
    // Check if ticket belongs to user
    $stmt = $db->prepare("SELECT id FROM tickets WHERE id = ? AND user_id = ?");
    $stmt->execute([$ticketId, $userId]);
    
    if (!$stmt->fetch()) {
        sendResponse(false, 'Ticket not found or access denied');
    }
    
    try {
        $stmt = $db->prepare("DELETE FROM tickets WHERE id = ? AND user_id = ?");
        $stmt->execute([$ticketId, $userId]);
        
        sendResponse(true, 'Ticket deleted successfully');
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to delete ticket');
    }
}

// GET STATS (for dashboard)
if ($action === 'get_stats') {
    $stmt = $db->prepare("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
            SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
        FROM tickets
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Stats retrieved', ['stats' => $stats]);
}

sendResponse(false, 'Invalid action');