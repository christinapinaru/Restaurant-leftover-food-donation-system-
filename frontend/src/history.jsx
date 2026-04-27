import React, { useEffect, useState } from "react";
import api from "./api";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/history")
      .then((res) => setHistory(res.data))
      .catch(() => {
        setHistory([]);
      });
  }, []);

  return (
    <div className="box">
      <h2>Donation History</h2>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        history.map((item, index) => (
          <div key={item._id ?? index} className="item-row">
            <div>
              {item.food} - {item.qty}
            </div>
            <div className="meta">{new Date(item.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
