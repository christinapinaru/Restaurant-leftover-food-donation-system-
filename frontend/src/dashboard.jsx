import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/post")}>Post Food</button>
      <button onClick={() => navigate("/list")}>View Food</button>
      <button onClick={() => navigate("/requests")}>Requests</button>
      <button onClick={() => navigate("/history")}>History</button>
      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
}

export default Dashboard;