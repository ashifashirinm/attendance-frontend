import { useState, useEffect } from "react";
import "./App.css";

import StudentDetails from "./components/StudentDetails";
import Students from "./components/Students";
import LeaveHistory from "./components/LeaveHistory";
import Attendance from "./components/Attendance";
import Predictions from "./components/Predictions";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const [students, setStudents] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [predictionCount, setPredictionCount] = useState(0);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH STUDENT DATA
  // ==========================================

  useEffect(() => {
    fetch("https://attendance-backend2-slxu.onrender.com/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch student data");
        }

        return response.json();
      })
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Student data error:", error);
      });
  }, []);

  // ==========================================
  // FETCH LEAVE HISTORY
  // ==========================================

  useEffect(() => {
    fetch("https://attendance-backend2-slxu.onrender.com/api/leave-history")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch leave history");
        }

        return response.json();
      })
      .then((data) => {
        setLeaveHistory(data);
      })
      .catch((error) => {
        console.error("Leave history error:", error);
      });
  }, []);

  // ==========================================
  // FETCH FUTURE PREDICTIONS
  // ==========================================

  useEffect(() => {
    if (students.length === 0) {
      return;
    }

    let totalPredictedAbsences = 0;

    const fetchPredictions = async () => {
      try {
        const predictionResults = await Promise.all(
          students.map(async (student) => {
            try {
              const response = await fetch(
                `https://attendance-backend2-slxu.onrender.com/api/predictions/${student.rollNo}`
              );

              if (!response.ok) {
                return [];
              }

              return await response.json();
            } catch (error) {
              console.error(
                `Prediction error for ${student.rollNo}:`,
                error
              );

              return [];
            }
          })
        );

       predictionResults.forEach((predictions) => {
  predictions.forEach((prediction) => {
    if (
      String(prediction.prediction).toUpperCase() === "A"
    ) {
      totalPredictedAbsences++;
    }
  });
});

        setPredictionCount(totalPredictedAbsences);
      } catch (error) {
        console.error("Prediction data error:", error);
      }
    };

    fetchPredictions();
  }, [students]);

  // ==========================================
  // LOADING
  // ==========================================

  useEffect(() => {
    if (students.length > 0) {
      setLoading(false);
    }
  }, [students]);

  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================

  const totalStudents = students.length;

  const totalPresent = students.reduce(
    (sum, student) => sum + Number(student.present || 0),
    0
  );

  const totalAbsent = students.reduce(
    (sum, student) => sum + Number(student.absent || 0),
    0
  );

  const totalAttendanceRecords = totalPresent + totalAbsent;

  const attendanceRate =
    totalAttendanceRecords > 0
      ? ((totalPresent / totalAttendanceRecords) * 100).toFixed(1)
      : "0.0";

  // ==========================================
  // ATTENDANCE CATEGORIES
  // ==========================================

  const excellentCount = students.filter(
    (student) => student.status === "Excellent"
  ).length;

  const goodCount = students.filter(
    (student) => student.status === "Good"
  ).length;

  const averageCount = students.filter(
    (student) => student.status === "Average"
  ).length;

  const lowCount = students.filter(
    (student) => student.status === "Low"
  ).length;

  // ==========================================
  // RECENT LEAVE RECORDS
  // ==========================================

  const recentLeaves = [...leaveHistory]
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("-");
      const [dayB, monthB, yearB] = b.date.split("-");

      const dateA = new Date(
        `${yearA}-${monthA}-${dayA}`
      );

      const dateB = new Date(
        `${yearB}-${monthB}-${dayB}`
      );

      return dateB - dateA;
    })
    .slice(0, 3);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="app">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-box">
            A
          </div>

          <div>
            <h2>AttendAI</h2>
            <p>Student Analytics</p>
          </div>

        </div>

        <nav className="sidebar-nav">

          <a
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            🏠 Dashboard
          </a>

          <a
            className={
              activePage === "students"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("students")
            }
          >
            🎓 Students
          </a>

          <a
            className={
              activePage === "leave"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("leave")
            }
          >
            📅 Leave History
          </a>

          <a
            className={
              activePage === "attendance"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("attendance")
            }
          >
            📊 Attendance
          </a>

          <a
            className={
              activePage === "predictions"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("predictions")
            }
          >
            🔮 Predictions
          </a>

        </nav>

        <div className="sidebar-bottom">

          <span>
            ● ML Model Active
          </span>

          <p>
            Attendance Prediction System
          </p>

        </div>

      </aside>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <main className="main-content">

        {/* STUDENTS */}

        {activePage === "students" ? (

          selectedStudent ? (

            <StudentDetails
              student={selectedStudent}
              onBack={() =>
                setSelectedStudent(null)
              }
            />

          ) : (

            <Students
              onSelectStudent={setSelectedStudent}
            />

          )

        ) : activePage === "leave" ? (

          <LeaveHistory />

        ) : activePage === "attendance" ? (

          <Attendance />

        ) : activePage === "predictions" ? (

          <Predictions />

        ) : (

          <>
            {/* ====================================
                DASHBOARD HEADER
            ==================================== */}

            <header className="header">

              <div>

                <p className="breadcrumb">
                  Home / Dashboard
                </p>

                <h1>
                  Attendance Dashboard
                </h1>

                <p className="subtitle">
                  Monitor student attendance, leave
                  patterns and future predictions.
                </p>

              </div>

              <div className="period">

                <span>📅</span>

                <div>

                  <small>
                    Academic Period
                  </small>

                  <strong>
                    July – September 2026
                  </strong>

                </div>

              </div>

            </header>

            {/* ====================================
                STATS
            ==================================== */}

            <section className="stats-grid">

              {/* TOTAL STUDENTS */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Total Students
                  </span>

                  <span>
                    🎓
                  </span>

                </div>

                <h2>
                  {loading
                    ? "..."
                    : totalStudents}
                </h2>

                <p className="green">
                  ● Active students
                </p>

              </div>

              {/* ATTENDANCE RATE */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Attendance Rate
                  </span>

                  <span>
                    ✓
                  </span>

                </div>

                <h2>
                  {loading
                    ? "..."
                    : `${attendanceRate}%`}
                </h2>

                <p className="green">
                  ● Overall attendance
                </p>

              </div>

              {/* TOTAL ABSENCES */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Total Absences
                  </span>

                  <span>
                    📅
                  </span>

                </div>

                <h2>
                  {loading
                    ? "..."
                    : totalAbsent}
                </h2>

                <p className="orange">
                  ● Recorded leaves
                </p>

              </div>

              {/* PREDICTED ABSENCES */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Predicted Absences
                  </span>

                  <span>
                    🔮
                  </span>

                </div>

                <h2>
                  {students.length === 0
                    ? "..."
                    : predictionCount}
                </h2>

                <p className="purple">
                  ● Future prediction
                </p>

              </div>

            </section>

            {/* ====================================
                DASHBOARD CARDS
            ==================================== */}

            <section className="dashboard-grid">

              {/* ATTENDANCE OVERVIEW */}

              <div className="dashboard-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Attendance Overview
                    </h3>

                    <p>
                      Present vs absent records
                    </p>

                  </div>

                  <button>
                    Last 3 Months ▾
                  </button>

                </div>

                <div className="attendance-overview">

                  <div className="donut">

                    <div className="donut-center">

                      <strong>
                        {attendanceRate}%
                      </strong>

                      <span>
                        Present
                      </span>

                    </div>

                  </div>

                  <div className="legend">

                    <p>
                      🔵{" "}
                      <strong>
                        Present
                      </strong>
                    </p>

                    <span>
                      {totalPresent} records
                    </span>

                    <p>
                      🟠{" "}
                      <strong>
                        Absent
                      </strong>
                    </p>

                    <span>
                      {totalAbsent} records
                    </span>

                  </div>

                </div>

              </div>

              {/* FUTURE PREDICTION */}

              <div className="dashboard-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Future Prediction
                    </h3>

                    <p>
                      October 2026
                    </p>

                  </div>

                  <span className="ai-badge">
                    AI
                  </span>

                </div>

                <div className="prediction">

                  <strong>
                    {predictionCount}
                  </strong>

                  <p>
                    predicted absence days
                  </p>

                  <div className="progress-label">

                    <span>
                      Predicted Present
                    </span>

                    <b>
                      {(() => {

                        const totalPredictionDays =
                          students.length * 31;

                        if (
                          totalPredictionDays === 0
                        ) {
                          return "0.0%";
                        }

                        const predictedPresent =
                          totalPredictionDays -
                          predictionCount;

                        return (
                          (
                            (predictedPresent /
                              totalPredictionDays) *
                            100
                          ).toFixed(1) + "%"
                        );

                      })()}
                    </b>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: (() => {

                          const totalPredictionDays =
                            students.length * 31;

                          if (
                            totalPredictionDays === 0
                          ) {
                            return "0%";
                          }

                          const predictedPresent =
                            totalPredictionDays -
                            predictionCount;

                          return (
                            (predictedPresent /
                              totalPredictionDays) *
                            100
                          ) + "%";

                        })(),
                      }}
                    ></div>

                  </div>

                  <button
                    className="prediction-button"
                    onClick={() =>
                      setActivePage("predictions")
                    }
                  >
                    View Predictions →
                  </button>

                </div>

              </div>

            </section>

            {/* ====================================
                BOTTOM SECTION
            ==================================== */}

            <section className="dashboard-grid">

              {/* ATTENDANCE CATEGORIES */}

              <div className="dashboard-card">

                <h3>
                  Attendance Categories
                </h3>

                <p>
                  Student distribution
                </p>

                <div className="category">

                  <span>
                    🟢 Excellent
                  </span>

                  <strong>
                    {excellentCount} students
                  </strong>

                </div>

                <div className="category">

                  <span>
                    🔵 Good
                  </span>

                  <strong>
                    {goodCount} students
                  </strong>

                </div>

                <div className="category">

                  <span>
                    🟠 Average
                  </span>

                  <strong>
                    {averageCount} students
                  </strong>

                </div>

                <div className="category">

                  <span>
                    🔴 Low
                  </span>

                  <strong>
                    {lowCount} students
                  </strong>

                </div>

              </div>

              {/* RECENT LEAVE ACTIVITY */}

              <div className="dashboard-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Recent Leave Activity
                    </h3>

                    <p>
                      Latest recorded absence patterns
                    </p>

                  </div>

                  <a
                    onClick={() =>
                      setActivePage("leave")
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    View All →
                  </a>

                </div>

                <table>

                  <thead>

                    <tr>

                      <th>
                        Student
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Day
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentLeaves.length === 0 ? (

                      <tr>

                        <td
                          colSpan="4"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          No leave records found
                        </td>

                      </tr>

                    ) : (

                      recentLeaves.map(
                        (record, index) => (

                          <tr key={index}>

                            <td>
                              {record.rollNo}
                            </td>

                            <td>
                              {record.date}
                            </td>

                            <td>
                              {record.day}
                            </td>

                            <td>

                              <span className="absent">
                                Absent
                              </span>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default App;