<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "naftal_feedback";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get all feedback data
    $sql = "SELECT * FROM feedback ORDER BY created_at DESC";
    $feedback_data = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    
    // Set headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=naftal_feedback_' . date('Y-m-d') . '.csv');
    
    // Create output stream
    $output = fopen('php://output', 'w');
    
    // Add BOM for UTF-8
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Add CSV headers
    fputcsv($output, [
        'ID',
        'Date de visite',
        'Heure de visite',
        'Services utilisés',
        'Qualité station',
        'Propreté sanitaires',
        'Rapidité service',
        'Amabilité personnel',
        'Disponibilité produits',
        'Perception prix',
        'Problème rencontré',
        'Détails problème',
        'Suggestions',
        'Recommandation',
        'Date de soumission'
    ], ';');
    
    // Add data rows
    foreach ($feedback_data as $row) {
        fputcsv($output, [
            $row['id'],
            $row['visit_date'],
            $row['visit_time'],
            $row['services_used'],
            $row['station_quality'],
            $row['restroom_cleanliness'],
            $row['service_speed'],
            $row['staff_friendliness'],
            $row['product_availability'],
            $row['pricing_perception'],
            $row['encountered_problem'],
            $row['problem_details'],
            $row['suggestions'],
            $row['recommendation'],
            $row['created_at']
        ], ';');
    }
    
    fclose($output);
    
} catch (Exception $e) {
    die("Erreur : " . $e->getMessage());
}
?>
