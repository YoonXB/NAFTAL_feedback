-- Insert sample feedback data for testing
USE naftal_feedback;

INSERT INTO feedback (
    visit_date, visit_time, services_used, station_quality, restroom_cleanliness,
    service_speed, staff_friendliness, product_availability, pricing_perception,
    encountered_problem, problem_details, suggestions, recommendation
) VALUES 
(
    '2024-01-15', '14:30:00', 'carburant,boutique', 3, 2, 3, 3, 3, 2,
    'non', NULL, 'Très bon service, continuez ainsi!', 'oui'
),
(
    '2024-01-14', '09:15:00', 'carburant,sanitaires', 2, 1, 2, 2, 3, 2,
    'oui', 'Les sanitaires étaient très sales', 'Améliorer la propreté des sanitaires', 'peut-etre'
),
(
    '2024-01-13', '16:45:00', 'carburant,lubrifiants,vidange', 3, 3, 3, 3, 3, 3,
    'non', NULL, 'Service excellent, personnel très professionnel', 'oui'
),
(
    '2024-01-12', '11:20:00', 'carburant,restaurant,station_lavage', 2, 2, 1, 2, 2, 2,
    'oui', 'Attente très longue au restaurant', 'Augmenter le personnel pendant les heures de pointe', 'non'
),
(
    '2024-01-11', '08:00:00', 'carburant,pneumatique,produits_entretiens', 3, NULL, 3, 3, 2, 2,
    'non', NULL, 'Bon service mais prix un peu élevés', 'oui'
);
