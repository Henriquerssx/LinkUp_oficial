import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

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
  const [answers, setAnswers] = useState({
    pergunta1: "",
    pergunta2: "",
    pergunta3: "",
    pergunta4: "",
    pergunta5: "",
    pergunta6: "",
    pergunta7: ""
  });
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      setLoading(true);
      try {
        await axios.post("/onboarding", answers);
        navigate("/dashboard");
      } catch (err) {
        console.error("Erro ao salvar onboarding:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = answers[currentQuestion.id].trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="glass-card rounded-3xl p-10 shadow-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {questions.map((_, idx) => (
                <div key={idx} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      idx <= currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-400"
                    }`}
                    data-testid={`onboarding-step-${idx + 1}`}
                  >
                    {idx < currentStep ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                  </div>
                  {idx < questions.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        idx < currentStep ? "bg-blue-500" : "bg-blue-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Pergunta {currentStep + 1} de {questions.length}
            </p>
          </div>

          {/* Question */}
          <div className="mb-8 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Manrope' }}>
              {currentQuestion.text}
            </h2>
            <div>
              <Label htmlFor="answer" className="text-sm font-medium text-gray-700 mb-2 block">
                Sua resposta
              </Label>
              <Textarea
                id="answer"
                data-testid={`onboarding-${currentQuestion.id}-textarea`}
                value={answers[currentQuestion.id]}
                onChange={(e) =>
                  setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
                }
                placeholder={currentQuestion.placeholder}
                className="min-h-[160px] rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                data-testid="onboarding-back-button"
                className="flex-1 h-12 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed || loading}
              data-testid="onboarding-next-button"
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : isLastStep ? "Começar jornada" : "Próxima"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;