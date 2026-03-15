import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
import BackgroundLines from "@/components/BackgroundLines";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, TrendingUp, Lightbulb, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalises();
  }, []);

  const fetchAnalises = async () => {
    try {
      const response = await axios.get("/user/analises");
      setAnalises(response.data);
    } catch (err) {
      console.error("Erro ao carregar análises:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--fundo-base)'}}>
        <div style={{color: 'var(--azul-principal)'}} className="text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="App" data-testid="profile-page">
      <BackgroundLines />
      
      <div style={{maxWidth: '900px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)', position: 'relative', zIndex: 10}}>
        
        <header style={{marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)'}}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', marginBottom: '1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', color: 'var(--azul-principal)', fontWeight: 600, fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', cursor: 'pointer'}}
          >
            <ArrowLeft style={{width: 'clamp(1rem, 4vw, 1.25rem)', height: 'clamp(1rem, 4vw, 1.25rem)'}} />
            Voltar
          </button>
          <h1 style={{fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: 'var(--texto-titulo)', marginBottom: '0.5rem'}}>
            Seu Perfil
          </h1>
          <p style={{fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'var(--texto-corpo)'}}>Histórico de análises de IA e evolução da sua jornada</p>
        </header>

        {/* User Info Card */}
        <div className="card-solido" style={{padding: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: user?.analise_inicial ? 'clamp(1.5rem, 4vw, 2rem)' : 0}}>
            <div style={{width: 'clamp(4rem, 12vw, 5rem)', height: 'clamp(4rem, 12vw, 5rem)', background: 'linear-gradient(135deg, var(--azul-principal), var(--azul-escuro))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 700, flexShrink: 0}}>
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div style={{minWidth: 0}}>
              <h2 style={{fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--texto-titulo)', marginBottom: '0.25rem'}}>{user?.nome}</h2>
              <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', wordBreak: 'break-word'}}>{user?.email}</p>
            </div>
          </div>

          {user?.analise_inicial && (
            <div style={{padding: 'clamp(1.25rem, 3vw, 1.5rem)', background: 'var(--azul-claro)', borderRadius: '16px'}}>
              <h3 style={{fontSize: 'clamp(1rem, 4vw, 1.2rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--azul-escuro)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)'}}>
                Análise Inicial
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)'}}>
                <div>
                  <span style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600, color: 'var(--azul-escuro)'}}>Nível Recomendado:</span>
                  <span style={{marginLeft: '0.5rem', fontSize: 'clamp(0.9rem, 3vw, 1rem)', fontWeight: 700, color: 'var(--azul-principal)'}}>
                    Nível {user.analise_inicial.nivel}
                  </span>
                </div>
                <div>
                  <span style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600, color: 'var(--azul-escuro)', display: 'block', marginBottom: '0.5rem'}}>Justificativa:</span>
                  <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>{user.analise_inicial.justificativa}</p>
                </div>
                {user.analise_inicial.pontos_principais && user.analise_inicial.pontos_principais.length > 0 && (
                  <div>
                    <span style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600, color: 'var(--azul-escuro)', display: 'block', marginBottom: '0.5rem'}}>Pontos Principais:</span>
                    <ul style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                      {user.analise_inicial.pontos_principais.map((ponto, idx) => (
                        <li key={idx} style={{display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.5}}>
                          <span style={{color: 'var(--azul-principal)', marginTop: '0.25rem', flexShrink: 0}}>•</span>
                          <span>{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Histórico de Análises */}
        <h2 style={{fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--texto-titulo)', marginBottom: 'clamp(1rem, 3vw, 1.25rem)'}}>
          Histórico de Análises de IA
        </h2>

        {analises.length === 0 ? (
          <div className="card-solido" style={{padding: 'clamp(3rem, 6vw, 4rem)', textAlign: 'center'}}>
            <Brain style={{width: 'clamp(3rem, 8vw, 4rem)', height: 'clamp(3rem, 8vw, 4rem)', color: 'var(--azul-principal)', opacity: 0.5, margin: '0 auto', marginBottom: '1rem'}} />
            <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: 700, color: 'var(--texto-titulo)', marginBottom: '0.5rem'}}>Nenhuma análise ainda</h3>
            <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>
              Complete missões e solicite insights para ver suas análises aqui.
            </p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.25rem)'}}>
            {analises.map((analise, idx) => (
              <div
                key={analise.id}
                className="card-solido"
                style={{padding: 'clamp(1.25rem, 3vw, 1.5rem)'}}
                data-testid={`analise-${idx}`}
              >
                <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 'clamp(1rem, 3vw, 1.25rem)', gap: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 3vw, 1rem)', minWidth: 0, flex: 1}}>
                    {analise.tipo === "onboarding" ? (
                      <div style={{width: 'clamp(2.5rem, 8vw, 2.75rem)', height: 'clamp(2.5rem, 8vw, 2.75rem)', background: '#7C3AED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                        <Brain style={{width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)', color: 'white'}} />
                      </div>
                    ) : (
                      <div style={{width: 'clamp(2.5rem, 8vw, 2.75rem)', height: 'clamp(2.5rem, 8vw, 2.75rem)', background: 'var(--azul-principal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                        <TrendingUp style={{width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)', color: 'white'}} />
                      </div>
                    )}
                    <div style={{minWidth: 0}}>
                      <h3 style={{fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', fontWeight: 700, color: 'var(--texto-titulo)', marginBottom: '0.25rem'}}>
                        {analise.tipo === "onboarding" ? "Análise de Onboarding" : "Insights de Progresso"}
                      </h3>
                      <p style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'clamp(0.75rem, 2vw, 0.8rem)', color: 'var(--texto-corpo)'}}>
                        <Calendar style={{width: 'clamp(0.75rem, 2vw, 0.875rem)', height: 'clamp(0.75rem, 2vw, 0.875rem)', flexShrink: 0}} />
                        {format(new Date(analise.data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>

                {analise.tipo === "onboarding" && (
                  <div style={{padding: 'clamp(1rem, 3vw, 1.25rem)', background: 'var(--azul-claro)', borderRadius: '12px'}}>
                    <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--azul-escuro)', marginBottom: '0.5rem'}}>
                      <strong>Nível recomendado:</strong> Nível {analise.analise.nivel}
                    </p>
                    <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6, marginBottom: analise.analise.pontos_principais && analise.analise.pontos_principais.length > 0 ? '0.75rem' : 0}}>{analise.analise.justificativa}</p>
                    {analise.analise.pontos_principais && analise.analise.pontos_principais.length > 0 && (
                      <ul style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        {analise.analise.pontos_principais.map((ponto, i) => (
                          <li key={i} style={{display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', color: 'var(--texto-corpo)', lineHeight: 1.5}}>
                            <span style={{color: 'var(--azul-principal)', flexShrink: 0}}>•</span>
                            {ponto}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {analise.tipo === "insights" && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)'}}>
                    <div style={{padding: 'clamp(1rem, 3vw, 1.25rem)', background: 'var(--azul-claro)', borderRadius: '12px'}}>
                      <h4 style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', fontWeight: 700, color: 'var(--azul-escuro)', marginBottom: '0.5rem'}}>Progresso Geral</h4>
                      <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>{analise.analise.progresso_geral}</p>
                    </div>
                    
                    {analise.analise.padroes_identificados && (
                      <div style={{padding: 'clamp(1rem, 3vw, 1.25rem)', background: '#D1FAE5', borderRadius: '12px'}}>
                        <h4 style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', fontWeight: 700, color: '#065F46', marginBottom: '0.5rem'}}>Padrões Identificados</h4>
                        <ul style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                          {analise.analise.padroes_identificados.map((padrao, i) => (
                            <li key={i} style={{display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: '#047857', lineHeight: 1.6}}>
                              <span style={{color: '#10B981', flexShrink: 0}}>•</span>
                              {padrao}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analise.analise.mensagem_motivacional && (
                      <div style={{padding: 'clamp(1rem, 3vw, 1.25rem)', background: '#FEF3C7', borderRadius: '12px', borderLeft: '4px solid #F59E0B'}}>
                        <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: '#78350F', fontStyle: 'italic', lineHeight: 1.6}}>
                          {analise.analise.mensagem_motivacional}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;