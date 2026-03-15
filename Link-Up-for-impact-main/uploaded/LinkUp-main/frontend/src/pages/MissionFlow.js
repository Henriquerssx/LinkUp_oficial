import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="text-blue-600 text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8" data-testid="mission-flow">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            data-testid="back-to-dashboard-button"
            className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'Manrope' }}>
            {mission?.titulo}
          </h1>
          <p className="text-gray-600 text-base">{mission?.descricao}</p>
        </div>

        {/* Progress Indicator */}
        <div className="glass-card rounded-3xl p-8 mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step < phase
                      ? "bg-green-500 text-white"
                      : step === phase
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-400"
                  }`}
                  data-testid={`mission-phase-${step}`}
                >
                  {step < phase ? <CheckCircle className="h-6 w-6" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < phase ? "bg-green-500" : "bg-blue-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium">
            <span className={phase === 1 ? "text-blue-600" : "text-gray-600"}>Antes</span>
            <span className={phase === 2 ? "text-blue-600" : "text-gray-600"}>Durante</span>
            <span className={phase === 3 ? "text-blue-600" : "text-gray-600"}>Depois</span>
          </div>
        </div>

        {/* Phase 1: Antes da Missão */}
        {phase === 1 && (
          <div className="glass-card rounded-3xl p-8 shadow-xl animate-slide-up" data-testid="phase-1-content">
            <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Manrope' }}>
              Fase 1: Identifique suas crenças
            </h2>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Qual é sua crença limitante sobre esta interação?
                </Label>
                <Textarea
                  data-testid="belief-textarea"
                  value={fase1Data.crenca_limitante}
                  onChange={(e) => setFase1Data({ ...fase1Data, crenca_limitante: e.target.value })}
                  placeholder="Ex: 'Eu não sou interessante o suficiente'..."
                  className="min-h-[120px] rounded-xl border-blue-200 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  O que você prevê que vai acontecer? (Seja específico)
                </Label>
                <Textarea
                  data-testid="prediction-textarea"
                  value={fase1Data.previsao_catastrofica}
                  onChange={(e) => setFase1Data({ ...fase1Data, previsao_catastrofica: e.target.value })}
                  placeholder="Ex: 'A pessoa vai me ignorar e eu vou me sentir humilhado'..."
                  className="min-h-[120px] rounded-xl border-blue-200 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Nível de ansiedade atual: {fase1Data.nivel_ansiedade}/10
                </Label>
                <Slider
                  data-testid="anxiety-before-slider"
                  value={[fase1Data.nivel_ansiedade]}
                  onValueChange={(value) => setFase1Data({ ...fase1Data, nivel_ansiedade: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Calmo</span>
                  <span>Muito ansioso</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePhase1Next}
              disabled={!fase1Data.crenca_limitante || !fase1Data.previsao_catastrofica}
              data-testid="phase-1-next-button"
              className="w-full h-12 mt-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              Próxima Fase
            </Button>
          </div>
        )}

        {/* Phase 2: Durante a Missão */}
        {phase === 2 && (
          <div className="glass-card rounded-3xl p-8 shadow-xl animate-slide-up" data-testid="phase-2-content">
            <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Manrope' }}>
              Fase 2: Hora de agir!
            </h2>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">Sua Missão</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{mission?.descricao}</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl mb-6">
              <p className="text-gray-700 text-base">
                <strong>Lembre-se:</strong> O objetivo não é ter sucesso perfeito, mas observar o que realmente acontece.
                Mesmo que seja desconfortável, você está coletando evidências.
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6 text-base">Quando completar a missão, clique abaixo para registrar o resultado.</p>
              <Button
                onClick={handlePhase2Next}
                data-testid="phase-2-done-button"
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg"
              >
                Completei a missão!
              </Button>
            </div>
          </div>
        )}

        {/* Phase 3: Após a Missão */}
        {phase === 3 && (
          <div className="glass-card rounded-3xl p-8 shadow-xl animate-slide-up" data-testid="phase-3-content">
            <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Manrope' }}>
              Fase 3: O que realmente aconteceu?
            </h2>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-sm font-medium text-blue-700 mb-2">Você previu:</p>
                <p className="text-gray-800 italic">"{fase1Data.previsao_catastrofica}"</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  O que efetivamente aconteceu?
                </Label>
                <Textarea
                  data-testid="result-textarea"
                  value={fase3Data.resultado_real}
                  onChange={(e) => setFase3Data({ ...fase3Data, resultado_real: e.target.value })}
                  placeholder="Descreva o que realmente ocorreu durante a interação..."
                  className="min-h-[120px] rounded-xl border-blue-200 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  O que você aprendeu com esta experiência?
                </Label>
                <Textarea
                  data-testid="learning-textarea"
                  value={fase3Data.aprendizado}
                  onChange={(e) => setFase3Data({ ...fase3Data, aprendizado: e.target.value })}
                  placeholder="Ex: 'Descobri que as pessoas são mais receptivas do que eu imaginava'..."
                  className="min-h-[100px] rounded-xl border-blue-200 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Nível de ansiedade agora: {fase3Data.nivel_ansiedade_pos}/10
                </Label>
                <Slider
                  data-testid="anxiety-after-slider"
                  value={[fase3Data.nivel_ansiedade_pos]}
                  onValueChange={(value) => setFase3Data({ ...fase3Data, nivel_ansiedade_pos: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Calmo</span>
                  <span>Muito ansioso</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleComplete}
              disabled={!fase3Data.resultado_real || !fase3Data.aprendizado || submitting}
              data-testid="complete-mission-button"
              className="w-full h-12 mt-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {submitting ? "Salvando..." : "Concluir e Salvar"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionFlow;