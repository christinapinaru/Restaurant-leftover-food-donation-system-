import React, { useEffect, useState } from "react";
import api from "./api";

function FoodList() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    api.get("/all")
      .then((res) => setFoods(res.data))
      .catch(() => {
        setFoods([
          { food: "Rice", qty: "10 plates" },
          { food: "Bread", qty: "5 packs" },
        ]);
      });
  }, []);

  const requestFood = async (item) => {
    try {
      await api.post("/request", {
        food: item.food,
        qty: item.qty,
        user: "Guest",
      });
      alert("Request sent successfully.");
    } catch {
      alert("Backend not connected.");
    }
  };

  return (
    <div className="box">
      <h2>Available Food</h2>
      {foods.length === 0 ? (
        <p>No food available yet.</p>
      ) : (
        foods.map((item, index) => (
          <div key={item._id ?? index} className="item-row">
            <span>
              {item.food} - {item.qty}
            </span>
            <button onClick={() => requestFood(item)}>Request</button>
          </div>
        ))
      )}
    </div>
  );
}

export default FoodList;
