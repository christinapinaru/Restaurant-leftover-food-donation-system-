import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token) {
      navigate("/");
      return;
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-head">
        <div>
          <p className="dashboard-badge">GoodPlate Dashboard</p>
          <h1>Welcome back, {user?.name || "organizer"}</h1>
          <p>
            Manage donations, review incoming requests, and keep your community food flow efficient with one polished dashboard.
          </p>
        </div>

        <button className="button button-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-title">Post New Donation</p>
            <p className="dashboard-card-copy">
              Add fresh meal donations quickly and let recipients claim what they need.
            </p>
          </div>
          <button className="button button-primary" onClick={() => navigate("/post")}>
            Go to Post Food
          </button>
        </div>

        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-title">Available Food</p>
            <p className="dashboard-card-copy">
              See active food listings, monitor quantities, and keep your inventory visible.
            </p>
          </div>
          <button className="button button-secondary" onClick={() => navigate("/list")}>View Food List</button>
        </div>

        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-title">Pending Requests</p>
            <p className="dashboard-card-copy">
              Review and confirm recipient requests to move donations faster.
            </p>
          </div>
          <button className="button button-secondary" onClick={() => navigate("/requests")}>
            View Requests
          </button>
        </div>

        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-title">Donation History</p>
            <p className="dashboard-card-copy">
              Track completed donations and keep the history of fulfilled requests in one place.
            </p>
          </div>
          <button className="button button-secondary" onClick={() => navigate("/history")}>
            View History
          </button>
        </div>

        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-title">Quick Action</p>
            <p className="dashboard-card-copy">
              Jump directly to the most important workflow and keep the app feeling fast.
            </p>
          </div>
          <button className="button button-primary" onClick={() => navigate("/post")}>Start a Post</button>
        </div>

        <div className="dashboard-card">
          <div>
            <p className="dashboard-card-title">Manage Pages</p>
            <p className="dashboard-card-copy">
              Move between sections smoothly and maintain a consistent workflow.
            </p>
          </div>
          <div className="dashboard-actions">
            <button className="button button-secondary" onClick={() => navigate("/list")}>Food</button>
            <button className="button button-secondary" onClick={() => navigate("/requests")}>Requests</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;