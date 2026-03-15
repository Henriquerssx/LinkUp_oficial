import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nome: "",
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
      const response = await axios.post("/auth/register", formData);
      login(response.data.access_token, response.data.user);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao criar conta");
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
            <p className="text-gray-600 text-base">Comece sua jornada de conexão</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome</Label>
              <Input
                id="nome"
                type="text"
                data-testid="register-name-input"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="mt-1.5 h-12 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email-input"
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
                data-testid="register-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1.5 h-12 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl" data-testid="register-error-message">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              data-testid="register-submit-button"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-base shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700" data-testid="login-link">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;