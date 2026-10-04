import { useEffect, useState } from "react";

function StudentDetails({ student, onBack }) {
  const [studentData, setStudentData] = useState(student);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [error, setError] = useState("");
  const [predictionError, setPredictionError] = useState("");

  // ==========================================
  // GET STUDENT DETAILS
  // ==========================================

  useEffect(() => {
    if (!student?.rollNo) {
      return;
    }

    setLoading(true);
    setError("");

    fetch(`https://attendance-backend2-slxu.onrender.com/api/students/${student.rollNo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Student not found");
        }

        return response.json();
      })
      .then((data) => {
        setStudentData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load student details.");
        setLoading(false);
      });
  }, [student]);

  // ==========================================
  // GET FUTURE PREDICTIONS
  // ==========================================

  useEffect(() => {
    if (!student?.rollNo) {
      return;
    }

    setPredictionLoading(true);
    setPredictionError("");

    fetch(`https://attendance-backend2-slxu.onrender.com/api/predictions/${student.rollNo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Prediction not found");
        }

        return response.json();
      })
      .then((data) => {
  console.log("Prediction API Response:", data);
console.log("First Prediction JSON:", JSON.stringify(data[0], null, 2));

  setPredictions(Array.isArray(data) ? data : []);

  setPredictionLoading(false);
})
      .catch((error) => {
        console.error(error);
        setPredictionError("Unable to load future predictions.");
        setPredictionLoading(false);
      });
  }, [student]);

  // ==========================================
  // NO STUDENT
  // ==========================================

  if (!student) {
    return (
      <div className="dashboard-card">
        <h3>Student not found</h3>
        <p>Please select a student.</p>
      </div>
    );
  }

  // ==========================================
  // LOADING STUDENT
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-card">
        <h3>Loading student details...</h3>
      </div>
    );
  }

  // ==========================================
  // STUDENT ERROR
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-card">
        <h3>{error}</h3>

        <button className="back-button" onClick={onBack}>
          ← Back to Students
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="header">
        <div>
          <p className="breadcrumb">
            Home / Students / Student Details
          </p>

          <h1>{studentData.rollNo}</h1>

          <p className="subtitle">
            Individual attendance and leave details
          </p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Back to Students
        </button>
      </header>

      {/* ==========================================
          STUDENT SUMMARY
      ========================================== */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Attendance</span>
            <span>✓</span>
          </div>

          <h2>{studentData.attendance}%</h2>

          <p className="green">
            ● Overall attendance
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Present Days</span>
            <span>🟢</span>
          </div>

          <h2>{studentData.present}</h2>

          <p className="green">
            ● Days present
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Leave Days</span>
            <span>📅</span>
          </div>

          <h2>{studentData.absent}</h2>

          <p className="orange">
            ● Total absences
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Status</span>
            <span>📊</span>
          </div>

          <h2>{studentData.status}</h2>

          <p className="purple">
            ● Attendance category
          </p>
        </div>

      </section>

      {/* ==========================================
          LEAVE HISTORY
      ========================================== */}

      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h3>Leave History</h3>

            <p>
              Dates on which {studentData.rollNo} was absent
            </p>
          </div>
        </div>

        {studentData.leaveDates &&
          studentData.leaveDates.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {studentData.leaveDates.map((leave, index) => (
                <tr key={index}>
                  <td>
                    <strong>{leave.date}</strong>
                  </td>

                  <td>{leave.day}</td>

                  <td>
                    <span className="absent">
                      Absent
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="green">
            No leave records available.
          </p>
        )}

      </section>

    {/* ==========================================
    FUTURE PREDICTION
========================================== */}

<section className="dashboard-card">

  <div className="card-header">
    <div>
      <h3>Future Prediction</h3>

      <p>
        ML-based attendance prediction for {studentData.rollNo}
      </p>
    </div>

    <span className="ai-badge">
      AI
    </span>
  </div>

  {/* Loading */}
  {predictionLoading && (
    <p style={{ padding: "20px 0" }}>
      Loading future predictions...
    </p>
  )}

  {/* Error */}
  {!predictionLoading && predictionError && (
    <p
      style={{
        padding: "20px 0",
        color: "red",
      }}
    >
      {predictionError}
    </p>
  )}

  {/* Prediction Table */}
  {!predictionLoading &&
    !predictionError &&
    predictions.length > 0 && (

      <div style={{ overflowX: "auto" }}>

        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Prediction</th>
            </tr>
          </thead>

          <tbody>

            {predictions.map((prediction, index) => (

              <tr key={index}>

                {/* DATE */}
                <td>
                  <strong>
                    {prediction.date}
                  </strong>
                </td>

                {/* DAY */}
                <td>
                  {prediction.day}
                </td>

                {/* PREDICTION */}
                <td>
                  {prediction.prediction === "P" ? (
                    <span className="green">
                      ● Predicted Present
                    </span>
                  ) : (
                    <span className="absent">
                      ● Predicted Absent
                    </span>
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    )}

  {/* No Data */}
  {!predictionLoading &&
    !predictionError &&
    predictions.length === 0 && (

      <p style={{ padding: "20px 0" }}>
        No future prediction data available.
      </p>

    )}

</section>
    </div>
  );
}

export default StudentDetails;