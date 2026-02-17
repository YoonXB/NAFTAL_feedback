<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "naftal_feedback";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get feedback statistics
    $stats_sql = "SELECT 
        COUNT(*) as total_feedback,
        AVG(station_quality) as avg_station_quality,
        AVG(service_speed) as avg_service_speed,
        AVG(staff_friendliness) as avg_staff_friendliness,
        AVG(product_availability) as avg_product_availability,
        AVG(pricing_perception) as avg_pricing_perception,
        SUM(CASE WHEN recommendation = 'oui' THEN 1 ELSE 0 END) as would_recommend,
        SUM(CASE WHEN encountered_problem = 'oui' THEN 1 ELSE 0 END) as had_problems
        FROM feedback";
    
    $stats = $pdo->query($stats_sql)->fetch(PDO::FETCH_ASSOC);
    
    // Get recent feedback
    $recent_sql = "SELECT * FROM feedback ORDER BY created_at DESC LIMIT 10";
    $recent_feedback = $pdo->query($recent_sql)->fetchAll(PDO::FETCH_ASSOC);
    
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAFTAL - Tableau de Bord Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .logo-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .company-logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
            border-radius: 8px;
            background: white;
            padding: 5px;
        }

        .company-info h1 {
            margin: 0;
            font-size: 1.8em;
        }

        .company-info p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-card h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
        }
        
        .feedback-table {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .table-header {
            background: #3498db;
            color: white;
            padding: 20px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background: #f8f9fa;
            font-weight: bold;
        }
        
        .rating {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
        }
        
        .rating-3 { background: #27ae60; }
        .rating-2 { background: #f39c12; }
        .rating-1 { background: #e74c3c; }
        
        .export-btn {
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        
        .export-btn:hover {
            background: #219a52;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-header">
                <img src="../assets/naftal-logo.webp" alt="NAFTAL Logo" class="company-logo">
                <div class="company-info">
                    <h1>NAFTAL - Tableau de Bord Admin</h1>
                    <p>Gestion des retours clients</p>
                </div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Retours</h3>
                <div class="stat-value"><?= $stats['total_feedback'] ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Qualité Station</h3>
                <div class="stat-value"><?= number_format($stats['avg_station_quality'], 1) ?>/3</div>
            </div>
            
            <div class="stat-card">
                <h3>Rapidité Service</h3>
                <div class="stat-value"><?= number_format($stats['avg_service_speed'], 1) ?>/3</div>
            </div>
            
            <div class="stat-card">
                <h3>Amabilité Personnel</h3>
                <div class="stat-value"><?= number_format($stats['avg_staff_friendliness'], 1) ?>/3</div>
            </div>
            
            <div class="stat-card">
                <h3>Recommandations</h3>
                <div class="stat-value"><?= $stats['would_recommend'] ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Problèmes Signalés</h3>
                <div class="stat-value"><?= $stats['had_problems'] ?></div>
            </div>
        </div>
        
        <button class="export-btn" onclick="exportToCSV()">Exporter en CSV</button>
        
        <div class="feedback-table">
            <div class="table-header">
                <h2>Retours Récents</h2>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Services</th>
                        <th>Qualité Station</th>
                        <th>Rapidité</th>
                        <th>Personnel</th>
                        <th>Recommandation</th>
                        <th>Problème</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_feedback as $feedback): ?>
                    <tr>
                        <td><?= date('d/m/Y', strtotime($feedback['visit_date'])) ?></td>
                        <td><?= htmlspecialchars($feedback['services_used']) ?></td>
                        <td><span class="rating rating-<?= $feedback['station_quality'] ?>"><?= $feedback['station_quality'] ?></span></td>
                        <td><span class="rating rating-<?= $feedback['service_speed'] ?>"><?= $feedback['service_speed'] ?></span></td>
                        <td><span class="rating rating-<?= $feedback['staff_friendliness'] ?>"><?= $feedback['staff_friendliness'] ?></span></td>
                        <td><?= ucfirst($feedback['recommendation']) ?></td>
                        <td><?= $feedback['encountered_problem'] === 'oui' ? 'Oui' : 'Non' ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        function exportToCSV() {
            window.location.href = 'export_csv.php';
        }
    </script>
</body>
</html>
