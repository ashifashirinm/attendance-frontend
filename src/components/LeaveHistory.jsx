import { useEffect, useState } from "react";

function LeaveHistory() {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://attendance-backend2-slxu.onrender.com/api/leave-history")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch leave history");
        }

        return response.json();
      })
      .then((data) => {
        setLeaveRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Unable to load leave history");
        setLoading(false);
      });
  }, []);

  const studentsWithLeave = new Set(
    leaveRecords.map((record) => record.rollNo)
  ).size;

  return (
    <>
      {/* Header */}
      <header className="header">
        <div>
          <p className="breadcrumb">Home / Leave History</p>

          <h1>Leave History</h1>

          <p className="subtitle">
            View student leave records for the last three months.
          </p>
        </div>

        <div className="period">
          <span>📅</span>

          <div>
            <small>Academic Period</small>
            <strong>July – September 2026</strong>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Leave Records</span>
            <span>📅</span>
          </div>

          <h2>{leaveRecords.length}</h2>

          <p className="orange">
            ● Recorded absences
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Students with Leave</span>
            <span>🎓</span>
          </div>

          <h2>{studentsWithLeave}</h2>

          <p className="purple">
            ● Students with leave records
          </p>
        </div>

      </section>

      {/* Leave Records */}
      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>Leave Records</h3>

            <p>
              Student-wise absence history
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p>Loading leave records...</p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* Table */}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Leave Date</th>
                <th>Day</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {leaveRecords.map((record, index) => (
                <tr key={index}>

                  <td>
                    <strong>{record.rollNo}</strong>
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
              ))}
            </tbody>
          </table>
        )}

      </div>
    </>
  );
}

export default LeaveHistory;