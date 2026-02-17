-- Create database
CREATE DATABASE IF NOT EXISTS naftal_feedback CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE naftal_feedback;

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
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

-- Create admin users table (optional)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@naftal.com')
ON DUPLICATE KEY UPDATE username = username;
