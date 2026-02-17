# NAFTAL Client Feedback System

## Setup Instructions

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx) or XAMPP/WAMP

### Installation Steps

1. **Database Setup**
   \`\`\`sql
   -- Run the SQL script
   mysql -u root -p < scripts/create_database.sql
   \`\`\`

2. **Configuration**
   - Update database credentials in all PHP files
   - Ensure web server has write permissions

3. **File Structure**
   \`\`\`
   naftal-feedback-system/
   ├── index.html (redirects to welcome.html)
   ├── welcome.html
   ├── client-info.html
   ├── index.html (survey form)
   ├── summary.html
   ├── thank-you.html
   ├── submit_feedback.php
   ├── styles.css
   ├── script.js
   ├── admin/
   │   ├── login.html
   │   ├── dashboard.html
   │   ├── dashboard.php (old version)
   │   ├── login-process.php
   │   ├── get-dashboard-data.php
   │   └── admin-styles.css
   ├── assets/
   │   └── naftal-logo.webp
   └── scripts/
       ├── create_database.sql
       └── sample_data.sql
   \`\`\`

4. **Testing**
   - Access `welcome.html` to start the survey
   - Access `admin/login.html` for admin dashboard
   - Default admin credentials: admin/admin123

### User Flow
1. Welcome Page → Client Info → Survey (3 screens) → Summary → Thank You
2. Admin: Login → Dashboard with statistics and charts

### Features
- Multi-step survey form
- Client information collection
- Admin dashboard with charts
- Data export functionality
- Responsive design
- NAFTAL branding
