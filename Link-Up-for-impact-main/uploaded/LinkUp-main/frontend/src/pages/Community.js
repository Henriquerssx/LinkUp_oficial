import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users as UsersIcon, Trophy, Anchor, Globe } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Community = () => {
  const navigate = useNavigate();
  const [podPosts, setPodPosts] = useState([]);
  const [clusterPosts, setClusterPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("pods"); // "pods" or "cluster"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/community");
      const allPosts = response.data;
      
      // Separar posts: anchor e pods são limitados, cluster é geral
      const anchorPost = allPosts.find(p => p.tipo === "anchor");
      const regularPosts = allPosts.filter(p => p.tipo !== "anchor");
      
      // Mission Pods: anchor + 6 posts
      setPodPosts(anchorPost ? [anchorPost, ...regularPosts.slice(0, 6)] : regularPosts.slice(0, 7));
      
      // Cluster: todos os posts
      setClusterPosts(allPosts);
    } catch (err) {
      console.error("Erro ao carregar comunidade:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8" data-testid="community-page">
      <div className="max-w-3xl mx-auto">
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
            Comunidade LinkUp
          </h1>
          <p className="text-gray-600 text-base">
            Conecte-se, compartilhe e inspire-se com outros membros
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("pods")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === "pods"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-blue-50"
            }`}
            data-testid="pods-tab"
          >
            <div className="flex items-center justify-center gap-2">
              <UsersIcon className="h-5 w-5" />
              <span>Mission Pods</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("cluster")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === "cluster"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-blue-50"
            }`}
            data-testid="cluster-tab"
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-5 w-5" />
              <span>Cluster</span>
            </div>
          </button>
        </div>

        {/* Mission Pods Info */}
        {activeTab === "pods" && (
          <div className="glass-card rounded-3xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                  Seu Mission Pod
                </h2>
                <p className="text-sm text-gray-600">Grupo de 4-5 pessoas + 1 Anchor</p>
              </div>
            </div>
            <p className="text-gray-700 text-base">
              Compartilhamento seguro com pessoas em jornadas similares. Os Anchors são membros experientes que estão aqui para apoiar e guiar.
            </p>
          </div>
        )}

        {/* Cluster Info */}
        {activeTab === "cluster" && (
          <div className="glass-card rounded-3xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                  Comunidade Cluster
                </h2>
                <p className="text-sm text-gray-600">Todos os usuários do LinkUp</p>
              </div>
            </div>
            <p className="text-gray-700 text-base">
              Conecte-se com toda a comunidade LinkUp. Veja conquistas, inspire-se e celebre o progresso coletivo.
            </p>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-5">
          {(activeTab === "pods" ? podPosts : clusterPosts).map((post, idx) => (
            <div
              key={post.id}
              className={`glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up ${
                post.tipo === "anchor" ? "border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50" : ""
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              data-testid={`community-post-${idx}`}
            >
              {/* Anchor Badge */}
              {post.tipo === "anchor" && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-yellow-200">
                  <Anchor className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                    Anchor • Membro Experiente
                  </span>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${
                  post.tipo === "anchor" 
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500" 
                    : "bg-gradient-to-br from-blue-400 to-blue-600"
                } rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {post.user_nome.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-base">{post.user_nome}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-600">{post.mission_titulo}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(post.data), "dd/MM", { locale: ptBR })}
                </span>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 text-base mb-4 leading-relaxed">{post.conquista}</p>

              {/* Likes */}
              <div className="flex items-center gap-3 pt-3 border-t border-blue-100">
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  data-testid={`like-button-${idx}`}
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-semibold">{post.likes}</span>
                </button>
                <span className="text-sm text-gray-500">pessoas apoiaram</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 glass-card rounded-3xl p-8 text-center shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Manrope' }}>
            Pronto para compartilhar sua conquista?
          </h3>
          <p className="text-gray-600 mb-6 text-base">
            Complete uma missão hoje e inspire outros membros da comunidade!
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            data-testid="start-mission-cta-button"
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg"
          >
            Ver Missão do Dia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;