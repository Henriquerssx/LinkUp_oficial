import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundLines from "@/components/BackgroundLines";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, ArrowLeft, Sparkles } from "lucide-react";

const MissionFlow = () => {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [phase, setPhase] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [fase1Data, setFase1Data] = useState({
    crenca_limitante: "",
    previsao_catastrofica: "",
    nivel_ansiedade: 5
  });

  const [fase3Data, setFase3Data] = useState({
    o_que_aconteceu: "",
    resultado_real: "",
    nivel_ansiedade_pos: 5,
    aprendizado: ""
  });

  useEffect(() => {
    fetchMission();
  }, [missionId]);

  const fetchMission = async () => {
    try {
      const missions = await axios.get("/missions");
      const foundMission = missions.data.find(m => m.id === missionId);
      setMission(foundMission);
    } catch (err) {
      console.error("Erro ao carregar missão:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhase1Next = () => {
    if (fase1Data.crenca_limitante && fase1Data.previsao_catastrofica) {
      setPhase(2);
    }
  };

  const handlePhase2Next = () => {
    setPhase(3);
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await axios.post("/missions/complete", {
        mission_id: missionId,
        fase1: fase1Data,
        fase3: fase3Data
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao completar missão:", err);
    } finally {
      setSubmitting(false);
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
    <div className="App" data-testid="mission-flow">
      <BackgroundLines />
      
      <div style={{maxWidth: '900px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', position: 'relative', zIndex: 10}}>
        
        <header style={{marginBottom: 'clamp(1.5rem, 4vw, 2rem)'}}>
          <button
            onClick={() => navigate("/dashboard")}
            data-testid="back-to-dashboard-button"
            style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', marginBottom: '1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', color: 'var(--azul-principal)', fontWeight: 600, fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', cursor: 'pointer'}}
          >
            <ArrowLeft style={{width: 'clamp(1rem, 4vw, 1.25rem)', height: 'clamp(1rem, 4vw, 1.25rem)'}} />
            Voltar
          </button>
          <h1 style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: 'var(--texto-titulo)', marginBottom: '0.5rem'}}>
            {mission?.titulo}
          </h1>
          <p style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', color: 'var(--texto-corpo)'}}>{mission?.descricao}</p>
        </header>

        {/* Progress Indicator com números EM CIMA dos labels */}
        <div className="card-solido" style={{marginBottom: 'clamp(1.5rem, 4vw, 2rem)', padding: 'clamp(1.5rem, 4vw, 2rem)'}}>
          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', gap: 'clamp(0.5rem, 2vw, 1rem)'}}>
            {[
              {num: 1, label: 'Antes'},
              {num: 2, label: 'Durante'},
              {num: 3, label: 'Depois'}
            ].map(({num, label}, idx) => (
              <div key={num} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                <div
                  style={{
                    width: 'clamp(2.5rem, 10vw, 3.5rem)',
                    height: 'clamp(2.5rem, 10vw, 3.5rem)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                    background: num < phase ? '#059669' : num === phase ? 'var(--azul-principal)' : '#E2E8F0',
                    color: num <= phase ? 'white' : '#94A3B8',
                    transition: 'all 0.3s ease',
                    marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                  }}
                  data-testid={`mission-phase-${num}`}
                >
                  {num < phase ? <CheckCircle style={{width: 'clamp(1.25rem, 5vw, 1.75rem)', height: 'clamp(1.25rem, 5vw, 1.75rem)'}} /> : num}
                </div>
                <span style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', fontWeight: 600, color: num === phase ? 'var(--azul-principal)' : 'var(--texto-corpo)', textAlign: 'center'}}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        <div style={{position: 'relative', minHeight: '400px'}}>
          {phase === 1 && (
            <div className="card-solido phase-content" data-testid="phase-1-content" style={{padding: 'clamp(1.5rem, 4vw, 2rem)'}}>
              <h2 style={{fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, marginBottom: 'clamp(1rem, 3vw, 1.5rem)', color: 'var(--texto-titulo)'}}>
                Identifique suas crenças
              </h2>

              <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)'}}>
                <div>
                  <Label style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: 'var(--texto-titulo)'}}>
                    Qual é sua crença limitante?
                  </Label>
                  <Textarea
                    data-testid="belief-textarea"
                    value={fase1Data.crenca_limitante}
                    onChange={(e) => setFase1Data({ ...fase1Data, crenca_limitante: e.target.value })}
                    placeholder="Ex: 'Não sou interessante o suficiente'..."
                    style={{minHeight: 'clamp(100px, 25vw, 120px)', borderRadius: '12px', fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}
                  />
                </div>

                <div>
                  <Label style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: 'var(--texto-titulo)'}}>
                    O que você prevê que vai acontecer?
                  </Label>
                  <Textarea
                    data-testid="prediction-textarea"
                    value={fase1Data.previsao_catastrofica}
                    onChange={(e) => setFase1Data({ ...fase1Data, previsao_catastrofica: e.target.value })}
                    placeholder="Ex: 'A pessoa vai me ignorar'..."
                    style={{minHeight: 'clamp(100px, 25vw, 120px)', borderRadius: '12px', fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}
                  />
                </div>

                <div>
                  <Label style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, marginBottom: '0.75rem', display: 'block', color: 'var(--texto-titulo)'}}>
                    Nível de ansiedade: {fase1Data.nivel_ansiedade}/10
                  </Label>
                  <Slider
                    data-testid="anxiety-before-slider"
                    value={[fase1Data.nivel_ansiedade]}
                    onValueChange={(value) => setFase1Data({ ...fase1Data, nivel_ansiedade: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: 'var(--texto-corpo)', marginTop: '0.5rem'}}>
                    <span>Calmo</span>
                    <span>Muito ansioso</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePhase1Next}
                disabled={!fase1Data.crenca_limitante || !fase1Data.previsao_catastrofica}
                data-testid="phase-1-next-button"
                style={{width: '100%', height: 'clamp(2.75rem, 8vw, 3rem)', marginTop: 'clamp(1.5rem, 4vw, 2rem)', borderRadius: '16px', background: 'var(--azul-principal)', color: 'white', fontWeight: 600, fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}
              >
                Próxima Fase →
              </Button>
            </div>
          )}

          {phase === 2 && (
            <div className="card-solido phase-content" data-testid="phase-2-content" style={{padding: 'clamp(1.5rem, 4vw, 2rem)'}}>
              <h2 style={{fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, marginBottom: 'clamp(1rem, 3vw, 1.5rem)', color: 'var(--texto-titulo)'}}>
                Hora de agir!
              </h2>

              <div style={{background: 'var(--azul-claro)', borderRadius: '16px', padding: 'clamp(1.25rem, 4vw, 1.75rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
                  <Sparkles style={{width: 'clamp(1.5rem, 5vw, 2rem)', height: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--azul-principal)'}} />
                  <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: 700, color: 'var(--azul-escuro)'}}>Sua Missão</h3>
                </div>
                <p style={{fontSize: 'clamp(0.9rem, 3vw, 1.05rem)', lineHeight: 1.6, color: 'var(--texto-titulo)'}}>{mission?.descricao}</p>
              </div>

              <div style={{background: '#FEF3C7', borderLeft: '4px solid #F59E0B', padding: 'clamp(1rem, 3vw, 1.25rem)', borderRadius: '0 12px 12px 0', marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
                <p style={{fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', color: '#92400E'}}>
                  <strong>Lembre-se:</strong> O objetivo é observar o que realmente acontece.
                </p>
              </div>

              <div style={{textAlign: 'center'}}>
                <p style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', color: 'var(--texto-corpo)', marginBottom: '1.25rem'}}>Quando completar, clique abaixo</p>
                <Button
                  onClick={handlePhase2Next}
                  data-testid="phase-2-done-button"
                  style={{height: 'clamp(2.75rem, 8vw, 3rem)', padding: '0 2rem', borderRadius: '16px', background: '#059669', color: 'white', fontWeight: 600, fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}
                >
                  Completei! ✓
                </Button>
              </div>
            </div>
          )}

          {phase === 3 && (
            <div className="card-solido phase-content" data-testid="phase-3-content" style={{padding: 'clamp(1.5rem, 4vw, 2rem)'}}>
              <h2 style={{fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, marginBottom: 'clamp(1rem, 3vw, 1.5rem)', color: 'var(--texto-titulo)'}}>
                O que aconteceu?
              </h2>

              <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)'}}>
                <div style={{background: 'var(--azul-claro)', borderRadius: '12px', padding: 'clamp(1rem, 3vw, 1.25rem)'}}>
                  <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600, color: 'var(--azul-principal)', marginBottom: '0.5rem'}}>Você previu:</p>
                  <p style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', fontStyle: 'italic', color: 'var(--texto-titulo)'}}>"{fase1Data.previsao_catastrofica}"</p>
                </div>

                <div>
                  <Label style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, marginBottom: '0.5rem', display: 'block'}}>O que efetivamente aconteceu?</Label>
                  <Textarea
                    data-testid="result-textarea"
                    value={fase3Data.resultado_real}
                    onChange={(e) => setFase3Data({ ...fase3Data, resultado_real: e.target.value })}
                    placeholder="Descreva o que ocorreu..."
                    style={{minHeight: 'clamp(100px, 25vw, 120px)', borderRadius: '12px', fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}
                  />
                </div>

                <div>
                  <Label style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, marginBottom: '0.5rem', display: 'block'}}>O que você aprendeu?</Label>
                  <Textarea
                    data-testid="learning-textarea"
                    value={fase3Data.aprendizado}
                    onChange={(e) => setFase3Data({ ...fase3Data, aprendizado: e.target.value })}
                    placeholder="Ex: 'As pessoas são mais receptivas'..."
                    style={{minHeight: 'clamp(90px, 20vw, 100px)', borderRadius: '12px', fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}
                  />
                </div>

                <div>
                  <Label style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', fontWeight: 600, marginBottom: '0.75rem', display: 'block'}}>Nível de ansiedade agora: {fase3Data.nivel_ansiedade_pos}/10</Label>
                  <Slider
                    data-testid="anxiety-after-slider"
                    value={[fase3Data.nivel_ansiedade_pos]}
                    onValueChange={(value) => setFase3Data({ ...fase3Data, nivel_ansiedade_pos: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: 'var(--texto-corpo)', marginTop: '0.5rem'}}>
                    <span>Calmo</span>
                    <span>Muito ansioso</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={!fase3Data.resultado_real || !fase3Data.aprendizado || submitting}
                data-testid="complete-mission-button"
                style={{width: '100%', height: 'clamp(2.75rem, 8vw, 3rem)', marginTop: 'clamp(1.5rem, 4vw, 2rem)', borderRadius: '16px', background: '#059669', color: 'white', fontWeight: 600, fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}
              >
                {submitting ? "Salvando..." : "Concluir e Salvar ✓"}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .phase-content {
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MissionFlow;
