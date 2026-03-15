import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone, timedelta
import uuid

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

async def seed_missions():
    missions = [
        # Nível 1 - Ansiedade Social Leve (10 missões)
        {
            "id": str(uuid.uuid4()),
            "titulo": "Cumprimente alguém com sorriso",
            "descricao": "Hoje, cumprimente uma pessoa (pode ser porteiro, vizinho, colega) olhando nos olhos e sorrindo. Diga 'Bom dia' ou 'Boa tarde' e pergunte como ela está.",
            "nivel": 1,
            "categoria": "Interação Básica",
            "xp_recompensa": 20,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Agradeça com atenção",
            "descricao": "Quando alguém te ajudar ou prestar um serviço, agradeça olhando nos olhos e usando o nome da pessoa se souber. Adicione um 'Obrigado, [nome]!' ou 'Muito obrigado!'.",
            "nivel": 1,
            "categoria": "Interação Básica",
            "xp_recompensa": 20,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Faça um elogio sincero",
            "descricao": "Elogie algo genuíno em alguém que você conhece (roupa, trabalho bem feito, atitude positiva). Seja específico no elogio.",
            "nivel": 1,
            "categoria": "Conexão Positiva",
            "xp_recompensa": 25,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Peça uma informação simples",
            "descricao": "Pergunte algo simples a alguém: 'Que horas são?', 'Sabe onde fica...?', ou 'Você sabe se...?'. Pode ser na rua, no trabalho ou em uma loja.",
            "nivel": 1,
            "categoria": "Interação Básica",
            "xp_recompensa": 20,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Compartilhe uma observação",
            "descricao": "Faça um comentário casual sobre algo do ambiente para alguém próximo. Exemplo: 'Que dia bonito hoje!' ou 'Esse café está delicioso!'.",
            "nivel": 1,
            "categoria": "Interação Casual",
            "xp_recompensa": 25,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Tire uma dúvida em aula/reunião",
            "descricao": "Durante uma aula, palestra ou reunião, faça uma pergunta de esclarecimento. Pode ser algo simples como 'Pode repetir esse ponto?' ou 'Onde posso encontrar esse material?'.",
            "nivel": 1,
            "categoria": "Participação Acadêmica",
            "xp_recompensa": 30,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Aceite um convite social",
            "descricao": "Quando alguém te convidar para algo (café, almoço, evento), diga 'sim' ao invés de inventar uma desculpa. Mesmo que seja por pouco tempo.",
            "nivel": 1,
            "categoria": "Conexão Social",
            "xp_recompensa": 30,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Compartilhe algo que você aprendeu",
            "descricao": "Conte para alguém algo interessante que você aprendeu recentemente (pode ser de um vídeo, livro, podcast). Não precisa ser complexo.",
            "nivel": 1,
            "categoria": "Troca de Conhecimento",
            "xp_recompensa": 25,
            "dificuldade": "Leve"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Ofereça ajuda simples",
            "descricao": "Ofereça ajuda em algo pequeno (segurar a porta, ajudar com sacolas, explicar algo). Observe oportunidades naturais de ajudar.",
            "nivel": 1,
            "categoria": "Altruísmo",
            "xp_recompensa": 25,
            "dificuldade": "Leve"
        },
        
        # Nível 2 - Ansiedade Social Moderada (10 missões)
        {
            "id": str(uuid.uuid4()),
            "titulo": "Inicie uma conversa casual",
            "descricao": "Inicie uma conversa de 2-3 minutos com alguém sobre um tema leve (clima, final de semana, algo que está acontecendo). Pode ser um colega de trabalho, vizinho ou alguém na fila.",
            "nivel": 2,
            "categoria": "Conversa Casual",
            "xp_recompensa": 40,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Conte uma pequena história",
            "descricao": "Compartilhe algo que aconteceu com você recentemente (pode ser engraçado, interessante ou apenas cotidiano). Não precisa ser longo, 1-2 minutos.",
            "nivel": 2,
            "categoria": "Abertura Pessoal",
            "xp_recompensa": 45,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Peça uma recomendação",
            "descricao": "Peça a alguém uma recomendação sobre algo (filme, série, restaurante, livro). Mostre interesse genuíno na resposta da pessoa.",
            "nivel": 2,
            "categoria": "Conexão",
            "xp_recompensa": 40,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Participe de uma conversa em grupo",
            "descricao": "Quando houver uma conversa com 3+ pessoas, contribua com pelo menos um comentário ou opinião. Não precisa dominar a conversa, apenas participar.",
            "nivel": 2,
            "categoria": "Interação Grupal",
            "xp_recompensa": 50,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Faça uma ligação não urgente",
            "descricao": "Ligue para alguém (amigo, familiar, serviço) para algo que não seja urgente. Pode ser para marcar algo, pedir informação ou apenas conversar.",
            "nivel": 2,
            "categoria": "Comunicação",
            "xp_recompensa": 45,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Apresente-se para alguém novo",
            "descricao": "Apresente-se para alguém que você ainda não conhece (novo colega, vizinho, pessoa em evento). Inclua seu nome e um fato sobre você.",
            "nivel": 2,
            "categoria": "Networking",
            "xp_recompensa": 50,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Compartilhe sua opinião em discussão",
            "descricao": "Em uma discussão ou debate, expresse sua opinião mesmo que seja diferente dos outros. Não precisa argumentar, apenas dizer o que pensa.",
            "nivel": 2,
            "categoria": "Expressão Pessoal",
            "xp_recompensa": 50,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Convide alguém para algo",
            "descricao": "Tome a iniciativa de convidar alguém para fazer algo (café, almoço, estudar junto, assistir algo). Aceite se a pessoa disser 'não'.",
            "nivel": 2,
            "categoria": "Iniciativa Social",
            "xp_recompensa": 55,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Peça feedback sobre algo seu",
            "descricao": "Peça opinião ou feedback de alguém sobre algo que você fez (trabalho, ideia, escolha). Mostre que você valoriza a perspectiva da pessoa.",
            "nivel": 2,
            "categoria": "Vulnerabilidade",
            "xp_recompensa": 45,
            "dificuldade": "Moderada"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Participe ativamente de reunião online",
            "descricao": "Em uma reunião virtual, contribua com pelo menos 2 comentários ou perguntas. Mantenha a câmera ligada se possível.",
            "nivel": 2,
            "categoria": "Participação Virtual",
            "xp_recompensa": 50,
            "dificuldade": "Moderada"
        },
        
        # Nível 3 - Ansiedade Social Severa (10 missões)
        {
            "id": str(uuid.uuid4()),
            "titulo": "Fazer contato visual e acenar",
            "descricao": "Ao sair de casa ou no seu dia, quando cruzar com alguém conhecido, faça contato visual e acene com a cabeça ou mão. Não precisa falar, apenas reconhecer a presença da pessoa.",
            "nivel": 3,
            "categoria": "Presença Social",
            "xp_recompensa": 15,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Sorria para alguém",
            "descricao": "Durante o dia, sorria para pelo menos uma pessoa que você encontrar (pode ser no elevador, na rua, no mercado). Não precisa falar nada.",
            "nivel": 3,
            "categoria": "Presença Social",
            "xp_recompensa": 15,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Diga 'com licença' ou 'desculpe'",
            "descricao": "Quando precisar passar por alguém ou pedir algo simples, diga 'com licença' ou 'desculpe'. Pratique usar essas palavras de forma natural.",
            "nivel": 3,
            "categoria": "Interação Mínima",
            "xp_recompensa": 15,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Responda a uma saudação",
            "descricao": "Quando alguém te cumprimentar, responda de volta. Pode ser apenas 'Bom dia' ou 'Oi'. O objetivo é não evitar a interação.",
            "nivel": 3,
            "categoria": "Resposta Social",
            "xp_recompensa": 20,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Fique em um ambiente social por 5 minutos",
            "descricao": "Vá a um local com pessoas (café, praça, biblioteca) e fique lá por pelo menos 5 minutos. Você não precisa interagir, apenas estar presente sem evitar o espaço.",
            "nivel": 3,
            "categoria": "Exposição Gradual",
            "xp_recompensa": 25,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Entre em uma loja e olhe produtos",
            "descricao": "Entre em uma loja, caminhe pelos corredores e olhe produtos por pelo menos 3 minutos. Não precisa comprar nada, apenas praticar estar no espaço.",
            "nivel": 3,
            "categoria": "Exposição Gradual",
            "xp_recompensa": 20,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Sente-se perto de outras pessoas",
            "descricao": "Em vez de escolher o lugar mais isolado, sente-se próximo a outras pessoas (ônibus, biblioteca, praça). Não precisa interagir.",
            "nivel": 3,
            "categoria": "Proximidade Social",
            "xp_recompensa": 20,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Compre algo pequeno e agradeça",
            "descricao": "Compre algo simples (água, lanche, etc) e diga 'obrigado' ao atendente ao receber. Pode ser breve.",
            "nivel": 3,
            "categoria": "Transação Básica",
            "xp_recompensa": 20,
            "dificuldade": "Inicial"
        },
        {
            "id": str(uuid.uuid4()),
            "titulo": "Atenda o telefone",
            "descricao": "Quando alguém ligar, atenda (mesmo que seja número desconhecido). Responda normalmente, mesmo que seja breve.",
            "nivel": 3,
            "categoria": "Comunicação Reativa",
            "xp_recompensa": 25,
            "dificuldade": "Inicial"
        }
    ]
    
    await db.missions.delete_many({})
    await db.missions.insert_many(missions)
    print(f"✅ {len(missions)} missões criadas (30 missões totais: 10 por nível)")

async def seed_community():
    now = datetime.now(timezone.utc)
    posts = [
        # Anchor - Membro experiente
        {
            "id": str(uuid.uuid4()),
            "tipo": "anchor",
            "user_nome": "Roberto Anchor",
            "mission_titulo": "Liderar workshop de 20 pessoas",
            "conquista": "Olá pessoal! Sou Anchor e estou aqui para ajudar. Há 2 anos eu também comecei no LinkUp com ansiedade severa. Hoje lidero workshops! Lembrem-se: cada pequeno passo conta. Celebrem cada vitória, por menor que pareça. Estou aqui se precisarem de apoio! 💪",
            "data": (now - timedelta(hours=1)).isoformat(),
            "likes": 45
        },
        # Mission Pod Posts
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Ana Silva",
            "mission_titulo": "Cumprimente o porteiro",
            "conquista": "Consegui! Estava com medo dele me achar esquisito, mas ele sorriu e conversou comigo por 5 minutos!",
            "data": (now - timedelta(hours=2)).isoformat(),
            "likes": 12
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Carlos Mendes",
            "mission_titulo": "Faça um elogio sincero",
            "conquista": "Elogiei o trabalho de uma colega. Ela ficou super feliz e me agradeceu muito! Pensei que ia ser estranho, mas foi leve.",
            "data": (now - timedelta(hours=5)).isoformat(),
            "likes": 8
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Beatriz Costa",
            "mission_titulo": "Inicie uma conversa casual",
            "conquista": "Puxei assunto sobre séries com um colega. Descobrimos que gostamos das mesmas coisas! Achei que ele não ia querer papo.",
            "data": (now - timedelta(hours=8)).isoformat(),
            "likes": 15
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Felipe Rocha",
            "mission_titulo": "Converse com estranho na fila",
            "conquista": "Comentei sobre o tempo com alguém na fila do mercado. A pessoa foi super receptiva e acabamos conversando até o caixa!",
            "data": (now - timedelta(hours=12)).isoformat(),
            "likes": 20
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Marina Santos",
            "mission_titulo": "Agradeça com sorriso",
            "conquista": "Agradeci a atendente olhando nos olhos. Ela retribuiu o sorriso e isso iluminou meu dia!",
            "data": (now - timedelta(hours=18)).isoformat(),
            "likes": 10
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Pedro Lima",
            "mission_titulo": "Compartilhe uma história pessoal",
            "conquista": "Contei sobre minha viagem recente. As pessoas se interessaram de verdade! Pensei que ninguém ia se importar.",
            "data": (now - timedelta(days=1)).isoformat(),
            "likes": 18
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Julia Ferreira",
            "mission_titulo": "Peça uma recomendação",
            "conquista": "Pedi dica de restaurante para o vizinho. Ele me deu 3 sugestões incríveis e ofereceu ir junto!",
            "data": (now - timedelta(days=1, hours=6)).isoformat(),
            "likes": 14
        },
        # Cluster Posts Adicionais
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Lucas Oliveira",
            "mission_titulo": "Participar de evento social",
            "conquista": "Fui a um meetup de tecnologia! Conversei com 5 pessoas diferentes. Minha ansiedade começou em 8/10 e terminou em 3/10.",
            "data": (now - timedelta(days=1, hours=12)).isoformat(),
            "likes": 25
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Camila Torres",
            "mission_titulo": "Fazer uma ligação",
            "conquista": "Liguei para marcar consulta no dentista sem procrastinar! Pequena vitória mas me sinto orgulhosa.",
            "data": (now - timedelta(days=2)).isoformat(),
            "likes": 11
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Rafael Souza",
            "mission_titulo": "Fazer contato visual",
            "conquista": "Hoje acenei para 3 vizinhos diferentes. Pode parecer pouco, mas para mim foi enorme!",
            "data": (now - timedelta(days=2, hours=8)).isoformat(),
            "likes": 16
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Isabela Martins",
            "mission_titulo": "Contribuir em grupo",
            "conquista": "Na reunião de equipe, dei minha opinião sobre o projeto. Achei que ia travar, mas consegui falar claramente!",
            "data": (now - timedelta(days=3)).isoformat(),
            "likes": 22
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Diego Alves",
            "mission_titulo": "Sorrir para alguém",
            "conquista": "Sorri para a pessoa no elevador. Ela sorriu de volta e disse bom dia. Conexão humana é real! ❤️",
            "data": (now - timedelta(days=3, hours=10)).isoformat(),
            "likes": 9
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Amanda Ribeiro",
            "mission_titulo": "Peça ajuda",
            "conquista": "Pedi ajuda a um colega com uma planilha. Ele ficou feliz em ajudar e ainda me ensinou umas dicas extras!",
            "data": (now - timedelta(days=4)).isoformat(),
            "likes": 13
        },
        {
            "id": str(uuid.uuid4()),
            "user_nome": "Thiago Pinto",
            "mission_titulo": "Ficar em ambiente social",
            "conquista": "Fiquei 15 minutos no café sem pressa de ir embora. Apenas observando e respirando. Me senti presente!",
            "data": (now - timedelta(days=4, hours=15)).isoformat(),
            "likes": 17
        }
    ]
    
    await db.community.delete_many({})
    await db.community.insert_many(posts)
    print(f"✅ {len(posts)} posts da comunidade criados (1 Anchor + 14 posts)")

async def seed_sample_evidence():
    # Create a sample evidence for demonstration
    now = datetime.now(timezone.utc)
    evidences = [
        {
            "id": str(uuid.uuid4()),
            "user_id": "demo-user",
            "mission_id": str(uuid.uuid4()),
            "mission_titulo": "Cumprimente o porteiro",
            "crenca_antes": "Ele vai me achar estranho por falar com ele",
            "previsao": "Ele vai me ignorar ou responder de forma fria",
            "resultado_real": "Ele sorriu, respondeu animado e perguntou como estava minha família",
            "delta_positivo": "Você esperava: 'Ele vai me ignorar ou responder de forma fria'. Mas aconteceu: 'Ele sorriu, respondeu animado e perguntou como estava minha família'.",
            "nivel_ansiedade_antes": 7,
            "nivel_ansiedade_depois": 2,
            "aprendizado": "As pessoas geralmente são mais receptivas do que eu imagino",
            "data": (now - timedelta(days=2)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": "demo-user",
            "mission_id": str(uuid.uuid4()),
            "mission_titulo": "Faça um elogio sincero",
            "crenca_antes": "Vão achar que estou puxando saco ou sendo falso",
            "previsao": "A pessoa vai ficar desconfortável e achar estranho",
            "resultado_real": "A pessoa ficou visivelmente feliz, agradeceu e começou a conversar mais comigo",
            "delta_positivo": "Você esperava: 'A pessoa vai ficar desconfortável e achar estranho'. Mas aconteceu: 'A pessoa ficou visivelmente feliz, agradeceu e começou a conversar mais comigo'.",
            "nivel_ansiedade_antes": 8,
            "nivel_ansiedade_depois": 3,
            "aprendizado": "Elogios sinceros criam conexão, não desconforto",
            "data": (now - timedelta(days=3)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": "demo-user",
            "mission_id": str(uuid.uuid4()),
            "mission_titulo": "Inicie conversa com colega",
            "crenca_antes": "Não tenho nada interessante para falar",
            "previsao": "A conversa vai morrer rapidamente e vai ficar um silêncio estranho",
            "resultado_real": "Conversamos por 15 minutos sobre interesses em comum que eu nem sabia que existiam",
            "delta_positivo": "Você esperava: 'A conversa vai morrer rapidamente e vai ficar um silêncio estranho'. Mas aconteceu: 'Conversamos por 15 minutos sobre interesses em comum que eu nem sabia que existiam'.",
            "nivel_ansiedade_antes": 6,
            "nivel_ansiedade_depois": 1,
            "aprendizado": "Conversas fluem naturalmente quando sou genuíno",
            "data": (now - timedelta(days=5)).isoformat()
        }
    ]
    
    await db.evidences.delete_many({"user_id": "demo-user"})
    await db.evidences.insert_many(evidences)
    print(f"✅ {len(evidences)} evidências de exemplo criadas")

async def seed_university_events():
    """Eventos públicos de universidades para universitários"""
    now = datetime.now(timezone.utc)
    events = [
        # USP
        {
            "id": str(uuid.uuid4()),
            "universidade": "USP",
            "titulo": "Workshop: Como Lidar com a Ansiedade Acadêmica",
            "descricao": "Aprenda técnicas práticas para gerenciar a pressão de provas e apresentações.",
            "data_evento": (now + timedelta(days=5)).isoformat(),
            "local": "Instituto de Psicologia - USP",
            "categoria": "Saúde Mental",
            "link_inscricao": "https://usp.br/eventos/ansiedade"
        },
        
        # Inteli
        {
            "id": str(uuid.uuid4()),
            "universidade": "Inteli",
            "titulo": "Hackathon: Superando Desafios em Equipe",
            "descricao": "Desenvolva um projeto em 24h e pratique soft skills essenciais.",
            "data_evento": (now + timedelta(days=7)).isoformat(),
            "local": "Campus Inteli - São Paulo",
            "categoria": "Trabalho em Equipe",
            "link_inscricao": "https://inteli.edu.br/hackathon"
        },
        
        # FGV
        {
            "id": str(uuid.uuid4()),
            "universidade": "FGV",
            "titulo": "Curso Rápido: Gestão do Tempo e Produtividade",
            "descricao": "Aprenda a equilibrar estudos, trabalho e vida pessoal.",
            "data_evento": (now + timedelta(days=6)).isoformat(),
            "local": "FGV - Campus Botafogo",
            "categoria": "Produtividade",
            "link_inscricao": "https://fgv.br/eventos/tempo"
        }
    ]
    
    await db.university_events.delete_many({})
    await db.university_events.insert_many(events)
    print(f"✅ {len(events)} eventos universitários criados (USP, Inteli, FGV, Insper)")

async def main():
    print("🌱 Iniciando seed do banco de dados...")
    await seed_missions()
    await seed_community()
    await seed_sample_evidence()
    await seed_university_events()
    print("✅ Seed completo!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())