import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.get("/history")
      .then((res) => setHistory(res.data))
      .catch(() => {
        setHistory([]);
      });
  }, []);

  return (
    <div className="history-page">
      <div className="history-header">
        <p className="dashboard-badge">Donation History</p>
        <h1>Past Donations</h1>
        <p>View a complete log of all fulfilled donations and completed requests.</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No history yet.</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item, index) => (
            <div key={item._id ?? index} className="history-card">
              <div className="history-card-header">
                <h3 className="history-title">{item.food}</h3>
                <span className="history-status">Completed</span>
              </div>
              <div className="history-card-content">
                <p className="history-qty">Quantity: {item.qty}</p>
                <p className="history-date">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
