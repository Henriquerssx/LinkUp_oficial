import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="text-blue-600 text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8" data-testid="profile-page">
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
            Seu Perfil
          </h1>
          <p className="text-gray-600 text-base">
            Histórico de análises de IA e evolução da sua jornada
          </p>
        </div>

        {/* User Info */}
        <div className="glass-card rounded-3xl p-8 shadow-xl mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.nome}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {user?.analise_inicial && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-purple-700 mb-3" style={{ fontFamily: 'Manrope' }}>
                Análise Inicial
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-semibold text-gray-600">Nível Recomendado:</span>
                  <span className="ml-2 text-base font-bold text-purple-600">
                    Nível {user.analise_inicial.nivel}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600 block mb-2">Justificativa:</span>
                  <p className="text-gray-700 text-base">{user.analise_inicial.justificativa}</p>
                </div>
                {user.analise_inicial.pontos_principais && user.analise_inicial.pontos_principais.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600 block mb-2">Pontos Principais:</span>
                    <ul className="space-y-1">
                      {user.analise_inicial.pontos_principais.map((ponto, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-base">
                          <span className="text-purple-500 mt-1">•</span>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Manrope' }}>
          Histórico de Análises de IA
        </h2>

        {analises.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center shadow-xl">
            <Brain className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma análise ainda</h3>
            <p className="text-gray-600 text-base">
              Complete missões e solicite insights para ver suas análises aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {analises.map((analise, idx) => (
              <div
                key={analise.id}
                className="glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
                data-testid={`analise-${idx}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {analise.tipo === "onboarding" ? (
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {analise.tipo === "onboarding" ? "Análise de Onboarding" : "Insights de Progresso"}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(analise.data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>

                {analise.tipo === "onboarding" && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Nível recomendado:</strong> Nível {analise.analise.nivel}
                    </p>
                    <p className="text-gray-700 text-base mb-3">{analise.analise.justificativa}</p>
                    {analise.analise.pontos_principais && analise.analise.pontos_principais.length > 0 && (
                      <ul className="space-y-1">
                        {analise.analise.pontos_principais.map((ponto, i) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-purple-500">•</span>
                            {ponto}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {analise.tipo === "insights" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-blue-700 mb-2">Progresso Geral</h4>
                      <p className="text-gray-700 text-base">{analise.analise.progresso_geral}</p>
                    </div>
                    
                    {analise.analise.padroes_identificados && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-green-700 mb-2">Padrões Identificados</h4>
                        <ul className="space-y-1">
                          {analise.analise.padroes_identificados.map((padrao, i) => (
                            <li key={i} className="text-gray-700 text-base flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {padrao}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analise.analise.mensagem_motivacional && (
                      <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
                        <p className="text-gray-800 text-base italic">
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
