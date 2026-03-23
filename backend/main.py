"""
University Attendance System - FastAPI Backend
QR-based attendance system with JWT authentication
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime, timedelta
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
import qrcode
import io
import base64
import uuid
import os

# ============ Configuration ============
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
QR_CODE_VALIDITY_MINUTES = 2

# Database
DATABASE_URL = "sqlite:///./attendance.db"

# ============ Database Setup ============
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ============ Database Models ============
class Lecturer(Base):
    __tablename__ = "lecturers"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    courses = relationship("Course", back_populates="lecturer")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    student_id = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    enrollments = relationship("Enrollment", back_populates="student")
    attendances = relationship("Attendance", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    lecturer_id = Column(Integer, ForeignKey("lecturers.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    lecturer = relationship("Lecturer", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    sessions = relationship("Session", back_populates="course")

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    token = Column(String, unique=True, index=True)
    qr_code = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    course = relationship("Course", back_populates="sessions")
    attendances = relationship("Attendance", back_populates="session")

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    marked_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("Session", back_populates="attendances")
    student = relationship("Student", back_populates="attendances")

# Create tables
Base.metadata.create_all(bind=engine)

# ============ Pydantic Models ============
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str  # "student" or "lecturer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    name: str

class StartSessionRequest(BaseModel):
    course_id: int

class SessionResponse(BaseModel):
    session_id: int
    token: str
    qr_code: str
    expires_at: datetime
    course_name: str

class MarkAttendanceRequest(BaseModel):
    token: str

class AttendanceResponse(BaseModel):
    success: bool
    message: str

class CourseResponse(BaseModel):
    id: int
    code: str
    name: str
    lecturer_name: str

class AttendanceRecord(BaseModel):
    student_id: int
    student_name: str
    student_email: str
    marked_at: datetime

# ============ Security ============
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(lambda: SessionLocal())):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============ FastAPI App ============
app = FastAPI(title="University Attendance System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Seed Data ============
def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Lecturer).first():
            return
        
        # Create lecturer
        lecturer = Lecturer(
            email="lecturer@university.edu",
            password=get_password_hash("password123"),
            name="Dr. John Smith"
        )
        db.add(lecturer)
        db.flush()
        
        # Create students
        students_data = [
            {"email": "alice@student.edu", "name": "Alice Johnson", "student_id": "STU001"},
            {"email": "bob@student.edu", "name": "Bob Williams", "student_id": "STU002"},
            {"email": "carol@student.edu", "name": "Carol Davis", "student_id": "STU003"},
            {"email": "david@student.edu", "name": "David Brown", "student_id": "STU004"},
            {"email": "eve@student.edu", "name": "Eve Miller", "student_id": "STU005"},
        ]
        
        students = []
        for s in students_data:
            student = Student(
                email=s["email"],
                password=get_password_hash("password123"),
                name=s["name"],
                student_id=s["student_id"]
            )
            db.add(student)
            students.append(student)
        db.flush()
        
        # Create courses
        courses_data = [
            {"code": "CS101", "name": "Introduction to Computer Science"},
            {"code": "CS201", "name": "Data Structures and Algorithms"},
        ]
        
        courses = []
        for c in courses_data:
            course = Course(
                code=c["code"],
                name=c["name"],
                lecturer_id=lecturer.id
            )
            db.add(course)
            courses.append(course)
        db.flush()
        
        # Enroll all students in both courses
        for student in students:
            for course in courses:
                enrollment = Enrollment(
                    student_id=student.id,
                    course_id=course.id
                )
                db.add(enrollment)
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

# Seed on startup
seed_database()

# ============ Auth Endpoints ============
@app.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    if request.role == "lecturer":
        user = db.query(Lecturer).filter(Lecturer.email == request.email).first()
    else:
        user = db.query(Student).filter(Student.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"user_id": user.id, "role": request.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=request.role,
        user_id=user.id,
        name=user.name
    )

# ============ Lecturer Endpoints ============
@app.post("/lecturer/start-session", response_model=SessionResponse)
def start_session(
    request: StartSessionRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can start sessions")
    
    # Verify course belongs to lecturer
    course = db.query(Course).filter(
        Course.id == request.course_id,
        Course.lecturer_id == current_user["user_id"]
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Generate unique token
    token = str(uuid.uuid4())[:8].upper()
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(token)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    # Create session
    expires_at = datetime.utcnow() + timedelta(minutes=QR_CODE_VALIDITY_MINUTES)
    session = Session(
        course_id=request.course_id,
        token=token,
        qr_code=qr_base64,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return SessionResponse(
        session_id=session.id,
        token=token,
        qr_code=qr_base64,
        expires_at=expires_at,
        course_name=course.name
    )

@app.get("/lecturer/courses")
def get_lecturer_courses(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can access this")
    
    courses = db.query(Course).filter(Course.lecturer_id == current_user["user_id"]).all()
    return [
        {"id": c.id, "code": c.code, "name": c.name}
        for c in courses
    ]

@app.get("/lecturer/session/{session_id}/attendance")
def get_session_attendance(
    session_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can access this")
    
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify lecturer owns this session
    course = db.query(Course).filter(Course.id == session.course_id).first()
    if course.lecturer_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    attendances = db.query(Attendance).filter(Attendance.session_id == session_id).all()
    
    return {
        "session_id": session_id,
        "course_name": course.name,
        "token": session.token,
        "created_at": session.created_at,
        "expires_at": session.expires_at,
        "total_attendance": len(attendances),
        "students": [
            {
                "student_id": a.student.id,
                "student_name": a.student.name,
                "student_email": a.student.email,
                "marked_at": a.marked_at
            }
            for a in attendances
        ]
    }

@app.get("/lecturer/sessions")
def get_lecturer_sessions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can access this")
    
    # Get all courses for this lecturer
    courses = db.query(Course).filter(Course.lecturer_id == current_user["user_id"]).all()
    course_ids = [c.id for c in courses]
    
    # Get all sessions for these courses
    sessions = db.query(Session).filter(Session.course_id.in_(course_ids)).order_by(Session.created_at.desc()).all()
    
    return [
        {
            "id": s.id,
            "course_name": s.course.name,
            "token": s.token,
            "created_at": s.created_at,
            "expires_at": s.expires_at,
            "is_active": s.is_active and s.expires_at > datetime.utcnow(),
            "attendance_count": len(s.attendances)
        }
        for s in sessions
    ]

# ============ Student Endpoints ============
@app.get("/student/courses", response_model=list[CourseResponse])
def get_student_courses(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access this")
    
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user["user_id"]).all()
    
    return [
        CourseResponse(
            id=e.course.id,
            code=e.course.code,
            name=e.course.name,
            lecturer_name=e.course.lecturer.name
        )
        for e in enrollments
    ]

@app.post("/student/mark-attendance", response_model=AttendanceResponse)
def mark_attendance(
    request: MarkAttendanceRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can mark attendance")
    
    # Find session by token
    session = db.query(Session).filter(Session.token == request.token.upper()).first()
    
    if not session:
        return AttendanceResponse(success=False, message="Invalid token")
    
    # Check if session is expired
    if session.expires_at < datetime.utcnow():
        return AttendanceResponse(success=False, message="QR code has expired")
    
    # Check if student is enrolled in this course
    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == current_user["user_id"],
        Enrollment.course_id == session.course_id
    ).first()
    
    if not enrollment:
        return AttendanceResponse(success=False, message="You are not enrolled in this course")
    
    # Check for duplicate attendance
    existing = db.query(Attendance).filter(
        Attendance.session_id == session.id,
        Attendance.student_id == current_user["user_id"]
    ).first()
    
    if existing:
        return AttendanceResponse(success=False, message="Attendance already marked for this session")
    
    # Mark attendance
    attendance = Attendance(
        session_id=session.id,
        student_id=current_user["user_id"]
    )
    db.add(attendance)
    db.commit()
    
    return AttendanceResponse(
        success=True,
        message=f"Attendance marked successfully for {session.course.name}"
    )

@app.get("/student/attendance-history")
def get_student_attendance_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access this")
    
    attendances = db.query(Attendance).filter(
        Attendance.student_id == current_user["user_id"]
    ).order_by(Attendance.marked_at.desc()).all()
    
    return [
        {
            "id": a.id,
            "course_name": a.session.course.name,
            "course_code": a.session.course.code,
            "marked_at": a.marked_at,
            "session_date": a.session.created_at
        }
        for a in attendances
    ]

# ============ Health Check ============
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
