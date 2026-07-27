import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await api.post("/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.error || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="login-page">
      <div className="promo-panel">
        <div className="promo-header">
          <div className="promo-logo">+</div>
          <div className="promo-brand">GoodPlate</div>
        </div>

        <div className="hero-block">
          <div className="hero-icon">🎁</div>
          <h2>Reducing food waste, one meal at a time.</h2>
          <p>Join thousands of donors and recipients building a sustainable future together.</p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">+</div>
          <span className="auth-label">GoodPlate</span>
        </div>

        <div className="auth-title">
          <h1>Welcome back</h1>
          <p>Sign in to continue making a difference.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-meta">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <span className="auth-link">Forgot password?</span>
          </div>

          <button type="submit" className="auth-submit">Sign In</button>
        </form>

        <p className="auth-footer">
          New to GoodPlate? <span onClick={() => navigate("/register")}>Join us</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
