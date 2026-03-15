"""
LinkUp Backend API Tests
Tests for: Auth, Events, Missions, Community, Progress, Profile
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test User Credentials
TEST_EMAIL = f"test_{uuid.uuid4().hex[:8]}@test.com"
TEST_PASSWORD = "TestPass123!"
TEST_NAME = "Test User LinkUp"


class TestHealthAndBasicEndpoints:
    """Basic endpoint availability tests"""
    
    def test_api_is_reachable(self):
        """Test if API is reachable"""
        response = requests.get(f"{BASE_URL}/api/community")
        assert response.status_code == 200
        print("API is reachable")
    
    def test_community_endpoint(self):
        """Test community endpoint returns posts"""
        response = requests.get(f"{BASE_URL}/api/community")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Verify post structure
        post = data[0]
        assert "user_nome" in post
        assert "mission_titulo" in post
        assert "conquista" in post
        print(f"Community endpoint returned {len(data)} posts")
    
    def test_university_events_endpoint(self):
        """Test university events returns exactly 3 events"""
        response = requests.get(f"{BASE_URL}/api/events/university")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # CRITICAL: Must have exactly 3 university events (USP, Inteli, FGV)
        assert len(data) == 3, f"Expected 3 university events, got {len(data)}"
        
        # Verify structure
        universities = [e["universidade"] for e in data]
        assert "USP" in universities, "USP event missing"
        assert "Inteli" in universities, "Inteli event missing"
        assert "FGV" in universities, "FGV event missing"
        print(f"University events: {universities}")


class TestAuthFlow:
    """Authentication tests: Register and Login"""
    
    @pytest.fixture(scope="class")
    def registered_user(self):
        """Register a test user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "nome": TEST_NAME,
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
        )
        if response.status_code == 400 and "já cadastrado" in response.text:
            # User exists, try login
            login_response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
            )
            return login_response.json()
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        print(f"User registered: {data['user']['email']}")
        return data
    
    def test_register_user(self, registered_user):
        """Test user registration"""
        assert "access_token" in registered_user
        assert registered_user["token_type"] == "bearer"
        print("Registration test passed")
    
    def test_login_with_valid_credentials(self, registered_user):
        """Test login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == TEST_EMAIL
        print("Login test passed")
    
    def test_login_with_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "invalid@test.com", "password": "wrongpass"}
        )
        assert response.status_code == 401
        print("Invalid login test passed")


class TestAuthenticatedEndpoints:
    """Tests requiring authentication"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        # First try to register
        test_email = f"auth_test_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "nome": "Auth Test User",
                "email": test_email,
                "password": "AuthTest123!"
            }
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        
        # If failed, try login
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": test_email, "password": "AuthTest123!"}
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        
        pytest.skip("Could not authenticate for tests")
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        """Returns headers with auth token"""
        return {"Authorization": f"Bearer {auth_token}"}
    
    def test_get_user_profile(self, auth_headers):
        """Test user profile endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/user/profile",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "nome" in data
        assert "email" in data
        assert "nivel_atual" in data
        assert "xp_atual" in data
        print(f"Profile: {data['nome']} - Level {data['nivel_atual']}")
    
    def test_get_progress(self, auth_headers):
        """Test progress endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/progress",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "nivel_atual" in data
        assert "xp_atual" in data
        assert "xp_proximo_nivel" in data
        assert "porcentagem_nivel" in data
        assert "streak" in data
        assert "total_missoes" in data
        print(f"Progress: Level {data['nivel_atual']}, XP {data['xp_atual']}/{data['xp_proximo_nivel']}")
    
    def test_get_recommended_mission(self, auth_headers):
        """Test recommended mission endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/missions/recommended",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "titulo" in data
        assert "descricao" in data
        assert "nivel" in data
        assert "categoria" in data
        assert "xp_recompensa" in data
        print(f"Recommended mission: {data['titulo']}")
    
    def test_get_missions_list(self, auth_headers):
        """Test missions list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/missions",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Verify mission structure
        mission = data[0]
        assert "titulo" in mission
        assert "nivel" in mission
        print(f"Total missions available: {len(data)}")
    
    def test_get_evidence_list(self, auth_headers):
        """Test evidence list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/evidence",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"User has {len(data)} evidence entries")
    
    def test_get_personal_events(self, auth_headers):
        """Test personal events endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/events/personal",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"User has {len(data)} personal events")
    
    def test_get_user_analises(self, auth_headers):
        """Test user analises history endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/user/analises",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"User has {len(data)} AI analysis entries")


class TestPersonalEventCRUD:
    """Test personal event creation and retrieval"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        test_email = f"event_test_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "nome": "Event Test User",
                "email": test_email,
                "password": "EventTest123!"
            }
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate for event tests")
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        return {"Authorization": f"Bearer {auth_token}"}
    
    def test_create_personal_event(self, auth_headers):
        """Test creating a personal event"""
        event_data = {
            "titulo": "TEST_Apresentacao TCC",
            "descricao": "Defesa do trabalho de conclusao de curso",
            "data_evento": "2026-04-15",
            "tipo_evento": "apresentacao",
            "nivel_importancia": 5
        }
        response = requests.post(
            f"{BASE_URL}/api/events/personal",
            json=event_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "event_id" in data
        print(f"Created event: {data['event_id']}")
    
    def test_list_personal_events_after_create(self, auth_headers):
        """Test listing personal events after creation"""
        response = requests.get(
            f"{BASE_URL}/api/events/personal",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should have at least the event we created
        assert len(data) >= 1
        print(f"Personal events count: {len(data)}")


class TestOnboarding:
    """Test onboarding flow"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        test_email = f"onboard_test_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "nome": "Onboarding Test User",
                "email": test_email,
                "password": "OnboardTest123!"
            }
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate for onboarding tests")
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        return {"Authorization": f"Bearer {auth_token}"}
    
    def test_onboarding_submission(self, auth_headers):
        """Test onboarding questionnaire submission"""
        onboarding_data = {
            "pergunta1": "Dificuldade moderada em situacoes sociais",
            "pergunta2": "Medo de julgamento dos outros",
            "pergunta3": "Evito reunioes e apresentacoes",
            "pergunta4": "3-4 vezes por semana",
            "pergunta5": "Impacto moderado na vida academica",
            "pergunta6": "Ja tentei respiracao profunda",
            "pergunta7": "Quero conseguir apresentar trabalhos com confianca"
        }
        response = requests.post(
            f"{BASE_URL}/api/onboarding",
            json=onboarding_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # AI analysis should be returned (may fail if AI key not configured, but endpoint should work)
        print(f"Onboarding response: {data.get('message')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
