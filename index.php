<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/database.php';

Database::getInstance();

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false, 
    'debug' => true,
]);

$page = $_GET['page'] ?? 'landing';

$protectedPages = ['dashboard', 'tickets'];

$isLoggedIn = isset($_SESSION['user_id']);

if (in_array($page, $protectedPages) && !$isLoggedIn) {
    header('Location: /?page=login');
    exit;
}

if (in_array($page, ['login', 'signup']) && $isLoggedIn) {
    header('Location: /?page=dashboard');
    exit;
}


$templates = [
    'landing' => 'landing.twig',
    'login' => 'login.twig',
    'signup' => 'signup.twig',
    'dashboard' => 'dashboard.twig',
    'tickets' => 'tickets.twig',
];


$template = $templates[$page] ?? 'landing.twig';


$templateVars = [
    'page' => $page,
    'app_name' => 'TicketFlow',
    'current_year' => date('Y'),
    'is_logged_in' => $isLoggedIn,
];


if ($isLoggedIn) {
    $templateVars['user'] = [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
    ];
}


try {
    echo $twig->render($template, $templateVars);
} catch (Exception $e) {
    
    echo "Error rendering template: " . $e->getMessage();
}