from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====

class UserRegister(BaseModel):
    nome: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    nome: str
    email: str
    nivel_atual: int = 1
    xp_atual: int = 0
    xp_proximo_nivel: int = 100
    streak: int = 0
    ultimo_acesso: str
    badges: List[str] = []
    criado_em: str

class OnboardingResponse(BaseModel):
    pergunta1: str
    pergunta2: str
    pergunta3: str
    pergunta4: str
    pergunta5: str
    pergunta6: str
    pergunta7: str

class Mission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    titulo: str
    descricao: str
    nivel: int
    categoria: str
    xp_recompensa: int
    dificuldade: str

class MissionPhase1(BaseModel):
    crenca_limitante: str
    previsao_catastrofica: str
    nivel_ansiedade: int

class MissionPhase3(BaseModel):
    o_que_aconteceu: str
    resultado_real: str
    nivel_ansiedade_pos: int
    aprendizado: str

class MissionCompletion(BaseModel):
    mission_id: str
    fase1: dict
    fase3: dict

class Evidence(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    mission_titulo: str
    crenca_antes: str
    previsao: str
    resultado_real: str
    delta_positivo: str
    nivel_ansiedade_antes: int
    nivel_ansiedade_depois: int
    data: str
    aprendizado: str

class CommunityPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_nome: str
    mission_titulo: str
    conquista: str
    data: str
    likes: int = 0

class ProgressResponse(BaseModel):
    nivel_atual: int
    xp_atual: int
    xp_proximo_nivel: int
    porcentagem_nivel: float
    streak: int
    badges: List[dict]
    total_missoes: int
    total_evidencias: int

# ===== HELPER FUNCTIONS =====

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ===== ROUTES =====

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(user_data.password)
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "nome": user_data.nome,
        "email": user_data.email,
        "password": hashed_pwd,
        "nivel_atual": 1,
        "xp_atual": 0,
        "xp_proximo_nivel": 100,
        "streak": 0,
        "ultimo_acesso": now,
        "badges": [],
        "criado_em": now
    }
    
    await db.users.insert_one(user_doc)
    
    # Generate token
    access_token = create_access_token({"sub": user_id})
    
    user_response = {k: v for k, v in user_doc.items() if k not in ["password", "_id"]}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    # Update last access
    now = datetime.now(timezone.utc).isoformat()
    await db.users.update_one({"id": user["id"]}, {"$set": {"ultimo_acesso": now}})
    
    # Generate token
    access_token = create_access_token({"sub": user["id"]})
    
    user_response = {k: v for k, v in user.items() if k != "password"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.get("/user/profile", response_model=User)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {k: v for k, v in current_user.items() if k != "password"}

@api_router.get("/user/analises")
async def get_analises_historico(current_user: dict = Depends(get_current_user)):
    """Retorna histórico de análises de IA do usuário"""
    analises = await db.analises_ia.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("data", -1).to_list(50)
    return analises

@api_router.get("/insights")
async def get_insights(current_user: dict = Depends(get_current_user)):
    """Gera insights de IA sobre padrões de comportamento do usuário"""
    try:
        # Buscar evidências do usuário
        evidences = await db.evidences.find(
            {"user_id": current_user["id"]},
            {"_id": 0}
        ).sort("data", -1).to_list(20)
        
        if len(evidences) < 2:
            return {
                "tem_insights": False,
                "mensagem": "Complete mais missões para receber insights personalizados"
            }
        
        # Calcular estatísticas
        total_missoes = len(evidences)
        reducao_media = sum([e["nivel_ansiedade_antes"] - e["nivel_ansiedade_depois"] for e in evidences]) / total_missoes
        
        # Preparar resumo compacto
        ultimas_3 = evidences[:3]
        resumo = []
        for ev in ultimas_3:
            resumo.append({
                "missao": ev["mission_titulo"],
                "reducao_ansiedade": ev["nivel_ansiedade_antes"] - ev["nivel_ansiedade_depois"]
            })
        
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"insights-{current_user['id']}",
            system_message="""Analista TCC. JSON conciso:
{
  "padroes_identificados": ["padrão 1 (5-8 palavras)", "padrão 2", "padrão 3"],
  "progresso_geral": "1 frase direta sobre evolução (máx 15 palavras)",
  "proximos_passos": ["ação 1 (5-8 palavras)", "ação 2"],
  "mensagem_motivacional": "1 frase impactante (máx 12 palavras)"
}

Total: máximo 80 palavras."""
        ).with_model("gemini", "gemini-3-flash-preview")
        
        import json
        prompt = f"""Últimas 3 missões:
{json.dumps(resumo, ensure_ascii=False)}

Total: {total_missoes} missões
Redução média ansiedade: {reducao_media:.1f} pontos
Nível: {current_user.get('nivel_atual', 1)}

JSON com insights:"""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON
        clean_response = response.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        if clean_response.startswith("```"):
            clean_response = clean_response[3:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        clean_response = clean_response.strip()
        
        insights = json.loads(clean_response)
        insights["tem_insights"] = True
        
        # Salvar insights no histórico
        analise_doc = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "tipo": "insights",
            "analise": insights,
            "data": datetime.now(timezone.utc).isoformat()
        }
        await db.analises_ia.insert_one(analise_doc)
        
        return insights
        
    except Exception as e:
        logger.error(f"Erro ao gerar insights: {e}")
        return {
            "tem_insights": False,
            "mensagem": "Erro ao gerar insights. Tente novamente mais tarde."
        }

@api_router.get("/missions/recommended")
async def get_recommended_mission(current_user: dict = Depends(get_current_user)):
    """Recomenda próxima missão baseada no progresso e padrões do usuário"""
    try:
        # Buscar missões completadas
        completed_missions = await db.evidences.find(
            {"user_id": current_user["id"]},
            {"_id": 0, "mission_id": 1, "nivel_ansiedade_depois": 1, "aprendizado": 1}
        ).to_list(100)
        
        completed_ids = [m["mission_id"] for m in completed_missions]
        
        # Determinar nível baseado no progresso
        nivel_atual = current_user.get("nivel_recomendado", current_user.get("nivel_atual", 1))
        
        # Se completou a missão do nível atual com ansiedade baixa, pode subir
        if completed_missions:
            ultima_ansiedade = completed_missions[0].get("nivel_ansiedade_depois", 10)
            if ultima_ansiedade <= 3 and nivel_atual < 3:
                nivel_atual = min(nivel_atual + 1, 3)
        
        # Buscar missões não completadas do nível
        available_missions = await db.missions.find(
            {"nivel": nivel_atual, "id": {"$nin": completed_ids}},
            {"_id": 0}
        ).to_list(10)
        
        if not available_missions:
            # Buscar do próximo nível se não houver mais no atual
            available_missions = await db.missions.find(
                {"nivel": min(nivel_atual + 1, 3), "id": {"$nin": completed_ids}},
                {"_id": 0}
            ).to_list(10)
        
        if not available_missions:
            # Retornar qualquer missão não completada
            available_missions = await db.missions.find(
                {"id": {"$nin": completed_ids}},
                {"_id": 0}
            ).to_list(10)
        
        if not available_missions:
            raise HTTPException(status_code=404, detail="Nenhuma missão disponível")
        
        # Usar IA para recomendar a melhor missão
        if len(available_missions) > 1 and completed_missions:
            chat = LlmChat(
                api_key=os.environ.get('EMERGENT_LLM_KEY'),
                session_id=f"recommend-{uuid.uuid4()}",
                system_message="""Você é um terapeuta TCC escolhendo a próxima missão ideal para o paciente.
Baseado no histórico, recomende qual missão seria mais benéfica agora.
Responda APENAS com o número do índice da missão (0, 1, 2, etc)."""
            ).with_model("gemini", "gemini-3-flash-preview")
            
            missions_text = "\n".join([
                f"{i}. {m['titulo']} - {m['descricao']}"
                for i, m in enumerate(available_missions)
            ])
            
            last_learnings = "\n".join([
                f"- {m['aprendizado']}"
                for m in completed_missions[:3]
            ])
            
            prompt = f"""Missões disponíveis:
{missions_text}

Últimos aprendizados do paciente:
{last_learnings}

Qual missão recomenda? Responda apenas com o número."""
            
            try:
                user_message = UserMessage(text=prompt)
                response = await chat.send_message(user_message)
                idx = int(response.strip().split()[0])
                if 0 <= idx < len(available_missions):
                    return available_missions[idx]
            except:
                pass
        
        return available_missions[0]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao recomendar missão: {e}")
        # Fallback para missão diária normal
        return await get_daily_mission(current_user)

@api_router.post("/onboarding")
async def save_onboarding(data: OnboardingResponse, current_user: dict = Depends(get_current_user)):
    onboarding_doc = {
        "user_id": current_user["id"],
        "respostas": data.model_dump(),
        "criado_em": datetime.now(timezone.utc).isoformat()
    }
    await db.onboarding.insert_one(onboarding_doc)
    
    # Analisar perfil com IA e recomendar nível
    try:
        analise = await analisar_perfil_com_ia(data)
        
        # Salvar análise no histórico
        analise_historico = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "tipo": "onboarding",
            "analise": analise,
            "data": datetime.now(timezone.utc).isoformat()
        }
        await db.analises_ia.insert_one(analise_historico)
        
        # Atualizar usuário com nível recomendado
        await db.users.update_one(
            {"id": current_user["id"]},
            {"$set": {
                "nivel_recomendado": analise["nivel"],
                "analise_inicial": analise
            }}
        )
        
        return {
            "message": "Onboarding salvo com sucesso",
            "analise": analise
        }
    except Exception as e:
        logger.error(f"Erro ao analisar perfil: {e}")
        return {
            "message": "Onboarding salvo com sucesso",
            "analise": {
                "nivel": 2,
                "justificativa": "Erro na análise - iniciando em nível moderado",
                "pontos_principais": []
            }
        }

async def analisar_perfil_com_ia(data: OnboardingResponse) -> dict:
    """Analisa as respostas do questionário e recomenda um nível inicial com justificativa"""
    try:
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"onboarding-{uuid.uuid4()}",
            system_message="""Psicólogo TCC. Análise objetiva.

NÍVEIS:
3: Evitação diária, impacto grave
2: Evitação 3-4x/sem, impacto moderado  
1: Evitação ocasional, impacto leve

JSON (máx 60 palavras):
{
  "nivel": 1/2/3,
  "justificativa": "2 frases diretas (máx 20 palavras)",
  "pontos_principais": ["ponto 1 (5-6 palavras)", "ponto 2", "ponto 3"]
}"""
        ).with_model("gemini", "gemini-3-flash-preview")
        
        prompt = f"""Respostas:
1. Dificuldade: {data.pergunta1}
2. Medo: {data.pergunta2}
3. Evita: {data.pergunta3}
4. Frequência: {data.pergunta4}
5. Impacto: {data.pergunta5}
6. Tentativas: {data.pergunta6}
7. Objetivo: {data.pergunta7}

JSON:"""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        import json
        clean_response = response.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        if clean_response.startswith("```"):
            clean_response = clean_response[3:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        clean_response = clean_response.strip()
        
        analise = json.loads(clean_response)
        
        # Validar nível
        if analise["nivel"] not in [1, 2, 3]:
            analise["nivel"] = 2
            
        return analise
    except Exception as e:
        logger.error(f"Erro na análise de IA: {e}")
        return {
            "nivel": 2,
            "justificativa": "Análise manual recomendada - iniciando em nível moderado",
            "pontos_principais": ["Erro na análise automática"]
        }

@api_router.post("/evidence/feedback")
async def get_evidence_feedback(evidence_id: str, current_user: dict = Depends(get_current_user)):
    """Gera feedback de IA sobre uma evidência específica"""
    try:
        evidence = await db.evidences.find_one(
            {"id": evidence_id, "user_id": current_user["id"]},
            {"_id": 0}
        )
        
        if not evidence:
            raise HTTPException(status_code=404, detail="Evidência não encontrada")
        
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"evidence-{evidence_id}",
            system_message="""Coach TCC. Feedback em 3 partes curtas:
1. Reconheça coragem (1 linha)
2. Delta positivo específico (1 linha)
3. Ação prática (1 linha)

Total: máximo 50 palavras. Direto e motivador."""
        ).with_model("gemini", "gemini-3-flash-preview")
        
        reducao_ansiedade = evidence['nivel_ansiedade_antes'] - evidence['nivel_ansiedade_depois']
        
        prompt = f"""Missão: {evidence['mission_titulo']}

Antes: "{evidence['previsao']}" (Ansiedade: {evidence['nivel_ansiedade_antes']}/10)
Depois: "{evidence['resultado_real']}" (Ansiedade: {evidence['nivel_ansiedade_depois']}/10)
Redução: {reducao_ansiedade} pontos

Aprendizado: {evidence['aprendizado']}

Feedback em 50 palavras:"""
        
        user_message = UserMessage(text=prompt)
        feedback = await chat.send_message(user_message)
        
        # Salvar feedback no banco
        await db.evidences.update_one(
            {"id": evidence_id},
            {"$set": {"feedback_ia": feedback.strip()}}
        )
        
        return {"feedback": feedback.strip()}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao gerar feedback: {e}")
        raise HTTPException(status_code=500, detail="Erro ao gerar feedback")

@api_router.get("/missions", response_model=List[Mission])
async def get_missions(nivel: Optional[int] = None, current_user: dict = Depends(get_current_user)):
    query = {}
    if nivel:
        query["nivel"] = nivel
    missions = await db.missions.find(query, {"_id": 0}).to_list(100)
    return missions

@api_router.get("/missions/daily", response_model=Mission)
async def get_daily_mission(current_user: dict = Depends(get_current_user)):
    # Usar nível recomendado pela IA ou nível atual do usuário
    nivel_recomendado = current_user.get("nivel_recomendado", current_user.get("nivel_atual", 1))
    
    # Find a mission for recommended level
    missions = await db.missions.find({"nivel": nivel_recomendado}, {"_id": 0}).to_list(10)
    if not missions:
        raise HTTPException(status_code=404, detail="Nenhuma missão disponível")
    
    # Return first mission (in production, would be more sophisticated)
    return missions[0]

@api_router.post("/missions/complete")
async def complete_mission(completion: MissionCompletion, current_user: dict = Depends(get_current_user)):
    # Get mission
    mission = await db.missions.find_one({"id": completion.mission_id}, {"_id": 0})
    if not mission:
        raise HTTPException(status_code=404, detail="Missão não encontrada")
    
    # Create evidence entry
    evidence_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Calculate delta positivo
    delta_positivo = f"Você esperava: '{completion.fase1['previsao_catastrofica']}'. Mas aconteceu: '{completion.fase3['resultado_real']}'."
    
    evidence_doc = {
        "id": evidence_id,
        "user_id": current_user["id"],
        "mission_id": completion.mission_id,
        "mission_titulo": mission["titulo"],
        "crenca_antes": completion.fase1["crenca_limitante"],
        "previsao": completion.fase1["previsao_catastrofica"],
        "resultado_real": completion.fase3["resultado_real"],
        "delta_positivo": delta_positivo,
        "nivel_ansiedade_antes": completion.fase1["nivel_ansiedade"],
        "nivel_ansiedade_depois": completion.fase3["nivel_ansiedade_pos"],
        "aprendizado": completion.fase3["aprendizado"],
        "data": now
    }
    
    await db.evidences.insert_one(evidence_doc)
    
    # Update user XP and level
    novo_xp = current_user["xp_atual"] + mission["xp_recompensa"]
    nivel_atual = current_user["nivel_atual"]
    xp_proximo = current_user["xp_proximo_nivel"]
    
    if novo_xp >= xp_proximo:
        nivel_atual += 1
        novo_xp = novo_xp - xp_proximo
        xp_proximo = nivel_atual * 100
        
        # Add badge for level up
        badges = current_user.get("badges", [])
        badges.append(f"nivel_{nivel_atual}")
        await db.users.update_one(
            {"id": current_user["id"]},
            {"$set": {
                "nivel_atual": nivel_atual,
                "xp_atual": novo_xp,
                "xp_proximo_nivel": xp_proximo,
                "badges": badges
            }}
        )
    else:
        await db.users.update_one(
            {"id": current_user["id"]},
            {"$set": {"xp_atual": novo_xp}}
        )
    
    # Update streak
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"streak": 1}}
    )
    
    return {
        "message": "Missão completada com sucesso!",
        "xp_ganho": mission["xp_recompensa"],
        "nivel_subiu": novo_xp >= xp_proximo,
        "evidence_id": evidence_id
    }

@api_router.get("/evidence", response_model=List[Evidence])
async def get_evidence(current_user: dict = Depends(get_current_user)):
    evidences = await db.evidences.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("data", -1).to_list(100)
    return evidences

@api_router.get("/progress", response_model=ProgressResponse)
async def get_progress(current_user: dict = Depends(get_current_user)):
    # Get total missions completed
    total_evidencias = await db.evidences.count_documents({"user_id": current_user["id"]})
    
    # Calculate progress percentage
    porcentagem = (current_user["xp_atual"] / current_user["xp_proximo_nivel"]) * 100
    
    # Format badges
    badges_formatted = []
    for badge in current_user.get("badges", []):
        if badge.startswith("nivel_"):
            nivel = badge.split("_")[1]
            badges_formatted.append({
                "id": badge,
                "nome": f"Nível {nivel}",
                "icone": "star"
            })
    
    return {
        "nivel_atual": current_user["nivel_atual"],
        "xp_atual": current_user["xp_atual"],
        "xp_proximo_nivel": current_user["xp_proximo_nivel"],
        "porcentagem_nivel": round(porcentagem, 2),
        "streak": current_user["streak"],
        "badges": badges_formatted,
        "total_missoes": total_evidencias,
        "total_evidencias": total_evidencias
    }

@api_router.get("/community", response_model=List[CommunityPost])
async def get_community_posts():
    posts = await db.community.find({}, {"_id": 0}).sort("data", -1).to_list(50)
    return posts

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()