<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "naftal_feedback";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Sanitize and validate input data
        $client_name = $_POST['client_name'] ?? '';
        $client_phone = $_POST['client_phone'] ?? '';
        $client_email = $_POST['client_email'] ?? '';
        $visit_frequency = $_POST['visit_frequency'] ?? '';
        $visit_date = $_POST['visit_date'] ?? '';
        $visit_time = $_POST['visit_time'] ?? '';
        $services = isset($_POST['services']) ? implode(',', $_POST['services']) : '';
        $station_quality = (int)($_POST['station_quality'] ?? 0);
        $restroom_cleanliness = (int)($_POST['restroom_cleanliness'] ?? 0);
        $service_speed = (int)($_POST['service_speed'] ?? 0);
        $staff_friendliness = (int)($_POST['staff_friendliness'] ?? 0);
        $product_availability = (int)($_POST['product_availability'] ?? 0);
        $pricing_perception = (int)($_POST['pricing_perception'] ?? 0);
        $encountered_problem = $_POST['encountered_problem'] ?? '';
        $problem_details = $_POST['problem_details'] ?? '';
        $suggestions = $_POST['suggestions'] ?? '';
        $recommendation = $_POST['recommendation'] ?? '';
        
        // Validate required fields
        if (empty($client_name) || empty($visit_date) || empty($visit_time) || empty($services) || 
            $station_quality === 0 || $service_speed === 0 || $staff_friendliness === 0 || 
            $product_availability === 0 || $pricing_perception === 0 || empty($recommendation)) {
            throw new Exception('Tous les champs obligatoires doivent être remplis.');
        }
        
        // Insert feedback into database
        $sql = "INSERT INTO feedback (
            client_name, client_phone, client_email, visit_frequency,
            visit_date, visit_time, services_used, station_quality, restroom_cleanliness,
            service_speed, staff_friendliness, product_availability, pricing_perception,
            encountered_problem, problem_details, suggestions, recommendation, created_at
        ) VALUES (
            :client_name, :client_phone, :client_email, :visit_frequency,
            :visit_date, :visit_time, :services_used, :station_quality, :restroom_cleanliness,
            :service_speed, :staff_friendliness, :product_availability, :pricing_perception,
            :encountered_problem, :problem_details, :suggestions, :recommendation, NOW()
        )";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':client_name' => $client_name,
            ':client_phone' => $client_phone,
            ':client_email' => $client_email,
            ':visit_frequency' => $visit_frequency,
            ':visit_date' => $visit_date,
            ':visit_time' => $visit_time,
            ':services_used' => $services,
            ':station_quality' => $station_quality,
            ':restroom_cleanliness' => $restroom_cleanliness,
            ':service_speed' => $service_speed,
            ':staff_friendliness' => $staff_friendliness,
            ':product_availability' => $product_availability,
            ':pricing_perception' => $pricing_perception,
            ':encountered_problem' => $encountered_problem,
            ':problem_details' => $problem_details,
            ':suggestions' => $suggestions,
            ':recommendation' => $recommendation
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Feedback enregistré avec succès']);
        
    } else {
        throw new Exception('Méthode non autorisée');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
