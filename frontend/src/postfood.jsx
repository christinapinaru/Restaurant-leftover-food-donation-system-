<<<<<<< HEAD
﻿import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function PostFood() {
  const navigate = useNavigate();
  const [food, setFood] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

=======
﻿import React, { useState } from "react";
import api from "./api";

function PostFood() {
  const [food, setFood] = useState("");
  const [qty, setQty] = useState("");

>>>>>>> c439b9e7cb41fdf391316882350cb1e24594abe9
  const submit = async () => {
    if (!food || !qty) {
      alert("Please add both food name and quantity.");
      return;
    }

    try {
      await api.post("/add", { food, qty });
      setFood("");
      setQty("");
      alert("Food added successfully.");
    } catch (error) {
      const message = error.response?.data?.error || "Backend not connected.";
      alert(message);
    }
  };

  return (
    <div className="postfood-page">
      <div className="postfood-card">
        <div className="postfood-header">
          <p className="dashboard-badge">New Donation</p>
          <h1>Post food </h1>
          <p>
            Add a donation entry for the community. Use clear food names, quantities, and submit directly to the backend.
          </p>
        </div>

        <div className="postfood-form">
          <label className="postfood-label">Food Name</label>
          <input
            className="postfood-input"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Enter food name"
          />

          <label className="postfood-label">Quantity</label>
          <input
            className="postfood-input"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Enter quantity"
          />

          <button className="button button-primary" onClick={submit}>
            Post Donation
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostFood;
