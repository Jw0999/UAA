import React, { useState, useEffect } from 'react';

// API base URL
const API_URL = 'http://localhost:8000';

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  success: {
    background: '#d1fae5',
    color: '#059669',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  header: {
    background: 'white',
    padding: '16px 24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  dashboard: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  courseCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  courseCardHover: {
    borderColor: '#667eea',
    background: '#f8f9ff',
  },
  courseCode: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '4px',
  },
  courseName: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500',
  },
  qrContainer: {
    textAlign: 'center',
    padding: '24px',
  },
  qrImage: {
    maxWidth: '300px',
    border: '4px solid #667eea',
    borderRadius: '12px',
    padding: '16px',
    background: 'white',
  },
  tokenDisplay: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
    letterSpacing: '8px',
    marginTop: '16px',
    padding: '16px',
    background: '#f0f0f0',
    borderRadius: '8px',
    fontFamily: 'monospace',
  },
  timer: {
    fontSize: '18px',
    color: '#dc2626',
    marginTop: '12px',
    fontWeight: '600',
  },
  attendanceTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: '#f8f9ff',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #e0e0e0',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e0e0e0',
    color: '#555',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: '#e0e0e0',
    color: '#666',
  },
  tabActive: {
    background: '#667eea',
    color: 'white',
  },
  sessionCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeActive: {
    background: '#d1fae5',
    color: '#059669',
  },
  badgeExpired: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
  },
  inputFlex: {
    flex: 1,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
};

// ==================== LOGIN COMPONENT ====================
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('name', data.name);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>University Attendance</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'lecturer' ? 'lecturer@university.edu' : 'alice@student.edu'}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => {
              e.target.style.transform = styles.buttonHover.transform;
              e.target.style.boxShadow = styles.buttonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9ff', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
            Demo Credentials:
          </p>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
            <strong>Lecturer:</strong> lecturer@university.edu / password123
          </p>
          <p style={{ fontSize: '12px', color: '#888' }}>
            <strong>Students:</strong> alice@student.edu (or bob, carol, david, eve) / password123
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== LECTURER DASHBOARD ====================
function LecturerDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('start');
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  useEffect(() => {
    fetchCourses();
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval;
    if (currentSession && timeLeft > 0) {
      interval = setInterval(() => {
        const remaining = Math.ceil((new Date(currentSession.expires_at) - new Date()) / 1000);
        setTimeLeft(Math.max(0, remaining));
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession, timeLeft]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/lecturer/courses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/lecturer/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const startSession = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/lecturer/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      const data = await response.json();
      setCurrentSession(data);
      setTimeLeft(120);
      fetchSessions();
    } catch (err) {
      console.error('Error starting session:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewAttendance = async (sessionId) => {
    try {
      const response = await fetch(`${API_URL}/lecturer/session/${sessionId}/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setAttendance(data);
      setActiveTab('attendance');
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Lecturer Dashboard</h1>
        <div style={styles.headerInfo}>
          <span>Welcome, {name}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.dashboard}>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'start' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('start')}
          >
            Start Session
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'sessions' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('sessions')}
          >
            All Sessions
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'attendance' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('attendance')}
          >
            View Attendance
          </button>
        </div>

        {activeTab === 'start' && (
          <>
            {!currentSession ? (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Select a Course</h2>
                {courses.map((course) => (
                  <div
                    key={course.id}
                    style={styles.courseCard}
                    onClick={() => startSession(course.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = styles.courseCardHover.borderColor;
                      e.currentTarget.style.background = styles.courseCardHover.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div style={styles.courseCode}>{course.code}</div>
                    <div style={styles.courseName}>{course.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>QR Code for {currentSession.course_name}</h2>
                <div style={styles.qrContainer}>
                  <img
                    src={`data:image/png;base64,${currentSession.qr_code}`}
                    alt="QR Code"
                    style={styles.qrImage}
                  />
                  <div style={styles.tokenDisplay}>{currentSession.token}</div>
                  <div style={styles.timer}>
                    Expires in: {formatTime(timeLeft)}
                  </div>
                  <p style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>
                    Students can scan this QR code or enter the token manually
                  </p>
                  <button
                    style={{ ...styles.button, marginTop: '20px', maxWidth: '200px' }}
                    onClick={() => setCurrentSession(null)}
                  >
                    Generate New
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'sessions' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Sessions</h2>
            {sessions.length === 0 ? (
              <div style={styles.emptyState}>No sessions found</div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} style={styles.sessionCard}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{session.course_name}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      Token: {session.token} | {new Date(session.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ ...styles.badge, ...(session.is_active ? styles.badgeActive : styles.badgeExpired) }}>
                      {session.is_active ? 'Active' : 'Expired'}
                    </span>
                    <button
                      style={{ ...styles.button, width: 'auto', padding: '8px 16px', fontSize: '14px' }}
                      onClick={() => viewAttendance(session.id)}
                    >
                      View ({session.attendance_count})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              {attendance.course_name ? `Attendance: ${attendance.course_name}` : 'Attendance Records'}
            </h2>
            {attendance.students?.length === 0 ? (
              <div style={styles.emptyState}>No attendance records yet</div>
            ) : (
              <table style={styles.attendanceTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Student ID</th>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Marked At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.students?.map((student) => (
                    <tr key={student.student_id}>
                      <td style={styles.tableCell}>{student.student_id}</td>
                      <td style={styles.tableCell}>{student.student_name}</td>
                      <td style={styles.tableCell}>{student.student_email}</td>
                      <td style={styles.tableCell}>
                        {new Date(student.marked_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== STUDENT DASHBOARD ====================
function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const authToken = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  useEffect(() => {
    fetchCourses();
    fetchAttendanceHistory();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/student/courses`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/student/attendance-history`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      setAttendanceHistory(data);
    } catch (err) {
      console.error('Error fetching attendance history:', err);
    }
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/student/mark-attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setToken('');
        fetchAttendanceHistory();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to mark attendance' });
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Student Dashboard</h1>
        <div style={styles.headerInfo}>
          <span>Welcome, {name}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.dashboard}>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'courses' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'mark' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('mark')}
          >
            Mark Attendance
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'history' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {activeTab === 'courses' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>My Enrolled Courses</h2>
            {courses.length === 0 ? (
              <div style={styles.emptyState}>No courses enrolled</div>
            ) : (
              courses.map((course) => (
                <div key={course.id} style={styles.courseCard}>
                  <div style={styles.courseCode}>{course.code}</div>
                  <div style={styles.courseName}>{course.name}</div>
                  <div style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
                    Lecturer: {course.lecturer_name}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'mark' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Mark Attendance</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              Enter the token from the QR code displayed by your lecturer
            </p>

            {message && (
              <div style={message.type === 'success' ? styles.success : styles.error}>
                {message.text}
              </div>
            )}

            <form onSubmit={markAttendance}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Token</label>
                <input
                  type="text"
                  style={styles.input}
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  placeholder="Enter token (e.g., ABC123)"
                  maxLength={8}
                  required
                />
              </div>
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => {
                  e.target.style.transform = styles.buttonHover.transform;
                  e.target.style.boxShadow = styles.buttonHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Mark Attendance
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Attendance History</h2>
            {attendanceHistory.length === 0 ? (
              <div style={styles.emptyState}>No attendance records yet</div>
            ) : (
              <table style={styles.attendanceTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Course</th>
                    <th style={styles.tableHeader}>Code</th>
                    <th style={styles.tableHeader}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record) => (
                    <tr key={record.id}>
                      <td style={styles.tableCell}>{record.course_name}</td>
                      <td style={styles.tableCell}>{record.course_code}</td>
                      <td style={styles.tableCell}>
                        {new Date(record.marked_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('user_id');

    if (token && role) {
      setUser({ role, name, user_id: userId });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user_id');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return user.role === 'lecturer' ? (
    <LecturerDashboard onLogout={handleLogout} />
  ) : (
    <StudentDashboard onLogout={handleLogout} />
  );
}

export default App;
