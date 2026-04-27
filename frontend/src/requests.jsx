import React, { useEffect, useState } from "react";
import api from "./api";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/requests")
      .then((res) => setRequests(res.data))
      .catch(() => {
        setRequests([]);
      });
  }, []);

  const confirmRequest = async (id) => {
    try {
      await api.post("/confirm", { id });
      setRequests((current) =>
        current.map((item) =>
          item._id === id || item.id === id ? { ...item, status: "confirmed" } : item,
        ),
      );
      alert("Request confirmed.");
    } catch (error) {
      const message = error.response?.data?.error || "Backend not connected.";
      alert(message);
    }
  };

  return (
    <div className="requests-page">
      <div className="requests-header">
        <p className="dashboard-badge">Pending Requests</p>
        <h1>Manage Requests</h1>
        <p>Review incoming donation requests and confirm fulfillment in real-time.</p>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>No pending requests yet.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request._id ?? request.id} className="request-card">
              <div className="request-card-header">
                <h3 className="request-title">{request.food}</h3>
                <span className={`request-badge request-badge-${request.status}`}>
                  {request.status}
                </span>
              </div>
              <div className="request-card-content">
                <p className="request-qty">Quantity: {request.qty}</p>
              </div>
              {request.status !== "confirmed" && (
                <button className="button button-primary" onClick={() => confirmRequest(request._id ?? request.id)}>
                  Confirm Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;
