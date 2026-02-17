-- NAFTAL Feedback System Database Setup for WAMP
-- Run this in phpMyAdmin SQL tab

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS naftal_feedback CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE naftal_feedback;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS admin_users;

-- Create feedback table with all required fields
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) DEFAULT NULL,
    client_email VARCHAR(100) DEFAULT NULL,
    visit_frequency ENUM('premiere_fois', 'occasionnelle', 'reguliere', 'quotidienne') DEFAULT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    services_used TEXT NOT NULL,
    station_quality TINYINT NOT NULL CHECK (station_quality BETWEEN 1 AND 3),
    restroom_cleanliness TINYINT DEFAULT NULL CHECK (restroom_cleanliness BETWEEN 1 AND 3),
    service_speed TINYINT NOT NULL CHECK (service_speed BETWEEN 1 AND 3),
    staff_friendliness TINYINT NOT NULL CHECK (staff_friendliness BETWEEN 1 AND 3),
    product_availability TINYINT NOT NULL CHECK (product_availability BETWEEN 1 AND 3),
    pricing_perception TINYINT NOT NULL CHECK (pricing_perception BETWEEN 1 AND 3),
    encountered_problem ENUM('oui', 'non') NOT NULL,
    problem_details TEXT DEFAULT NULL,
    suggestions TEXT DEFAULT NULL,
    recommendation ENUM('oui', 'non', 'peut-etre') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_name (client_name),
    INDEX idx_visit_date (visit_date),
    INDEX idx_created_at (created_at),
    INDEX idx_recommendation (recommendation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@naftal.com');

-- Insert sample feedback data for testing
INSERT INTO feedback (
    client_name, client_phone, client_email, visit_frequency,
    visit_date, visit_time, services_used, station_quality, restroom_cleanliness,
    service_speed, staff_friendliness, product_availability, pricing_perception,
    encountered_problem, problem_details, suggestions, recommendation
) VALUES 
(
    'Ahmed Benali', '+213 555 123 456', 'ahmed.benali@email.com', 'reguliere',
    '2024-01-15', '14:30:00', 'carburant,boutique', 3, 2, 3, 3, 3, 2,
    'non', NULL, 'Très bon service, continuez ainsi!', 'oui'
),
(
    'Fatima Khelil', '+213 666 789 012', 'fatima.k@email.com', 'occasionnelle',
    '2024-01-14', '09:15:00', 'carburant,sanitaires', 2, 1, 2, 2, 3, 2,
    'oui', 'Les sanitaires étaient très sales', 'Améliorer la propreté des sanitaires', 'peut-etre'
),
(
    'Mohamed Saidi', '+213 777 345 678', 'mohamed.saidi@email.com', 'quotidienne',
    '2024-01-13', '16:45:00', 'carburant,lubrifiants,vidange', 3, 3, 3, 3, 3, 3,
    'non', NULL, 'Service excellent, personnel très professionnel', 'oui'
),
(
    'Amina Boucher', '+213 888 901 234', 'amina.b@email.com', 'premiere_fois',
    '2024-01-12', '11:20:00', 'carburant,restaurant,station_lavage', 2, 2, 1, 2, 2, 2,
    'oui', 'Attente très longue au restaurant', 'Augmenter le personnel pendant les heures de pointe', 'non'
),
(
    'Karim Meziane', '+213 999 567 890', 'karim.m@email.com', 'reguliere',
    '2024-01-11', '08:00:00', 'carburant,pneumatique,produits_entretiens', 3, NULL, 3, 3, 2, 2,
    'non', NULL, 'Bon service mais prix un peu élevés', 'oui'
);

-- Verify installation
SELECT 'Database created successfully!' as Status;
SELECT COUNT(*) as 'Sample Feedback Records' FROM feedback;
SELECT COUNT(*) as 'Admin Users' FROM admin_users;
