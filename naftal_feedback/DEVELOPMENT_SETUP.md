# NAFTAL Feedback System - Development Setup

## 🚨 Current Issue
You're getting "Une erreur est survenue" because the system needs a PHP server to work properly.

## 🔧 Quick Solutions

### Option 1: Use Development Version (No Server Needed)
1. Replace `summary.html` with `summary-dev.html` 
2. This version works without PHP/MySQL for testing
3. Data is simulated and not saved to database

### Option 2: Set Up Local PHP Server

#### Using XAMPP (Recommended)
1. Download and install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL services
3. Place all project files in `C:\xampp\htdocs\naftal-feedback\`
4. Access via `http://localhost/naftal-feedback/welcome.html`

#### Using PHP Built-in Server
\`\`\`bash
# Navigate to project folder
cd path/to/naftal-feedback-system

# Start PHP server
php -S localhost:8000

# Access via http://localhost:8000/welcome.html
\`\`\`

#### Using Node.js (Since you have package.json)
\`\`\`bash
# Install a simple HTTP server
npm install -g http-server

# Navigate to project folder
cd path/to/naftal-feedback-system

# Start server
http-server -p 8000

# Access via http://localhost:8000/welcome.html
\`\`\`

## 🗄️ Database Setup (For Full Version)

### 1. Create Database
\`\`\`sql
-- Run in phpMyAdmin or MySQL command line
CREATE DATABASE naftal_feedback;
USE naftal_feedback;

-- Run the create_database.sql script
SOURCE scripts/create_database.sql;

-- Add sample data
SOURCE scripts/sample_data.sql;
\`\`\`

### 2. Update PHP Configuration
Edit database credentials in all PHP files:
\`\`\`php
$servername = "localhost";
$username = "root";
$password = "";  // Your MySQL password
$dbname = "naftal_feedback";
\`\`\`

## 🧪 Testing Different Versions

### File Structure for Testing:
\`\`\`
naftal-feedback-system/
├── welcome.html              (Entry point)
├── client-info.html          (Client information)
├── index.html               (Survey form)
├── summary.html             (Original - needs PHP)
├── summary-dev.html         (Development - no PHP needed)
├── thank-you.html           (Final page)
├── admin-access.html        (Admin entry)
├── system-test.html         (Test all components)
└── admin/
    ├── login.html           (Admin login)
    ├── dashboard.html       (Modern dashboard)
    └── dashboard.php        (Full dashboard)
\`\`\`

## 🎯 Recommended Testing Flow

### For Development (No Server):
1. Open `welcome.html` in browser
2. Complete survey flow
3. When you reach summary, use `summary-dev.html` instead
4. This will simulate submission and redirect to thank you page

### For Production (With Server):
1. Set up XAMPP or PHP server
2. Create MySQL database
3. Access via `http://localhost/...` instead of `file://`
4. Full functionality with data persistence

## 🔍 Troubleshooting

### Common Issues:
1. **"Une erreur est survenue"** = No PHP server running
2. **CORS errors** = Opening files directly instead of via HTTP
3. **Database connection failed** = MySQL not running or wrong credentials
4. **404 errors** = Files not in correct web server directory

### Quick Fixes:
- Use `summary-dev.html` for testing without server
- Use `system-test.html` to check all components
- Check browser console for detailed error messages
\`\`\`

Now let me update the main survey form to redirect to the dev version when needed:
