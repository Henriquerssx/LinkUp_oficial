import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundLines from "@/components/BackgroundLines";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users as UsersIcon, Globe, Anchor, Trophy } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Community = () => {
  const navigate = useNavigate();
  const [podPosts, setPodPosts] = useState([]);
  const [clusterPosts, setClusterPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("pods");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/community");
      const allPosts = response.data;
      
      const anchorPost = allPosts.find(p => p.tipo === "anchor");
      const regularPosts = allPosts.filter(p => p.tipo !== "anchor");
      
      setPodPosts(anchorPost ? [anchorPost, ...regularPosts.slice(0, 6)] : regularPosts.slice(0, 7));
      setClusterPosts(allPosts);
    } catch (err) {
      console.error("Erro ao carregar comunidade:", err);
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
    <div className="App" data-testid="community-page">
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
            Comunidade LinkUp
          </h1>
          <p style={{fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'var(--texto-corpo)'}}>Conecte-se, compartilhe e inspire-se com outros membros</p>
        </header>

        {/* Tabs */}
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
          <button
            onClick={() => setActiveTab("pods")}
            style={{
              flex: 1,
              padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.5rem)',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === "pods" ? 'var(--azul-principal)' : 'white',
              color: activeTab === "pods" ? 'white' : 'var(--texto-corpo)',
              fontWeight: 600,
              fontSize: 'clamp(0.875rem, 3vw, 0.95rem)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            data-testid="pods-tab"
          >
            <UsersIcon style={{width: '1.25rem', height: '1.25rem'}} />
            Mission Pods
          </button>
          <button
            onClick={() => setActiveTab("cluster")}
            style={{
              flex: 1,
              padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.5rem)',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === "cluster" ? 'var(--azul-principal)' : 'white',
              color: activeTab === "cluster" ? 'white' : 'var(--texto-corpo)',
              fontWeight: 600,
              fontSize: 'clamp(0.875rem, 3vw, 0.95rem)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            data-testid="cluster-tab"
          >
            <Globe style={{width: '1.25rem', height: '1.25rem'}} />
            Cluster
          </button>
        </div>

        {/* Info Card */}
        {activeTab === "pods" && (
          <div className="card-solido" style={{padding: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
              <div style={{width: 'clamp(2.5rem, 8vw, 3rem)', height: 'clamp(2.5rem, 8vw, 3rem)', background: 'var(--azul-principal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <UsersIcon style={{width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)', color: 'white'}} />
              </div>
              <div>
                <h2 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--texto-titulo)'}}>
                  Seu Mission Pod
                </h2>
                <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)'}}>Grupo de 4-5 pessoas + 1 Anchor</p>
              </div>
            </div>
            <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>
              Compartilhamento seguro com pessoas em jornadas similares. Os Anchors são membros experientes que estão aqui para apoiar e guiar.
            </p>
          </div>
        )}

        {activeTab === "cluster" && (
          <div className="card-solido" style={{padding: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
              <div style={{width: 'clamp(2.5rem, 8vw, 3rem)', height: 'clamp(2.5rem, 8vw, 3rem)', background: 'linear-gradient(135deg, var(--azul-principal), #8B5CF6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Globe style={{width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)', color: 'white'}} />
              </div>
              <div>
                <h2 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--texto-titulo)'}}>
                  Comunidade Cluster
                </h2>
                <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)'}}>Todos os usuários do LinkUp</p>
              </div>
            </div>
            <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>
              Conecte-se com toda a comunidade LinkUp. Veja conquistas, inspire-se e celebre o progresso coletivo.
            </p>
          </div>
        )}

        {/* Posts */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.25rem)'}}>
          {(activeTab === "pods" ? podPosts : clusterPosts).map((post, idx) => (
            <div
              key={post.id}
              className="card-solido"
              style={{padding: 'clamp(1.25rem, 3vw, 1.5rem)', border: post.tipo === "anchor" ? '2px solid #F59E0B' : 'none', background: post.tipo === "anchor" ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : 'white'}}
              data-testid={`community-post-${idx}`}
            >
              {post.tipo === "anchor" && (
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #FCD34D'}}>
                  <Anchor style={{width: '1.25rem', height: '1.25rem', color: '#D97706'}} />
                  <span style={{fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Anchor • Membro Experiente
                  </span>
                </div>
              )}

              <div style={{display: 'flex', alignItems: 'start', gap: 'clamp(0.75rem, 3vw, 1rem)', marginBottom: '1rem'}}>
                <div style={{width: 'clamp(2.5rem, 8vw, 3rem)', height: 'clamp(2.5rem, 8vw, 3rem)', background: post.tipo === "anchor" ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, var(--azul-principal), var(--azul-escuro))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 'clamp(1rem, 4vw, 1.25rem)', flexShrink: 0}}>
                  {post.user_nome.charAt(0)}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <h3 style={{fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', fontWeight: 700, color: 'var(--texto-titulo)', marginBottom: '0.25rem'}}>{post.user_nome}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <Trophy style={{width: 'clamp(0.875rem, 3vw, 1rem)', height: 'clamp(0.875rem, 3vw, 1rem)', color: 'var(--azul-principal)', flexShrink: 0}} />
                    <span style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600, color: 'var(--azul-principal)'}}>{post.mission_titulo}</span>
                  </div>
                </div>
                <span style={{fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: 'var(--texto-corpo)', flexShrink: 0}}>
                  {format(new Date(post.data), "dd/MM", { locale: ptBR })}
                </span>
              </div>

              <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', lineHeight: 1.6, marginBottom: '1rem'}}>{post.conquista}</p>

              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0'}}>
                <button
                  style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--texto-corpo)', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '8px', transition: 'all 0.2s'}}
                  data-testid={`like-button-${idx}`}
                >
                  <Heart style={{width: 'clamp(1rem, 3vw, 1.25rem)', height: 'clamp(1rem, 3vw, 1.25rem)'}} />
                  <span style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', fontWeight: 600}}>{post.likes}</span>
                </button>
                <span style={{fontSize: 'clamp(0.75rem, 2vw, 0.8rem)', color: 'var(--texto-corpo)'}}>pessoas apoiaram</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card-solido" style={{marginTop: 'clamp(1.5rem, 4vw, 2rem)', padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center'}}>
          <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--texto-titulo)', marginBottom: '0.75rem'}}>
            Pronto para compartilhar sua conquista?
          </h3>
          <p style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', color: 'var(--texto-corpo)', marginBottom: '1.5rem', lineHeight: 1.6}}>
            Complete uma missão hoje e inspire outros membros da comunidade!
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            data-testid="start-mission-cta-button"
            style={{padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem)', borderRadius: '12px', background: 'var(--azul-principal)', color: 'white', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', fontWeight: 600}}
          >
            Ver Missão do Dia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;