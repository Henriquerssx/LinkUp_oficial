import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", formData);
      login(response.data.access_token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'Manrope' }}>
              LinkUp
            </h1>
            <p className="text-gray-600 text-base">Prática de Conexão Humana</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="login-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 h-12 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
              <Input
                id="password"
                type="password"
                data-testid="login-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1.5 h-12 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl" data-testid="login-error-message">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              data-testid="login-submit-button"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-base shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700" data-testid="register-link">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;