import React from "react";

const BackgroundLines = () => {
  return (
    <svg 
      className="bg-linhas" 
      viewBox="0 0 1440 900" 
      preserveAspectRatio="xMidYMid slice" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="linha-fundo" d="M-100,600 C300,450 600,850 1000,550 C1250,350 1400,600 1600,500" />
      <path 
        className="linha-fundo" 
        style={{animationDelay: '-4s'}} 
        d="M-50,800 C350,600 550,900 900,600 C1200,400 1400,750 1550,550" 
      />
      
      <path className="linha-media" d="M-100,500 C400,700 700,300 1100,650 C1300,800 1450,550 1600,600" />
      <path 
        className="linha-media" 
        style={{animationDelay: '-8s'}} 
        d="M-200,300 C200,500 600,200 1000,450 C1300,600 1500,300 1700,400" 
      />
      <path 
        className="linha-media" 
        style={{animationDelay: '-2s'}} 
        d="M-50,700 C450,500 650,800 1050,500 C1350,300 1500,650 1650,450" 
      />
      
      <path className="linha-frente" d="M-50,300 C350,200 550,500 900,400 C1200,300 1400,450 1550,350" />
      <path 
        className="linha-frente" 
        style={{animationDelay: '-6s'}} 
        d="M-100,100 C300,300 500,100 800,300 C1100,500 1300,200 1600,300" 
      />
    </svg>
  );
};

export default BackgroundLines;
