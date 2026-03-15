import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundLines from "@/components/BackgroundLines";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Sparkles } from "lucide-react";

const questions = [
  {
    id: "pergunta1",
    text: "Qual é a sua maior dificuldade em interações sociais?",
    placeholder: "Ex: Tenho medo de ser julgado ao iniciar uma conversa..."
  },
  {
    id: "pergunta2",
    text: "Qual é o seu maior medo quando pensa em interagir com outras pessoas?",
    placeholder: "Ex: Medo de ser rejeitado, medo de falar algo errado..."
  },
  {
    id: "pergunta3",
    text: "Qual tipo de situação social você mais evita?",
    placeholder: "Ex: Eventos com muitas pessoas, conversas individuais, falar em público..."
  },
  {
    id: "pergunta4",
    text: "Com que frequência você evita situações sociais por causa da ansiedade?",
    placeholder: "Ex: Diariamente, algumas vezes por semana, raramente..."
  },
  {
    id: "pergunta5",
    text: "Como a ansiedade social tem impactado sua vida pessoal ou profissional?",
    placeholder: "Ex: Perdi oportunidades de emprego, evito fazer amizades..."
  },
  {
    id: "pergunta6",
    text: "Você já tentou superar essa dificuldade antes? O que aconteceu?",
    placeholder: "Ex: Tentei terapia, li livros de autoajuda, nunca tentei antes..."
  },
  {
    id: "pergunta7",
    text: "Qual é o seu principal objetivo ao começar essa jornada?",
    placeholder: "Ex: Fazer novos amigos, melhorar no trabalho, sentir-me mais confiante..."
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send answers directly as the backend expects OnboardingResponse model
      await axios.post("/onboarding", answers);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao enviar onboarding:", error);
      alert("Erro ao processar suas respostas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const isAnswered = answers[currentQuestion.id]?.trim().length > 0;
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="App">
      <BackgroundLines />
      
      <div style={{maxWidth: '800px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)', position: 'relative', zIndex: 10}}>
        
        <header style={{marginBottom: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
            <Sparkles style={{width: 'clamp(2rem, 6vw, 2.5rem)', height: 'clamp(2rem, 6vw, 2.5rem)', color: 'var(--azul-principal)'}} />
            <h1 style={{fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: 'var(--texto-titulo)'}}>
              Conheça Você
            </h1>
          </div>
          <p style={{fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'var(--texto-corpo)', lineHeight: 1.6}}>
            Vamos entender sua jornada para criar missões personalizadas
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="card-solido" style={{padding: 'clamp(1.25rem, 4vw, 1.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)'}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(0.25rem, 2vw, 0.5rem)', marginBottom: '1rem'}}>
            {questions.map((_, idx) => (
              <div key={idx} style={{display: 'flex', alignItems: 'center'}}>
                <div
                  style={{
                    width: 'clamp(2rem, 8vw, 2.5rem)',
                    height: 'clamp(2rem, 8vw, 2.5rem)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                    background: idx < currentStep ? '#059669' : idx === currentStep ? 'var(--azul-principal)' : '#E2E8F0',
                    color: idx <= currentStep ? 'white' : '#94A3B8',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {idx < currentStep ? <CheckCircle style={{width: 'clamp(1rem, 4vw, 1.25rem)', height: 'clamp(1rem, 4vw, 1.25rem)'}} /> : idx + 1}
                </div>
                {idx < questions.length - 1 && (
                  <div style={{width: 'clamp(0.75rem, 4vw, 1.5rem)', height: '2px', background: idx < currentStep ? '#059669' : '#E2E8F0', transition: 'all 0.3s ease'}} />
                )}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', fontWeight: 600, color: 'var(--texto-corpo)'}}>
            <span>Questão {currentStep + 1} de {questions.length}</span>
            <span style={{color: 'var(--azul-principal)'}}>{Math.round(progress)}%</span>
          </div>
          <div className="progresso-bg" style={{marginTop: '0.75rem'}}>
            <div className="progresso-fill" style={{width: `${progress}%`}} />
          </div>
        </div>

        {/* Question Card */}
        <div className="card-solido question-card" style={{padding: 'clamp(2rem, 5vw, 3rem)'}}>
          <div style={{marginBottom: 'clamp(1.5rem, 4vw, 2rem)'}}>
            <Label style={{fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 700, color: 'var(--texto-titulo)', fontFamily: 'Plus Jakarta Sans', marginBottom: '1rem', display: 'block', lineHeight: 1.4}}>
              {currentQuestion.text}
            </Label>
            <Textarea
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder={currentQuestion.placeholder}
              style={{
                minHeight: 'clamp(150px, 30vw, 180px)',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                borderRadius: '12px',
                padding: 'clamp(1rem, 3vw, 1.25rem)',
                lineHeight: 1.6,
                borderColor: isAnswered ? 'var(--azul-principal)' : '#E2E8F0'
              }}
            />
          </div>

          <div style={{display: 'flex', gap: '1rem', flexDirection: window.innerWidth < 480 ? 'column' : 'row'}}>
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                style={{
                  flex: 1,
                  height: 'clamp(2.75rem, 8vw, 3rem)',
                  borderRadius: '16px',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  fontWeight: 600,
                  borderColor: 'var(--azul-principal)',
                  color: 'var(--azul-principal)'
                }}
              >
                ← Anterior
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isAnswered || loading}
              style={{
                flex: 1,
                height: 'clamp(2.75rem, 8vw, 3rem)',
                borderRadius: '16px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                fontWeight: 600,
                background: isAnswered ? 'var(--azul-principal)' : '#E2E8F0',
                color: isAnswered ? 'white' : '#94A3B8',
                cursor: isAnswered ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? "Processando..." : currentStep === questions.length - 1 ? "Finalizar ✓" : "Próxima →"}
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <p style={{textAlign: 'center', fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', color: 'var(--texto-corpo)', marginTop: '1.5rem', lineHeight: 1.5}}>
          Suas respostas são privadas e usadas apenas para personalizar suas missões
        </p>
      </div>

      <style>{`
        .question-card {
          animation: slideIn 0.4s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
