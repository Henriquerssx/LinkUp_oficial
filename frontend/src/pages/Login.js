import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
import BackgroundLines from "@/components/BackgroundLines";
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
    <div className="App" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
      <BackgroundLines />
      
      <div style={{width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10}} className="animate-fade-in">
        <div className="card-solido" style={{padding: 'clamp(2rem, 5vw, 3rem)'}}>
          <div style={{textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 2.5rem)'}}>
            <img 
              src="/linkup_logo.svg" 
              alt="LinkUp" 
              style={{
                width: 'clamp(180px, 50vw, 240px)', 
                height: 'auto', 
                margin: '0 auto 1rem',
                display: 'block'
              }} 
            />
            <p style={{color: 'var(--texto-corpo)', fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}>Prática de Conexão Humana</p>
          </div>

          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div>
              <Label htmlFor="email" style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, color: 'var(--texto-titulo)'}}>Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="login-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{marginTop: '0.5rem', height: 'clamp(2.75rem, 8vw, 3rem)', borderRadius: '12px', borderColor: '#E2E8F0', fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, color: 'var(--texto-titulo)'}}>Senha</Label>
              <Input
                id="password"
                type="password"
                data-testid="login-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{marginTop: '0.5rem', height: 'clamp(2.75rem, 8vw, 3rem)', borderRadius: '12px', borderColor: '#E2E8F0', fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}
                required
              />
            </div>

            {error && (
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 'clamp(0.875rem, 3vw, 1rem)', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px'}} data-testid="login-error-message">
                <AlertCircle className="h-5 w-5" style={{color: '#DC2626', flexShrink: 0}} />
                <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', color: '#DC2626'}}>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              data-testid="login-submit-button"
              style={{width: '100%', height: 'clamp(2.75rem, 8vw, 3rem)', borderRadius: '16px', background: 'var(--azul-principal)', color: 'white', fontWeight: 600, fontSize: 'clamp(0.9rem, 3vw, 1rem)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'}}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
            <p style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', color: 'var(--texto-corpo)'}}>
              Não tem uma conta?{" "}
              <Link to="/register" style={{color: 'var(--azul-principal)', fontWeight: 600}} data-testid="register-link">
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