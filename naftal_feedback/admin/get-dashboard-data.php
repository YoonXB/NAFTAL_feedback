<?php
session_start();
header('Content-Type: application/json');

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "naftal_feedback";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $data = [];
    
    // Total feedbacks
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM feedback");
    $data['totalFeedbacks'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Average satisfaction
    $stmt = $pdo->query("SELECT AVG((station_quality + service_speed + staff_friendliness + product_availability + pricing_perception) / 5) as avg_satisfaction FROM feedback");
    $data['avgSatisfaction'] = $stmt->fetch(PDO::FETCH_ASSOC)['avg_satisfaction'];
    
    // Recommendation rate
    $stmt = $pdo->query("SELECT 
        (COUNT(CASE WHEN recommendation = 'oui' THEN 1 END) * 100.0 / COUNT(*)) as rate 
        FROM feedback");
    $data['recommendationRate'] = $stmt->fetch(PDO::FETCH_ASSOC)['rate'];
    
    // Problems reported
    $stmt = $pdo->query("SELECT COUNT(*) as problems FROM feedback WHERE encountered_problem = 'oui'");
    $data['problemsReported'] = $stmt->fetch(PDO::FETCH_ASSOC)['problems'];
    
    // Feedback trend (last 7 days)
    $stmt = $pdo->query("SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
        FROM feedback 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
        GROUP BY DATE(created_at) 
        ORDER BY date");
    $trendData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $data['feedbackTrend'] = [
        'labels' => array_map(function($item) { return date('d/m', strtotime($item['date'])); }, $trendData),
        'data' => array_map(function($item) { return (int)$item['count']; }, $trendData)
    ];
    
    // Recommendation data
    $stmt = $pdo->query("SELECT 
        recommendation, 
        COUNT(*) as count 
        FROM feedback 
        GROUP BY recommendation");
    $recData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $recCounts = ['oui' => 0, 'non' => 0, 'peut-etre' => 0];
    foreach ($recData as $item) {
        $recCounts[$item['recommendation']] = (int)$item['count'];
    }
    $data['recommendationData'] = array_values($recCounts);
    
    // Satisfaction by category
    $stmt = $pdo->query("SELECT 
        AVG(station_quality) as station_quality,
        AVG(restroom_cleanliness) as restroom_cleanliness,
        AVG(service_speed) as service_speed,
        AVG(staff_friendliness) as staff_friendliness,
        AVG(product_availability) as product_availability,
        AVG(pricing_perception) as pricing_perception
        FROM feedback");
    $satData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $data['satisfactionByCategory'] = [
        (float)$satData['station_quality'],
        (float)$satData['restroom_cleanliness'],
        (float)$satData['service_speed'],
        (float)$satData['staff_friendliness'],
        (float)$satData['product_availability'],
        (float)$satData['pricing_perception']
    ];
    
    // Rating distribution
    $stmt = $pdo->query("SELECT 
        SUM(CASE WHEN station_quality = 1 OR service_speed = 1 OR staff_friendliness = 1 OR product_availability = 1 OR pricing_perception = 1 THEN 1 ELSE 0 END) as rating_1,
        SUM(CASE WHEN station_quality = 2 OR service_speed = 2 OR staff_friendliness = 2 OR product_availability = 2 OR pricing_perception = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN station_quality = 3 OR service_speed = 3 OR staff_friendliness = 3 OR product_availability = 3 OR pricing_perception = 3 THEN 1 ELSE 0 END) as rating_3
        FROM feedback");
    $ratingDist = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $data['ratingDistribution'] = [
        (int)$ratingDist['rating_1'],
        (int)$ratingDist['rating_2'],
        (int)$ratingDist['rating_3']
    ];
    
    // Services usage
    $stmt = $pdo->query("SELECT services_used FROM feedback");
    $servicesData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $servicesCounts = [];
    foreach ($servicesData as $row) {
        $services = explode(',', $row['services_used']);
        foreach ($services as $service) {
            $service = trim($service);
            if (!isset($servicesCounts[$service])) {
                $servicesCounts[$service] = 0;
            }
            $servicesCounts[$service]++;
        }
    }
    
    arsort($servicesCounts);
    $data['servicesUsage'] = [
        'labels' => array_keys($servicesCounts),
        'data' => array_values($servicesCounts)
    ];
    
    // Visit frequency
    $stmt = $pdo->query("SELECT 
        visit_frequency, 
        COUNT(*) as count 
        FROM feedback 
        WHERE visit_frequency IS NOT NULL 
        GROUP BY visit_frequency");
    $freqData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $freqCounts = ['premiere_fois' => 0, 'occasionnelle' => 0, 'reguliere' => 0, 'quotidienne' => 0];
    foreach ($freqData as $item) {
        $freqCounts[$item['visit_frequency']] = (int)$item['count'];
    }
    $data['visitFrequency'] = array_values($freqCounts);
    
    // Problems trend
    $stmt = $pdo->query("SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
        FROM feedback 
        WHERE encountered_problem = 'oui' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
        GROUP BY DATE(created_at) 
        ORDER BY date");
    $problemsTrendData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $data['problemsTrend'] = [
        'labels' => array_map(function($item) { return date('d/m', strtotime($item['date'])); }, $problemsTrendData),
        'data' => array_map(function($item) { return (int)$item['count']; }, $problemsTrendData)
    ];
    
    // Recent problems
    $stmt = $pdo->query("SELECT client_name, problem_details, created_at 
        FROM feedback 
        WHERE encountered_problem = 'oui' AND problem_details IS NOT NULL 
        ORDER BY created_at DESC 
        LIMIT 5");
    $data['recentProblems'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Recent suggestions
    $stmt = $pdo->query("SELECT client_name, suggestions, created_at 
        FROM feedback 
        WHERE suggestions IS NOT NULL AND suggestions != '' 
        ORDER BY created_at DESC 
        LIMIT 5");
    $data['recentSuggestions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Recommendation trend
    $stmt = $pdo->query("SELECT 
        DATE(created_at) as date,
        (COUNT(CASE WHEN recommendation = 'oui' THEN 1 END) * 100.0 / COUNT(*)) as rate
        FROM feedback 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
        GROUP BY DATE(created_at) 
        ORDER BY date");
    $recTrendData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $data['recommendationTrend'] = [
        'labels' => array_map(function($item) { return date('d/m', strtotime($item['date'])); }, $recTrendData),
        'data' => array_map(function($item) { return round((float)$item['rate'], 1); }, $recTrendData)
    ];
    
    echo json_encode($data);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
