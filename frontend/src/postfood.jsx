import React, { useState } from "react";
import api from "./api";

function PostFood() {
  const [food, setFood] = useState("");
  const [qty, setQty] = useState("");

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
    } catch {
      alert("Backend not connected.");
    }
  };

  return (
    <div className="box">
      <h2>Post Food</h2>
      <input value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food Name" />
      <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Quantity" />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default PostFood;
