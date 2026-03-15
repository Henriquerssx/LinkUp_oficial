import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/App";
import BackgroundLines from "@/components/BackgroundLines";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, BookOpen, Users, LogOut, User, Sparkles, MapPin } from "lucide-react";

const NewDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [dailyMission, setDailyMission] = useState(null);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [universityEvents, setUniversityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [selectedEventForSuggestions, setSelectedEventForSuggestions] = useState(null);
  const [suggestedMissions, setSuggestedMissions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('missao');
  
  const [newEvent, setNewEvent] = useState({
    titulo: "",
    descricao: "",
    data_evento: "",
    tipo_evento: "apresentacao",
    nivel_importancia: 3
  });

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
      
      try {
        const personalEventsRes = await axios.get("/events/personal");
        setPersonalEvents(personalEventsRes.data);
      } catch (err) {
        console.log("Eventos pessoais não carregados")
      }
      
      try {
        const uniEventsRes = await axios.get("/events/university");
        setUniversityEvents(uniEventsRes.data);
      } catch (err) {
        console.log("Eventos universitários não carregados")
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post("/events/personal", newEvent);
      setShowEventModal(false);
      setNewEvent({
        titulo: "",
        descricao: "",
        data_evento: "",
        tipo_evento: "apresentacao",
        nivel_importancia: 3
      });
      fetchData();
    } catch (err) {
      console.error("Erro ao criar evento:", err);
    }
  };

  const handleSuggestMissions = async (event) => {
    setSelectedEventForSuggestions(event);
    setShowSuggestionsModal(true);
    setLoadingSuggestions(true);
    
    try {
      const response = await axios.post(`/events/suggest-missions?event_id=${event.id}`);
      setSuggestedMissions(response.data);
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
      setSuggestedMissions({ missoes_sugeridas: [], analise_ia: "Erro ao gerar sugestões" });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getUniBadgeClass = (uni) => {
    const classes = {
      'USP': 'usp',
      'Inteli': 'inteli',
      'FGV': 'fgv',
      'Insper': 'insper'
    };
    return classes[uni] || 'inteli';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--fundo-base)'}}>
        <div style={{color: 'var(--azul-principal)'}} className="text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="App" data-testid="dashboard">
      <BackgroundLines />
      
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)', position: 'relative', zIndex: 10}}>
        
        <header style={{marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <img 
              src="/linkup_logo.svg" 
              alt="LinkUp" 
              style={{
                width: 'clamp(180px, 50vw, 240px)', 
                height: 'auto',
                marginBottom: '0.5rem'
              }} 
            />
            <p style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', color: 'var(--texto-corpo)'}}>Olá, {user?.nome}</p>
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button
              onClick={() => navigate("/profile")}
              style={{padding: '0.625rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}
            >
              <User className="h-5 w-5" style={{color: 'var(--azul-principal)'}} />
            </button>
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              style={{padding: '0.625rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}
            >
              <LogOut className="h-5 w-5" style={{color: 'var(--azul-principal)'}} />
            </button>
          </div>
        </header>

        <div className="mobile-tabs">
          <button 
            className={`mobile-tab ${activeTab === 'missao' ? 'active' : ''}`}
            onClick={() => setActiveTab('missao')}
          >
            Missão
          </button>
          <button 
            className={`mobile-tab ${activeTab === 'eventos' ? 'active' : ''}`}
            onClick={() => setActiveTab('eventos')}
          >
            Eventos
          </button>
          <button 
            className={`mobile-tab ${activeTab === 'progresso' ? 'active' : ''}`}
            onClick={() => setActiveTab('progresso')}
          >
            Progresso
          </button>
        </div>

        <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'clamp(1rem, 3vw, 2.5rem)'}}>
          
          {/* COLUNA ESQUERDA - Missão + Seus Eventos + Quick Actions */}
          <div className="main-content" style={{display: activeTab === 'missao' || window.innerWidth > 768 ? 'flex' : 'none', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2rem)'}}>
            
            {/* Card de Missão */}
            <div className="card-missao-real">
              <div style={{position: 'relative', zIndex: 2}}>
                <div style={{marginBottom: 'clamp(0.75rem, 2vw, 1rem)'}}>
                  <span className="tag tag-branca">{dailyMission?.categoria}</span>
                </div>
                <h2 style={{color: 'white', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', fontFamily: 'Plus Jakarta Sans', lineHeight: 1.2}}>
                  {dailyMission?.titulo}
                </h2>
                <p style={{color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', lineHeight: 1.5, marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
                  {dailyMission?.descricao}
                </p>
                <button 
                  className="btn-primario" 
                  onClick={() => navigate(`/mission/${dailyMission?.id}`)}
                  data-testid="start-mission-button"
                  style={{fontSize: 'clamp(0.9rem, 3vw, 1rem)', padding: 'clamp(0.875rem, 3vw, 1rem) 1.5rem'}}
                >
                  Iniciar Missão
                </button>
              </div>
            </div>

            {/* Seus Eventos Pessoais */}
            <div className="card-solido">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontFamily: 'Plus Jakarta Sans'}}>Seus Eventos</h3>
                <Button size="sm" onClick={() => setShowEventModal(true)} style={{background: 'var(--azul-principal)', color: 'white'}}>
                  <Plus className="h-4 w-4 mr-1" />
                  Criar
                </Button>
              </div>
              
              {personalEvents.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {personalEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="diario-item">
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px'}}>
                        <Calendar className="h-4 w-4" style={{color: 'var(--azul-principal)'}} />
                        <span style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--azul-principal)'}}>
                          {formatDate(event.data_evento)}
                        </span>
                      </div>
                      <h4 style={{marginBottom: '4px', color: 'var(--azul-escuro)', fontSize: 'clamp(1rem, 3vw, 1.1rem)', fontWeight: 700}}>
                        {event.titulo}
                      </h4>
                      <p style={{fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', color: 'var(--texto-corpo)', marginBottom: '8px'}}>
                        {event.descricao.substring(0, 80)}...
                      </p>
                      <Button size="sm" variant="outline" onClick={() => handleSuggestMissions(event)} style={{fontSize: '0.75rem'}}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        IA Sugerir Missões
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: 'clamp(1.5rem, 4vw, 2rem)'}}>
                  <Calendar className="h-10 w-10 mx-auto mb-3" style={{color: 'var(--azul-principal)', opacity: 0.5}} />
                  <p style={{color: 'var(--texto-corpo)', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)'}}>Nenhum evento ainda. Crie um para receber missões da IA!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(0.75rem, 2vw, 1rem)'}}>
              <button
                onClick={() => navigate("/evidence")}
                data-testid="evidence-button"
                className="card-solido"
                style={{textAlign: 'left', cursor: 'pointer', padding: 'clamp(1rem, 3vw, 1.5rem)', border: 'none'}}
              >
                <BookOpen style={{width: 'clamp(1.75rem, 6vw, 2rem)', height: 'clamp(1.75rem, 6vw, 2rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', color: 'var(--azul-principal)'}} />
                <h3 style={{fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--texto-titulo)'}}>Diário</h3>
                <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: 'var(--texto-corpo)'}}>{progress?.total_evidencias || 0} registros</p>
              </button>

              <button
                onClick={() => navigate("/community")}
                data-testid="community-button"
                className="card-solido"
                style={{textAlign: 'left', cursor: 'pointer', padding: 'clamp(1rem, 3vw, 1.5rem)', border: 'none'}}
              >
                <Users style={{width: 'clamp(1.75rem, 6vw, 2rem)', height: 'clamp(1.75rem, 6vw, 2rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', color: 'var(--azul-principal)'}} />
                <h3 style={{fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--texto-titulo)'}}>Comunidade</h3>
                <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', color: 'var(--texto-corpo)'}}>Ver conquistas</p>
              </button>
            </div>
          </div>

          {/* Tab de Eventos Mobile */}
          <div style={{display: activeTab === 'eventos' && window.innerWidth <= 768 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem'}}>
            <div className="card-solido">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontFamily: 'Plus Jakarta Sans'}}>Seus Eventos</h3>
                <Button size="sm" onClick={() => setShowEventModal(true)} style={{background: 'var(--azul-principal)', color: 'white'}}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {personalEvents.length > 0 ? (
                personalEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="diario-item" style={{marginTop: '0.75rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px'}}>
                      <Calendar className="h-4 w-4" style={{color: 'var(--azul-principal)'}} />
                      <span style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--azul-principal)'}}>
                        {formatDate(event.data_evento)}
                      </span>
                    </div>
                    <h4 style={{marginBottom: '4px', color: 'var(--azul-escuro)', fontSize: '1rem', fontWeight: 700}}>
                      {event.titulo}
                    </h4>
                    <Button size="sm" variant="outline" onClick={() => handleSuggestMissions(event)} style={{fontSize: '0.75rem', marginTop: '0.5rem'}}>
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA Sugerir
                    </Button>
                  </div>
                ))
              ) : (
                <p style={{textAlign: 'center', padding: '2rem', color: 'var(--texto-corpo)'}}>Nenhum evento ainda</p>
              )}
            </div>
            
            {universityEvents.length > 0 && (
              <div className="card-solido">
                <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans'}}>Eventos Universitários</h3>
                {universityEvents.slice(0, 6).map((event) => (
                  <div key={event.id} className="evento-card" style={{marginBottom: '0.75rem'}}>
                    <div className={`uni-badge ${getUniBadgeClass(event.universidade)}`}>{event.universidade}</div>
                    <h4 style={{fontSize: '0.9rem', fontWeight: 700, margin: '6px 0 4px'}}>{event.titulo}</h4>
                    <div style={{fontSize: '0.75rem', color: 'var(--texto-corpo)'}}>{formatDate(event.data_evento)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUNA DIREITA - Progresso + Eventos Universitários (Desktop) */}
          <aside className="sidebar" style={{display: window.innerWidth > 768 ? 'flex' : 'none', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 2rem)'}}>
            
            {/* Progresso */}
            <div className="card-solido">
              <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)', fontFamily: 'Plus Jakarta Sans'}}>Progresso</h3>
              
              <div style={{marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
                <span className="tag tag-azul" style={{marginBottom: '8px', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'}}>Nível {progress?.nivel_atual}</span>
                <h2 style={{fontSize: 'clamp(1.25rem, 4vw, 1.6rem)', color: 'var(--azul-principal)', marginTop: '0.5rem'}}>
                  Interações Cotidianas
                </h2>
              </div>

              <div style={{margin: 'clamp(1rem, 3vw, 1.5rem) 0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600}}>
                  <span>XP</span>
                  <span style={{color: 'var(--azul-principal)'}}>{progress?.xp_atual}/{progress?.xp_proximo_nivel}</span>
                </div>
                <div className="progresso-bg">
                  <div className="progresso-fill" style={{width: `${progress?.porcentagem_nivel || 0}%`}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, color: '#F59E0B'}}>🔥</div>
                  <div style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)', marginTop: '0.25rem'}}>{progress?.streak} dias</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, color: 'var(--azul-principal)'}}>{progress?.total_missoes}</div>
                  <div style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)', marginTop: '0.25rem'}}>Missões</div>
                </div>
              </div>
            </div>

            {/* Eventos Universitários */}
            {universityEvents.length > 0 && (
              <div className="card-solido">
                <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans'}}>Eventos Universitários</h3>
                <p style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)', marginBottom: '1.25rem'}}>Próximos eventos de universidades parceiras</p>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {universityEvents.map((event) => (
                    <div key={event.id} className="evento-card">
                      <div className={`uni-badge ${getUniBadgeClass(event.universidade)}`}>
                        {event.universidade}
                      </div>
                      <h4 style={{fontSize: 'clamp(0.875rem, 3vw, 0.95rem)', fontWeight: 700, margin: '8px 0 4px', color: 'var(--texto-titulo)'}}>
                        {event.titulo}
                      </h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: 'var(--texto-corpo)', marginBottom: '4px'}}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.data_evento)}
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'clamp(0.7rem, 2vw, 0.75rem)', color: 'var(--texto-corpo)'}}>
                        <MapPin className="h-3 w-3" />
                        {event.local}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
          
          {/* Tab de Progresso Mobile (APENAS PROGRESSO, SEM EVENTOS) */}
          <div style={{display: activeTab === 'progresso' && window.innerWidth <= 768 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem'}}>
            <div className="card-solido">
              <h3 style={{fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)', fontFamily: 'Plus Jakarta Sans'}}>Progresso</h3>
              
              <div style={{marginBottom: 'clamp(1rem, 3vw, 1.5rem)'}}>
                <span className="tag tag-azul" style={{marginBottom: '8px', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'}}>Nível {progress?.nivel_atual}</span>
                <h2 style={{fontSize: 'clamp(1.25rem, 4vw, 1.6rem)', color: 'var(--azul-principal)', marginTop: '0.5rem'}}>
                  Interações Cotidianas
                </h2>
              </div>

              <div style={{margin: 'clamp(1rem, 3vw, 1.5rem) 0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', fontWeight: 600}}>
                  <span>XP</span>
                  <span style={{color: 'var(--azul-principal)'}}>{progress?.xp_atual}/{progress?.xp_proximo_nivel}</span>
                </div>
                <div className="progresso-bg">
                  <div className="progresso-fill" style={{width: `${progress?.porcentagem_nivel || 0}%`}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, color: '#F59E0B'}}>🔥</div>
                  <div style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)', marginTop: '0.25rem'}}>{progress?.streak} dias</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, color: 'var(--azul-principal)'}}>{progress?.total_missoes}</div>
                  <div style={{fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: 'var(--texto-corpo)', marginTop: '0.25rem'}}>Missões</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Evento</DialogTitle>
            <DialogDescription>A IA sugerirá missões personalizadas</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" value={newEvent.titulo} onChange={(e) => setNewEvent({...newEvent, titulo: e.target.value})} placeholder="Ex: Apresentação TCC" />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" value={newEvent.descricao} onChange={(e) => setNewEvent({...newEvent, descricao: e.target.value})} placeholder="Descreva o evento..." />
            </div>
            <div>
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" value={newEvent.data_evento} onChange={(e) => setNewEvent({...newEvent, data_evento: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={newEvent.tipo_evento} onValueChange={(value) => setNewEvent({...newEvent, tipo_evento: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="apresentacao">Apresentação</SelectItem>
                  <SelectItem value="entrevista">Entrevista</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="evento_social">Evento Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>Cancelar</Button>
            <Button onClick={handleCreateEvent} style={{background: 'var(--azul-principal)', color: 'white'}}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuggestionsModal} onOpenChange={setShowSuggestionsModal}>
        <DialogContent className="max-w-2xl" style={{maxHeight: '85vh', overflowY: 'auto'}}>
          <DialogHeader>
            <DialogTitle>Missões Sugeridas pela IA</DialogTitle>
            <DialogDescription>{selectedEventForSuggestions?.titulo}</DialogDescription>
          </DialogHeader>
          {loadingSuggestions ? (
            <div className="py-8 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-4 animate-pulse" style={{color: 'var(--azul-principal)'}} />
              <p>Criando missões personalizadas...</p>
            </div>
          ) : suggestedMissions ? (
            <div>
              {suggestedMissions.analise_ia && (
                <div style={{background: 'var(--azul-claro)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem'}}>
                  <p style={{fontSize: '0.85rem'}}><strong>Análise:</strong> {suggestedMissions.analise_ia}</p>
                </div>
              )}
              {suggestedMissions.missoes_sugeridas && suggestedMissions.missoes_sugeridas.map((missao, idx) => (
                <div key={idx} className="diario-item" style={{marginTop: '0.75rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px'}}>
                    <span style={{background: 'var(--azul-principal)', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold'}}>
                      {missao.ordem || idx + 1}
                    </span>
                    <span className="tag tag-azul" style={{fontSize: '0.65rem'}}>{missao.dificuldade}</span>
                  </div>
                  <h4 style={{fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px'}}>{missao.titulo}</h4>
                  <p style={{fontSize: '0.85rem', marginBottom: '6px'}}>{missao.descricao}</p>
                  <div style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--azul-principal)'}}>+{missao.xp_recompensa} XP</div>
                </div>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDashboard;