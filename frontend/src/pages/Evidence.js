import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundLines from "@/components/BackgroundLines";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingDown, Lightbulb, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Evidence = () => {
  const navigate = useNavigate();
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState({});

  useEffect(() => {
    fetchEvidences();
  }, []);

  const fetchEvidences = async () => {
    try {
      const response = await axios.get("/evidence");
      setEvidences(response.data);
    } catch (err) {
      console.error("Erro ao carregar evidências:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFeedback = async (evidenceId) => {
    setLoadingFeedback({ ...loadingFeedback, [evidenceId]: true });
    try {
      const response = await axios.post("/evidence/feedback", null, {
        params: { evidence_id: evidenceId }
      });
      
      setEvidences(evidences.map(ev => 
        ev.id === evidenceId 
          ? { ...ev, feedback_ia: response.data.feedback }
          : ev
      ));
    } catch (err) {
      console.error("Erro ao obter feedback:", err);
    } finally {
      setLoadingFeedback({ ...loadingFeedback, [evidenceId]: false });
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
    <div className="App" data-testid="evidence-page">
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
            Diário de Evidências
          </h1>
          <p style={{fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'var(--texto-corpo)'}}>Suas conquistas e descobertas</p>
        </header>

        {evidences.length === 0 ? (
          <div className="card-solido" style={{padding: 'clamp(3rem, 6vw, 4rem)', textAlign: 'center'}}>
            <Lightbulb className="mx-auto mb-4" style={{width: 'clamp(3rem, 8vw, 4rem)', height: 'clamp(3rem, 8vw, 4rem)', color: 'var(--azul-principal)', opacity: 0.5}} />
            <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--texto-titulo)'}}>Nenhuma evidência ainda</h3>
            <p style={{fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: 'var(--texto-corpo)', marginBottom: '1.5rem'}}>Complete missões para registrar suas descobertas</p>
            <Button onClick={() => navigate("/dashboard")} style={{background: 'var(--azul-principal)', color: 'white'}}>
              Ver Missões
            </Button>
          </div>
        ) : (
          <div className="card-solido" style={{padding: 'clamp(1.5rem, 4vw, 2rem)'}}>
            <div style={{marginBottom: 'clamp(1.5rem, 4vw, 2rem)'}}>
              <h2 style={{fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--texto-titulo)'}}>
                Suas Evidências ({evidences.length})
              </h2>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)'}}>
              {evidences.map((evidence) => {
                const ansiedadeReducao = evidence.nivel_ansiedade_antes - evidence.nivel_ansiedade_depois;
                const deltaPositivo = ansiedadeReducao > 0;

                return (
                  <div key={evidence.id} className="diario-item">
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem'}}>
                      <Calendar className="h-4 w-4" style={{color: 'var(--azul-principal)'}} />
                      <span style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: 600, color: 'var(--azul-principal)'}}>
                        {format(new Date(evidence.data), "d 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>

                    <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--azul-escuro)', fontFamily: 'Plus Jakarta Sans'}}>
                      {evidence.mission_titulo}
                    </h3>

                    <div style={{display: 'grid', gap: '0.75rem', marginBottom: '1rem'}}>
                      <div style={{padding: 'clamp(0.875rem, 3vw, 1rem)', background: '#FEF3C7', borderRadius: '12px'}}>
                        <p style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', fontWeight: 700, color: '#92400E', marginBottom: '0.25rem', textTransform: 'uppercase'}}>Você previu:</p>
                        <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: '#78350F', fontStyle: 'italic'}}>"{evidence.previsao}"</p>
                      </div>

                      <div style={{padding: 'clamp(0.875rem, 3vw, 1rem)', background: '#D1FAE5', borderRadius: '12px'}}>
                        <p style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', fontWeight: 700, color: '#065F46', marginBottom: '0.25rem', textTransform: 'uppercase'}}>O que aconteceu:</p>
                        <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: '#047857'}}>"{evidence.resultado_real}"</p>
                      </div>
                    </div>

                    {deltaPositivo && (
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: 'clamp(0.75rem, 3vw, 1rem)', background: 'var(--azul-claro)', borderRadius: '12px', marginBottom: '1rem'}}>
                        <TrendingDown style={{width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)', color: 'var(--sucesso)'}} />
                        <div>
                          <p style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', fontWeight: 700, color: 'var(--azul-escuro)'}}>Delta Positivo</p>
                          <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', color: 'var(--texto-corpo)'}}>Ansiedade: {evidence.nivel_ansiedade_antes} → {evidence.nivel_ansiedade_depois}</p>
                        </div>
                      </div>
                    )}

                    {evidence.aprendizado && (
                      <div style={{padding: 'clamp(0.875rem, 3vw, 1rem)', background: '#F8FAFC', borderRadius: '12px', marginBottom: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem'}}>
                          <Lightbulb style={{width: 'clamp(1rem, 3vw, 1.25rem)', height: 'clamp(1rem, 3vw, 1.25rem)', color: 'var(--azul-principal)'}} />
                          <p style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', fontWeight: 700, color: 'var(--azul-escuro)', textTransform: 'uppercase'}}>Aprendizado:</p>
                        </div>
                        <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>{evidence.aprendizado}</p>
                      </div>
                    )}

                    {evidence.feedback_ia ? (
                      <div style={{padding: 'clamp(1rem, 3vw, 1.25rem)', background: 'var(--azul-claro)', borderRadius: '12px', borderLeft: '4px solid var(--azul-principal)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem'}}>
                          <Sparkles style={{width: 'clamp(1rem, 3vw, 1.25rem)', height: 'clamp(1rem, 3vw, 1.25rem)', color: 'var(--azul-principal)'}} />
                          <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', fontWeight: 700, color: 'var(--azul-escuro)'}}>Feedback IA</p>
                        </div>
                        <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>{evidence.feedback_ia}</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => getFeedback(evidence.id)}
                        disabled={loadingFeedback[evidence.id]}
                        variant="outline"
                        size="sm"
                        style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)'}}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {loadingFeedback[evidence.id] ? "Gerando..." : "Feedback IA"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidence;
