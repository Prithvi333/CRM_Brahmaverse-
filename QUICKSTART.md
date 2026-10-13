# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
Open MySQL and run:
```bash
mysql -u root -p < database/setup.sql
```
Enter your MySQL password when prompted.

**Or via MySQL CLI**:
```sql
CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  course_interest VARCHAR(255) NOT NULL,
  claimed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (claimed_by) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE INDEX idx_claimed_by ON enquiries(claimed_by);
```

### 3. Configure Environment
Check `.env` file has correct database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root        # Change if different
DB_NAME=crm_db
DB_PORT=3306
JWT_SECRET=crm_lead_management_secret_key_2026
PORT=5000
```

### 4. Start Server
```bash
npm start
```

Server starts on `http://localhost:5000`

You'll see:
```
Server running on port 5000
```

---

## Quick Test (Using cURL)

### Register Employee
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the `token` from response.

### Submit Enquiry (No Auth Required)
```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "9876543210",
    "email": "john@university.com",
    "course_interest": "Python Programming"
  }'
```

### Get Unclaimed Enquiries (Replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/enquiries/public \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Claim Enquiry
```bash
curl -X PATCH http://localhost:5000/api/enquiries/1/claim \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Get My Enquiries
```bash
curl -X GET http://localhost:5000/api/enquiries/my \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## Using Postman

1. **Import Collection**
   - File → Import
   - Select `CRM_API_Postman_Collection.json`

2. **Register and Login**
   - Run "Register Employee" request
   - Run "Login Employee" request
   - Copy token from response

3. **Set Token in Postman**
   - Open any request with `Authorization` header
   - Select "Bearer Token" type
   - Paste token in "Token" field

4. **Submit Enquiry**
   - Run "Submit Enquiry (Public)"

5. **Fetch, Claim, and Verify**
   - Run remaining requests in order

---

## Project Files

```
C:\Users\pthak\Desktop\CRM\
├── server.js                      # Main entry point
├── package.json                   # Dependencies
├── .env                           # Configuration
├── .gitignore                     # Git ignore
│
├── config/
│   └── database.js                # MySQL connection pool
│
├── middleware/
│   ├── auth.js                    # JWT validation
│   └── validation.js              # Input validation
│
├── controllers/
│   ├── authController.js          # Registration & Login
│   └── enquiryController.js       # Enquiry CRUD
│
├── routes/
│   ├── auth.js                    # Auth endpoints
│   └── enquiries.js               # Enquiry endpoints
│
├── database/
│   └── setup.sql                  # Database schema
│
├── README.md                      # Full documentation
├── TESTING.md                     # Test cases & scenarios
├── QUICKSTART.md                  # This file
└── CRM_API_Postman_Collection.json # Postman import
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure MySQL running: `mysql -u root -p -e "SELECT 1"` |
| Database not found | Run: `mysql -u root -p < database/setup.sql` |
| Module not found | Run: `npm install` |
| Port already in use | Change `PORT` in `.env` or kill process on 5000 |
| JWT token error | Copy full token including "Bearer " prefix in header |
| Invalid email | Email must have `@` and domain like `user@example.com` |
| Invalid phone | Must be exactly 10 digits: `9876543210` |
| Invalid URL | Must be valid HTTP(S) URL: `https://example.com` |

---

## What's Implemented

✅ 6 REST Endpoints  
✅ JWT Authentication  
✅ Input Validation  
✅ Error Handling  
✅ Database Transactions  
✅ Password Hashing  
✅ Security Best Practices  

---

## Next Steps

1. Review `README.md` for full API documentation
2. Check `TESTING.md` for comprehensive test scenarios
3. Deploy using environment-specific `.env` files
4. Add monitoring and logging as needed
5. Consider adding file uploads for resumes

---

## Support

For API documentation: See `README.md`  
For testing guide: See `TESTING.md`  
For issues: Check `.env` configuration and MySQL connection
