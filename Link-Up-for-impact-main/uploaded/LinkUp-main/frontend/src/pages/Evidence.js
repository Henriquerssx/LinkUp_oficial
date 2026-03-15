import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingDown, Lightbulb, Calendar } from "lucide-react";
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
      
      // Atualizar a evidência com o feedback
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="text-blue-600 text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8" data-testid="evidence-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            data-testid="back-button"
            className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'Manrope' }}>
            Diário de Evidências
          </h1>
          <p className="text-gray-600 text-base">
            O registro das suas transformações. Cada evidência mostra a diferença entre o que você temia e o que realmente aconteceu.
          </p>
        </div>

        {/* Empty State */}
        {evidences.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center shadow-xl" data-testid="empty-state">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Nenhuma evidência ainda</h2>
            <p className="text-gray-600 mb-6 text-base">
              Complete sua primeira missão para começar a documentar suas descobertas.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              data-testid="go-to-dashboard-button"
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
            >
              Ver Missão do Dia
            </Button>
          </div>
        ) : (
          /* Evidence List */
          <div className="space-y-6">
            {evidences.map((evidence, idx) => (
              <div
                key={evidence.id}
                className="glass-card rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
                data-testid={`evidence-card-${idx}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">{evidence.mission_titulo}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(evidence.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  {/* Anxiety Reduction Badge */}
                  <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700">
                      -{evidence.nivel_ansiedade_antes - evidence.nivel_ansiedade_depois} ansiedade
                    </span>
                  </div>
                </div>

                {/* Belief Before */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Crença Limitante</h4>
                  <p className="text-gray-700 text-base bg-gray-50 p-4 rounded-xl border-l-4 border-gray-300">
                    "{evidence.crenca_antes}"
                  </p>
                </div>

                {/* Prediction vs Reality */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">O que eu temia</h4>
                    <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-300">
                      <p className="text-gray-700 text-base italic">"{evidence.previsao}"</p>
                      <div className="mt-3 text-sm text-gray-600">
                        Ansiedade: <span className="font-bold text-red-600">{evidence.nivel_ansiedade_antes}/10</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2 uppercase tracking-wide">O que aconteceu</h4>
                    <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-300">
                      <p className="text-gray-700 text-base">"{evidence.resultado_real}"</p>
                      <div className="mt-3 text-sm text-gray-600">
                        Ansiedade: <span className="font-bold text-green-600">{evidence.nivel_ansiedade_depois}/10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delta Positivo */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">Delta Positivo</h4>
                      <p className="text-gray-700 text-base">{evidence.delta_positivo}</p>
                    </div>
                  </div>
                </div>

                {/* Learning */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Aprendizado</h4>
                  <p className="text-gray-700 text-base bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
                    {evidence.aprendizado}
                  </p>
                </div>

                {/* AI Feedback */}
                <div className="mt-6 pt-6 border-t border-blue-100">
                  {evidence.feedback_ia ? (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                          Feedback do Terapeuta IA
                        </h4>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed ml-13">
                        {evidence.feedback_ia}
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => getFeedback(evidence.id)}
                      disabled={loadingFeedback[evidence.id]}
                      data-testid={`get-feedback-button-${idx}`}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                    >
                      {loadingFeedback[evidence.id] ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Gerando feedback...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Obter Feedback
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidence;