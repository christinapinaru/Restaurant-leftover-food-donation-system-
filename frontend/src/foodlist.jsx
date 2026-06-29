import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function FoodList() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    api.get("/all")
      .then((res) => setFoods(res.data))
      .catch(() => {
        setFoods([]);
      });
  }, [navigate]);

  const requestFood = async (item) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    try {
      await api.post("/request", {
        food: item.food,
        qty: item.qty,
        user: user.name || "Guest",
      });
      alert("Request sent successfully.");
    } catch (error) {
      const message = error.response?.data?.error || "Backend not connected.";
      alert(message);
    }
  };

  return (
    <div className="foodlist-page">
      <div className="foodlist-header">
        <p className="dashboard-badge">Available Food</p>
        <h1>Browse Donations</h1>
        <p>Find available food donations from community members and place your request.</p>
      </div>

      {foods.length === 0 ? (
        <div className="empty-state">
          <p>No food available yet.</p>
        </div>
      ) : (
        <div className="foodlist-grid">
          {foods.map((item, index) => (
            <div key={item._id ?? index} className="foodlist-card">
              <div className="foodlist-card-content">
                <h3 className="foodlist-title">{item.food}</h3>
                <p className="foodlist-qty">Quantity: {item.qty}</p>
              </div>
              <button className="button button-primary" onClick={() => requestFood(item)}>
                Request This Food
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoodList;
