<?php
session_start();
header('Content-Type: application/json');

// Simple authentication check
$authenticated = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

echo json_encode([
    'authenticated' => $authenticated,
    'debug' => [
        'session_id' => session_id(),
        'session_data' => $_SESSION,
        'time' => date('Y-m-d H:i:s')
    ]
]);
?>
