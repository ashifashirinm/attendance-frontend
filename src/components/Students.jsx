import { useEffect, useState } from "react";

function Students({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get students from backend
  useEffect(() => {
    fetch("https://attendance-backend2-slxu.onrender.com/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to connect to backend.");
        setLoading(false);
      });
  }, []);

  // Search + Filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.rollNo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Header */}
      <header className="header">
        <div>
          <p className="breadcrumb">Home / Students</p>

          <h1>Students</h1>

          <p className="subtitle">
            View student attendance and leave statistics.
          </p>
        </div>

        <div className="period">
          <span>🎓</span>

          <div>
            <small>Total Students</small>
            <strong>{students.length} Students</strong>
          </div>
        </div>
      </header>

      {/* Student Attendance Card */}
      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>Student Attendance</h3>

            <p>
              Attendance summary for July – September 2026
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search Roll No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              width: "220px",
              outline: "none",
            }}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              background: "white",
            }}
          >
            <option value="All">All Status</option>
            
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ padding: "20px" }}>
            Loading students...
          </p>
        )}

        {/* Error */}
        {error && (
          <p
            style={{
              padding: "20px",
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        {/* Result Count */}
        {!loading && !error && (
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "12px",
            }}
          >
            Showing {filteredStudents.length} of {students.length} students
          </p>
        )}

        {/* Table */}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.rollNo}
                    onClick={() => onSelectStudent(student)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong>{student.rollNo}</strong>
                    </td>

                    <td>{student.present}</td>

                    <td>{student.absent}</td>

                    <td>
                      <strong>{student.attendance}%</strong>
                    </td>

                    <td>
                      <span
                        className={
                          student.status === "Excellent"
                            ? "green"
                            : student.status === "Good"
                            ? "purple"
                            : student.status === "Average"
                            ? "orange"
                            : "absent"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#777",
                    }}
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Students;