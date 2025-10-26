<?php
// auth.php - Handle authentication requests (signup, login, logout)

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/database.php';

$db = Database::getInstance()->getConnection();
$action = $_POST['action'] ?? '';

// Helper function to send JSON response
function sendResponse($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// SIGNUP
if ($action === 'signup') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    
    // Validation
    if (empty($name) || empty($email) || empty($password) || empty($confirmPassword)) {
        sendResponse(false, 'Please fill in all fields');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Please enter a valid email address');
    }
    
    if (strlen($password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters long');
    }
    
    if ($password !== $confirmPassword) {
        sendResponse(false, 'Passwords do not match');
    }
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        sendResponse(false, 'Email already registered. Please login instead.');
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    try {
        $stmt = $db->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hashedPassword]);
        
        $userId = $db->lastInsertId();
        
        // Set session
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        
        sendResponse(true, 'Account created successfully!', [
            'user_id' => $userId,
            'name' => $name,
            'email' => $email
        ]);
        
    } catch (PDOException $e) {
        sendResponse(false, 'Registration failed. Please try again.');
    }
}

// LOGIN
if ($action === 'login') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Validation
    if (empty($email) || empty($password)) {
        sendResponse(false, 'Please fill in all fields');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Please enter a valid email address');
    }
    
    // Check credentials
    $stmt = $db->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        sendResponse(false, 'Invalid email or password');
    }
    
    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    
    sendResponse(true, 'Login successful!', [
        'user_id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ]);
}

// LOGOUT
if ($action === 'logout') {
    session_destroy();
    sendResponse(true, 'Logged out successfully');
}

// CHECK SESSION
if ($action === 'check_session') {
    if (isset($_SESSION['user_id'])) {
        sendResponse(true, 'Session active', [
            'user_id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ]);
    } else {
        sendResponse(false, 'No active session');
    }
}

// Invalid action
sendResponse(false, 'Invalid action');