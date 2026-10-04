import { useEffect, useState } from "react";

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PREDICTIONS FROM BACKEND
  // ==========================================

  useEffect(() => {
    fetch("https://attendance-backend2-slxu.onrender.com/api/predictions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch prediction data");
        }

        return response.json();
      })
      .then((data) => {
        setPredictions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load prediction data");
        setLoading(false);
      });
  }, []);

  // ==========================================
  // FILTER PREDICTIONS
  // ==========================================

  const predictedPresent = predictions.filter(
    (student) => student.prediction === "P"
  );

  const predictedAbsent = predictions.filter(
    (student) => student.prediction === "A"
  );

  const filteredPredictions =
    filter === "All"
      ? predictions
      : predictions.filter(
          (student) => student.prediction === filter
        );

  // ==========================================
  // PRESENTAGE
  // ==========================================

  const presentPercentage =
    predictions.length > 0
      ? Math.round(
          (predictedPresent.length / predictions.length) * 100
        )
      : 0;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-card">
        <h3>Loading Predictions...</h3>
        <p>Please wait while prediction data is loading.</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-card">
        <h3>Prediction Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="header">
        <div>
          <p className="breadcrumb">
            Home / Predictions
          </p>

          <h1>Future Predictions</h1>

          <p className="subtitle">
            ML-based prediction of future student attendance.
          </p>
        </div>

        <div className="period">
          <span>🔮</span>

          <div>
            <small>Prediction Date</small>

            <strong>
              {predictions.length > 0
                ? predictions[0].date
                : "October 2026"}
            </strong>
          </div>
        </div>
      </header>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <section className="stats-grid">

        {/* Total Predictions */}

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Predictions</span>
            <span>🎓</span>
          </div>

          <h2>{predictions.length}</h2>

          <p className="purple">
            ● ML predictions
          </p>
        </div>

        {/* Predicted Present */}

        <div className="stat-card">
          <div className="stat-top">
            <span>Predicted Present</span>
            <span>🟢</span>
          </div>

          <h2>{predictedPresent.length}</h2>

          <p className="green">
            ● Expected to attend
          </p>
        </div>

        {/* Predicted Absent */}

        <div className="stat-card">
          <div className="stat-top">
            <span>Predicted Absent</span>
            <span>🔴</span>
          </div>

          <h2>{predictedAbsent.length}</h2>

          <p className="orange">
            ● Possible absence
          </p>
        </div>

        {/* Model Status */}

        <div className="stat-card">
          <div className="stat-top">
            <span>Model Status</span>
            <span>🤖</span>
          </div>

          <h2>Active</h2>

          <p className="green">
            ● Prediction model running
          </p>
        </div>

      </section>

      {/* ==========================================
          PREDICTION OVERVIEW
      ========================================== */}

      <section className="dashboard-grid">

        {/* Overview */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>Prediction Overview</h3>

              <p>
                Expected attendance distribution
              </p>
            </div>

            <span className="ai-badge">
              AI
            </span>

          </div>

          <div className="attendance-overview">

            <div className="donut">

              <div className="donut-center">

                <strong>
                  {presentPercentage}%
                </strong>

                <span>
                  Predicted Present
                </span>

              </div>

            </div>

            <div className="legend">

              <p>
                🟢{" "}
                <strong>
                  Predicted Present
                </strong>
              </p>

              <span>
                {predictedPresent.length} students
              </span>

              <p>
                🔴{" "}
                <strong>
                  Predicted Absent
                </strong>
              </p>

              <span>
                {predictedAbsent.length} students
              </span>

            </div>

          </div>

        </div>

        {/* Prediction Information */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>Prediction Information</h3>

              <p>
                Machine learning prediction system
              </p>
            </div>

          </div>

          <div className="prediction">

            <strong>
              {predictedAbsent.length}
            </strong>

            <p>
              students predicted to be absent
            </p>

            <div className="progress-label">

              <span>
                Predicted Present
              </span>

              <b>
                {presentPercentage}%
              </b>

            </div>

            <div className="progress">

              <div
                style={{
                  width: `${presentPercentage}%`,
                }}
              ></div>

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================
          PREDICTION TABLE
      ========================================== */}

      <section className="dashboard-card">

        <div className="card-header">

          <div>

            <h3>
              Student Predictions
            </h3>

            <p>
              Future attendance prediction for students
            </p>

          </div>

          {/* FILTER */}

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >

            <option value="All">
              All Predictions
            </option>

            <option value="P">
              Predicted Present
            </option>

            <option value="A">
              Predicted Absent
            </option>

          </select>

        </div>

        {/* TABLE */}

        <table>

          <thead>

            <tr>
              <th>Roll No</th>
              <th>Prediction Date</th>
              <th>Previous Absences</th>
              <th>Recent 7 Absences</th>
              <th>Absence Rate</th>
              <th>Prediction</th>
            </tr>

          </thead>

          <tbody>

            {filteredPredictions.map(
              (student, index) => (

                <tr
                  key={`${student.rollNo}-${student.date}-${index}`}
                >

                  {/* Roll Number */}

                  <td>
                    <strong>
                      {student.rollNo}
                    </strong>
                  </td>

                  {/* Date */}

                  <td>
                    {student.date}
                  </td>

                  {/* Previous Absences */}

                  <td>
                    {student.previousAbsences}
                  </td>

                  {/* Recent 7 Absences */}

                  <td>
                    {student.recent7Absences}
                  </td>

                  {/* Absence Rate */}

                  <td>
                    {(
                      student.recent7AbsenceRate * 100
                    ).toFixed(1)}
                    %
                  </td>

                  {/* Prediction */}

                  <td>

                    {student.prediction === "P" ? (

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

              )
            )}

          </tbody>

        </table>

        {/* EMPTY DATA */}

        {filteredPredictions.length === 0 && (

          <p
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            No prediction records found.
          </p>

        )}

      </section>
    </>
  );
}

export default Predictions;