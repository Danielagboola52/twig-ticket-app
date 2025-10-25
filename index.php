<?php
// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';

// Set up Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false, // Disable cache for development
    'debug' => true,
]);

// Get the requested page from URL (default to 'landing')
$page = $_GET['page'] ?? 'landing';

// Map pages to templates
$templates = [
    'landing' => 'landing.twig',
    'login' => 'login.twig',
    'signup' => 'signup.twig',
    'dashboard' => 'dashboard.twig',
    'tickets' => 'tickets.twig',
];

// Get the template to render (fallback to landing if invalid)
$template = $templates[$page] ?? 'landing.twig';

// Render the template with common variables
try {
    echo $twig->render($template, [
        'page' => $page,
        'app_name' => 'TicketFlow',
        'current_year' => date('Y'),
    ]);
} catch (Exception $e) {
    // Error handling
    echo "Error rendering template: " . $e->getMessage();
}
?>