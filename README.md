# CRM Lead Management System - REST API

A complete, secure REST API for managing employee registrations, public enquiries, and lead claims in a CRM system.

## Features

- **Employee Authentication**: Registration and JWT-based login
- **Public Enquiry Form**: Submit leads without authentication
- **Enquiry Management**: Fetch unclaimed enquiries, claim leads, and manage personal claims
- **Security**: Password hashing with bcrypt, JWT authentication, input validation, SQL injection prevention
- **Atomic Operations**: Race-condition-safe claim operations using transactions

## Technology Stack

- **Node.js** with **Express.js**
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file handling (future)

## Project Structure

```
├── config/           # Database configuration
├── middleware/       # Authentication and validation
├── controllers/      # Business logic
├── routes/          # API routes
├── database/        # SQL setup scripts
├── server.js        # Main application entry point
├── .env             # Environment variables
└── package.json     # Dependencies
```

## Installation

1. **Clone or set up the project**
   ```bash
   cd C:\Users\pthak\Desktop\CRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MySQL database**
   - Ensure MySQL is running on `localhost:3306`
   - Run the database setup script:
     ```bash
     mysql -u root -p < database/setup.sql
     ```
     (Enter your MySQL password when prompted)

4. **Configure environment variables**
   - Copy `.env.example` to `.env` (already done)
   - Update `.env` with your database credentials if different

5. **Start the server**
   ```bash
   npm start
   ```
   - Server runs on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### 1. Register Employee
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Employee registered successfully",
    "employeeId": 1
  }
  ```

#### 2. Login Employee
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "employee": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Enquiry Endpoints

#### 3. Submit Enquiry (Public)
- **POST** `/api/enquiries`
- **Body:**
  ```json
  {
    "name": "John Smith",
    "phone": "9876543210",
    "email": "john@example.com",
    "course_interest": "Python Programming"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Enquiry submitted successfully",
    "enquiryId": 1
  }
  ```
- **Validation Errors (400):**
  ```json
  {
    "errors": [
      "Email must be a valid email",
      "Phone must be a valid 10-digit number"
    ]
  }
  ```

#### 4. Get Unclaimed Enquiries
- **GET** `/api/enquiries/public`
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response (200):**
  ```json
  {
    "message": "Unclaimed enquiries retrieved",
    "count": 2,
    "enquiries": [
      {
        "id": 1,
        "name": "John Smith",
        "phone": "9876543210",
        "email": "john@example.com",
        "course_interest": "Python Programming",
        "created_at": "2026-10-13T10:00:00.000Z"
      }
    ]
  }
  ```

#### 5. Claim an Enquiry
- **PATCH** `/api/enquiries/:id/claim`
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response (200):**
  ```json
  {
    "message": "Enquiry claimed successfully",
    "enquiryId": 1,
    "claimedBy": 1
  }
  ```
- **Errors:**
  - 404: `{ "error": "Enquiry not found" }`
  - 409: `{ "error": "Enquiry already claimed" }`

#### 6. Get My Enquiries
- **GET** `/api/enquiries/my`
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response (200):**
  ```json
  {
    "message": "Your enquiries retrieved",
    "count": 1,
    "enquiries": [
      {
        "id": 1,
        "name": "John Smith",
        "phone": "9876543210",
        "email": "john@example.com",
        "course_interest": "Python Programming",
        "created_at": "2026-10-13T10:00:00.000Z"
      }
    ]
  }
  ```

## Testing the APIs

### Using Postman

1. **Import Collection**
   - Create a new Postman collection
   - Add the requests below

2. **Register Employee**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Alice Johnson",
       "email": "alice@example.com",
       "password": "password123"
     }
     ```

3. **Login Employee**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "alice@example.com",
       "password": "password123"
     }
     ```
   - **Copy the returned token** for protected endpoints

4. **Submit Enquiry** (No Auth Required)
   - Method: `POST`
   - URL: `http://localhost:5000/api/enquiries`
   - Body (JSON):
     ```json
     {
       "name": "Alice Johnson",
       "phone": "9123456789",
       "email": "alice@university.com",
       "course_interest": "Web Development"
     }
     ```

5. **Get Unclaimed Enquiries** (Auth Required)
   - Method: `GET`
   - URL: `http://localhost:5000/api/enquiries/public`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <TOKEN_FROM_LOGIN>`

6. **Claim an Enquiry** (Auth Required)
   - Method: `PATCH`
   - URL: `http://localhost:5000/api/enquiries/1/claim`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <TOKEN_FROM_LOGIN>`

7. **Get My Enquiries** (Auth Required)
   - Method: `GET`
   - URL: `http://localhost:5000/api/enquiries/my`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <TOKEN_FROM_LOGIN>`

### Test Scenarios

#### Scenario 1: Complete Flow
1. Register an employee
2. Login to get token
3. Submit an enquiry (without auth)
4. Fetch public enquiries (with auth)
5. Claim the enquiry
6. Verify it appears in "My Enquiries"

#### Scenario 2: Duplicate Claim Prevention
1. Two employees login simultaneously
2. Both attempt to claim the same unclaimed enquiry
3. Only one succeeds; the other gets 409 error

#### Scenario 3: Validation
1. Submit enquiry with invalid email → 400 error
2. Submit enquiry with invalid phone → 400 error
3. Submit enquiry with invalid URL → 400 error

#### Scenario 4: Authorization
1. Try to access `/api/enquiries/public` without token → 401 error
2. Try to access `/api/enquiries/my` without token → 401 error
3. Try with invalid token → 401 error

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Enquiries Table
```sql
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
```

## Security Features

1. **Password Hashing**: All passwords hashed with bcrypt (10 salt rounds)
2. **JWT Authentication**: 24-hour token validity
3. **Input Validation**: Email, phone, and URL validation
4. **SQL Injection Prevention**: Parameterized queries using mysql2/promise
5. **Authorization**: Only employees can access protected endpoints; verified from JWT
6. **Atomic Operations**: Database transactions ensure race-condition-free claims
7. **No Password Exposure**: Passwords never returned in API responses

## Error Handling

- **400 Bad Request**: Validation errors, missing required fields
- **401 Unauthorized**: Invalid/missing token, invalid credentials
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate email, enquiry already claimed
- **500 Internal Server Error**: Unexpected errors logged to console

## Running Commands

```bash
# Install dependencies
npm install

# Start the server
npm start

# Set up database (from MySQL CLI)
mysql -u root -p < database/setup.sql
```

## Environment Variables

Create a `.env` file with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_db
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

## Future Enhancements

- File upload support for resumes (PDF/DOCX validation)
- Cloud storage integration (AWS S3)
- Email notifications on enquiry submission and claim
- Pagination for enquiry lists
- Enquiry status tracking (new, in-progress, closed)
- Employee role-based access control

## License

ISC
