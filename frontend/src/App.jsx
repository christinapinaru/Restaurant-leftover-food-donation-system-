import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './login'
import Register from './register'
import Dashboard from './dashboard'
import PostFood from './postfood'
import FoodList from './foodlist'
import Requests from './requests'
import History from './history'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post" element={<PostFood />} />
        <Route path="/list" element={<FoodList />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
