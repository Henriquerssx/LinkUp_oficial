import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "@/App.css";

// Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import MissionFlow from "@/pages/MissionFlow";
import Evidence from "@/pages/Evidence";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios
axios.defaults.baseURL = API;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
          <div className="text-blue-600 text-xl font-semibold">Carregando...</div>
        </div>
      );
    }
    return token ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="text-blue-600 text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mission/:missionId"
              element={
                <ProtectedRoute>
                  <MissionFlow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evidence"
              element={
                <ProtectedRoute>
                  <Evidence />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;