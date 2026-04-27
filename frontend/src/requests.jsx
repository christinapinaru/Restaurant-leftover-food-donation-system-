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
    } catch {
      alert("Backend not connected.");
    }
  };

  return (
    <div className="box">
      <h2>Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests yet.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id ?? request.id} className="item-row">
            <span>
              {request.food} - {request.qty} ({request.status})
            </span>
            {request.status !== "confirmed" && (
              <button onClick={() => confirmRequest(request._id ?? request.id)}>
                Confirm
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Requests;
