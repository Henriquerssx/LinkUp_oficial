import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Award, Target, Users, BookOpen, LogOut, Lightbulb } from "lucide-react";

const levelNames = [
  "Ansiedade Social Leve",
  "Ansiedade Social Moderada",
  "Ansiedade Social Severa"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [dailyMission, setDailyMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, missionRes] = await Promise.all([
        axios.get("/progress"),
        axios.get("/missions/recommended")
      ]);
      setProgress(progressRes.data);
      setDailyMission(missionRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="text-blue-600 text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8" data-testid="dashboard">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1" style={{ fontFamily: 'Manrope' }}>
              Olá, {user?.nome}!
            </h1>
            <p className="text-gray-600 text-base">Continue sua jornada de transformação</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              data-testid="profile-button"
              className="rounded-xl border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Award className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              data-testid="logout-button"
              className="rounded-xl border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission of the Day */}
            <div className="glass-card rounded-3xl p-8 shadow-xl animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                    Missão Recomendada
                  </h2>
                  <p className="text-sm text-gray-600">{dailyMission?.categoria}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">{dailyMission?.titulo}</h3>
                <p className="text-gray-700 text-base leading-relaxed mb-4">{dailyMission?.descricao}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full font-semibold">
                    {dailyMission?.dificuldade}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-semibold">
                    <Star className="h-4 w-4 fill-blue-600" />
                    +{dailyMission?.xp_recompensa} XP
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate(`/mission/${dailyMission?.id}`)}
                data-testid="start-mission-button"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl"
              >
                Iniciar Missão
              </Button>
            </div>

            {/* Insights Notice */}
            {progress?.total_evidencias >= 2 && (
              <div 
                className="glass-card rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 animate-slide-up"
                onClick={() => navigate("/profile")}
                data-testid="insights-notice"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: 'Manrope' }}>
                      Insights Disponíveis!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Acesse seu perfil para ver análises detalhadas sobre sua jornada e padrões de comportamento
                    </p>
                  </div>
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/evidence")}
                data-testid="evidence-button"
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 text-left group"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">Diário de Evidências</h3>
                <p className="text-sm text-gray-600">{progress?.total_evidencias || 0} registros</p>
              </button>

              <button
                onClick={() => navigate("/community")}
                data-testid="community-button"
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 text-left group"
              >
                <Users className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">Comunidade</h3>
                <p className="text-sm text-gray-600">Ver conquistas</p>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="glass-card rounded-3xl p-6 shadow-xl animate-slide-up">
              <h3 className="text-lg font-bold text-gray-800 mb-6" style={{ fontFamily: 'Manrope' }}>Seu Progresso</h3>

              {/* Level */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Nível Atual</span>
                  <span className="text-2xl font-bold text-blue-600">{progress?.nivel_atual}</span>
                </div>
                <div className="bg-blue-100 rounded-full px-4 py-2 text-center">
                  <p className="text-sm font-semibold text-blue-700">
                    {levelNames[progress?.nivel_atual - 1]}
                  </p>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Experiência</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {progress?.xp_atual} / {progress?.xp_proximo_nivel} XP
                  </span>
                </div>
                <Progress value={progress?.porcentagem_nivel} className="h-3" />
              </div>

              {/* Streak */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500 streak-flame" />
                    <div>
                      <p className="text-sm text-gray-600">Ofensiva</p>
                      <p className="text-2xl font-bold text-orange-600">{progress?.streak} dias</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Missões completas</span>
                  <span className="text-base font-bold text-gray-800">{progress?.total_missoes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Evidências registradas</span>
                  <span className="text-base font-bold text-gray-800">{progress?.total_evidencias}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            {progress?.badges && progress.badges.length > 0 && (
              <div className="glass-card rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Manrope' }}>
                  Conquistas
                </h3>
                <div className="flex flex-wrap gap-3">
                  {progress.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg badge-glow"
                      data-testid={`badge-${badge.id}`}
                    >
                      <Award className="h-8 w-8 text-white mb-1" />
                      <span className="text-xs text-white font-semibold">Nível {badge.nome.split(" ")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;