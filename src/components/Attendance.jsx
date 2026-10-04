import { useEffect, useState } from "react";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://attendance-backend2-slxu.onrender.com/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching attendance:", error);
        setLoading(false);
      });
      
  }, []);

  const excellent = students.filter(
    (student) => student.attendance >= 90
  ).length;

  const good = students.filter(
    (student) =>
      student.attendance >= 80 &&
      student.attendance < 90
  ).length;

  const average = students.filter(
    (student) =>
      student.attendance >= 75 &&
      student.attendance < 80
  ).length;

  const low = students.filter(
    (student) => student.attendance < 75
  ).length;

  const perfectAttendance = students.filter(
    (student) => student.attendance === 100
  );

  if (loading) {
    return <p>Loading attendance data...</p>;
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div>
          <p className="breadcrumb">Home / Attendance</p>

          <h1>Attendance</h1>

          <p className="subtitle">
            Monitor student attendance performance and categories.
          </p>
        </div>

        <div className="period">
          <span>📊</span>

          <div>
            <small>Academic Period</small>
            <strong>July – September 2026</strong>
          </div>
        </div>
      </header>

      {/* Attendance Summary */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Students</span>
            <span>🎓</span>
          </div>

          <h2>{students.length}</h2>

          <p className="green">● Active students</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Excellent</span>
            <span>🟢</span>
          </div>

          <h2>{excellent}</h2>

          <p className="green">● 90% and above</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Good</span>
            <span>🔵</span>
          </div>

          <h2>{good}</h2>

          <p className="purple">● 80% – 89.9%</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Average</span>
            <span>🟠</span>
          </div>

          <h2>{average}</h2>

          <p className="orange">● 75% – 79.9%</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Low Attendance</span>
            <span>🔴</span>
          </div>

          <h2>{low}</h2>

          <p className="orange">● Below 75%</p>
        </div>

      </section>

      {/* Perfect Attendance */}
      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>100% Attendance</h3>

            <p>
              Students with perfect attendance
            </p>
          </div>

          <span className="ai-badge">
            {perfectAttendance.length} Students
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          {perfectAttendance.map((student) => (
            <span
              key={student.rollNo}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                background: "#ecfdf5",
                color: "#15803d",
                fontWeight: "600",
              }}
            >
              {student.rollNo}
            </span>
          ))}
        </div>

      </section>

      {/* Attendance Categories */}
      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>Attendance Categories</h3>

            <p>
              Student distribution based on attendance percentage
            </p>
          </div>
        </div>

        <div className="category">
          <span>🟢 Excellent</span>
          <strong>{excellent} students</strong>
        </div>

        <div className="category">
          <span>🔵 Good</span>
          <strong>{good} students</strong>
        </div>

        <div className="category">
          <span>🟠 Average</span>
          <strong>{average} students</strong>
        </div>

        <div className="category">
          <span>🔴 Low</span>
          <strong>{low} students</strong>
        </div>

      </section>

      {/* Student Attendance Table */}
      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>Student Attendance Details</h3>

            <p>
              Present and absent records for all students
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.rollNo}>

                <td>
                  <strong>{student.rollNo}</strong>
                </td>

                <td>
                  {student.present}
                </td>

                <td>
                  {student.absent}
                </td>

                <td>
                  <strong>{student.attendance}%</strong>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </section>
    </>
  );
}

export default Attendance;