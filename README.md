# University Attendance System

A complete QR-based attendance system for universities with FastAPI backend and React frontend.

## Features

- **Authentication**: JWT-based login for students and lecturers
- **Lecturer Features**:
  - Start class sessions
  - Generate QR codes (valid for 2 minutes)
  - View attendance lists
  - View all past sessions
- **Student Features**:
  - View enrolled courses
  - Mark attendance via QR token
  - View attendance history
- **Attendance Rules**:
  - Must be enrolled in the course
  - QR token must be valid and not expired
  - Duplicate attendance prevented

## Tech Stack

- **Backend**: FastAPI (Python) + SQLite
- **Frontend**: React (plain, no routing needed)
- **Authentication**: JWT tokens
- **QR Codes**: Python qrcode library

## Project Structure

```
university-attendance-system/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main React application
│   │   └── index.js        # React entry point
│   └── package.json        # Node dependencies
└── README.md
```

## Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Run the Backend

```bash
# From the backend directory
uvicorn main:app --reload --port 8000
```

The backend will start at `http://localhost:8000`
- API docs available at: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Step 3: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### Step 4: Run the Frontend

```bash
# From the frontend directory
npm start
```

The frontend will start at `http://localhost:3000`

## Demo Credentials

### Lecturer
- **Email**: `lecturer@university.edu`
- **Password**: `password123`

### Students (all use same password)
- **Password**: `password123`

| Email | Name | Student ID |
|-------|------|------------|
| alice@student.edu | Alice Johnson | STU001 |
| bob@student.edu | Bob Williams | STU002 |
| carol@student.edu | Carol Davis | STU003 |
| david@student.edu | David Brown | STU004 |
| eve@student.edu | Eve Miller | STU005 |

### Pre-seeded Data
- 1 Lecturer (Dr. John Smith)
- 5 Students (all enrolled in both courses)
- 2 Courses:
  - CS101: Introduction to Computer Science
  - CS201: Data Structures and Algorithms

## Step-by-Step Test Flow

### Test 1: Lecturer Workflow

1. **Login as Lecturer**
   - Go to `http://localhost:3000`
   - Select role: "Lecturer"
   - Email: `lecturer@university.edu`
   - Password: `password123`
   - Click "Sign In"

2. **Start a Session**
   - Click on "Start Session" tab
   - Click on a course (e.g., CS101)
   - QR code and token will be generated
   - Note the 8-character token (e.g., "ABC12345")
   - Timer shows 2-minute countdown

3. **View Sessions**
   - Click "All Sessions" tab
   - See list of all sessions with attendance counts
   - Click "View" to see attendance for any session

### Test 2: Student Workflow

1. **Login as Student**
   - Open a new browser/incognito window
   - Go to `http://localhost:3000`
   - Select role: "Student"
   - Email: `alice@student.edu`
   - Password: `password123`
   - Click "Sign In"

2. **View Courses**
   - "My Courses" tab shows enrolled courses
   - Should see CS101 and CS201

3. **Mark Attendance**
   - Click "Mark Attendance" tab
   - Enter the token from lecturer's screen
   - Click "Mark Attendance"
   - Should see success message

4. **Verify Attendance**
   - Click "History" tab
   - See the attendance record

5. **Test Duplicate Prevention**
   - Try entering the same token again
   - Should see error: "Attendance already marked"

6. **Test Expired Token**
   - Wait 2 minutes for token to expire
   - Try entering expired token
   - Should see error: "QR code has expired"

### Test 3: Multiple Students

1. Login as different students in separate browsers
2. Have them all mark attendance with the same token
3. Lecturer can view the full attendance list

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login (student or lecturer) |

### Lecturer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lecturer/courses` | Get lecturer's courses |
| POST | `/lecturer/start-session` | Start a new session |
| GET | `/lecturer/sessions` | Get all sessions |
| GET | `/lecturer/session/{id}/attendance` | Get attendance for session |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/courses` | Get enrolled courses |
| POST | `/student/mark-attendance` | Mark attendance with token |
| GET | `/student/attendance-history` | Get attendance history |

## Database Schema

### Tables
- **lecturers**: id, email, password, name, created_at
- **students**: id, email, password, name, student_id, created_at
- **courses**: id, code, name, lecturer_id, created_at
- **enrollments**: id, student_id, course_id, enrolled_at
- **sessions**: id, course_id, token, qr_code, expires_at, created_at, is_active
- **attendance**: id, session_id, student_id, marked_at

### Database File
- SQLite database is created as `attendance.db` in the backend directory
- Automatically seeded with demo data on first run

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Backend already configured with CORS
- Make sure backend is running on port 8000

### Database issues
```bash
# Delete database to reset (from backend directory)
rm attendance.db
# Restart backend - will reseed with fresh data
```

## Development Notes

- QR codes are valid for **2 minutes** (configurable in `main.py`)
- JWT tokens expire after **60 minutes**
- All passwords are hashed using bcrypt
- QR codes are generated as base64 PNG images

## License

MIT License - For educational purposes
