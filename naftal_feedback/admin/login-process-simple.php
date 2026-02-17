<?php
session_start();
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        error_log("Login attempt: username=$username");
        
        if (empty($username) || empty($password)) {
            throw new Exception('Nom d\'utilisateur et mot de passe requis');
        }
        
        // Simple hardcoded check for testing
        if ($username === 'admin' && $password === 'admin123') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = 1;
            $_SESSION['admin_username'] = 'admin';
            
            error_log("Login successful for: $username");
            
            echo json_encode([
                'success' => true, 
                'message' => 'Connexion réussie',
                'debug' => [
                    'session_id' => session_id(),
                    'time' => date('Y-m-d H:i:s')
                ]
            ]);
        } else {
            error_log("Login failed for: $username");
            throw new Exception('Nom d\'utilisateur ou mot de passe incorrect');
        }
    } else {
        throw new Exception('Méthode non autorisée');
    }
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
