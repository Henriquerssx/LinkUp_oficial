import requests
import sys
import json
from datetime import datetime

class LinkUpAPITester:
    def __init__(self, base_url="https://exposure-missions.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_user = {
            "nome": "TestUser",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!"
        }
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response['user']
            print(f"✅ Token received: {self.token[:20]}...")
            print(f"✅ User created: {self.user_data['nome']}")
            return True
        return False

    def test_user_login(self):
        """Test user login with created user"""
        if not self.user_data:
            print("❌ No user data available for login test")
            return False
            
        login_data = {
            "email": self.user_data['email'],
            "password": "TestPass123!"
        }
        success, response = self.run_test(
            "User Login",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"✅ Login successful, new token: {self.token[:20]}...")
            return True
        return False

    def test_get_profile(self):
        """Test get user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "user/profile",
            200
        )
        if success and response.get('nome'):
            print(f"✅ Profile retrieved: {response['nome']}")
            return True
        return False

    def test_save_onboarding(self):
        """Test save onboarding responses"""
        onboarding_data = {
            "pergunta1": "Tenho dificuldade em iniciar conversas",
            "pergunta2": "Acho que vou ser rejeitado",
            "pergunta3": "Quero me sentir mais confiante"
        }
        success, response = self.run_test(
            "Save Onboarding",
            "POST",
            "onboarding",
            200,
            data=onboarding_data
        )
        return success

    def test_get_missions(self):
        """Test get missions"""
        success, response = self.run_test(
            "Get All Missions",
            "GET",
            "missions",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"✅ Found {len(response)} missions")
            return True, response
        return False, []

    def test_get_daily_mission(self):
        """Test get daily mission"""
        success, response = self.run_test(
            "Get Daily Mission",
            "GET",
            "missions/daily",
            200
        )
        if success and response.get('id'):
            print(f"✅ Daily mission: {response['titulo']}")
            return True, response
        return False, {}

    def test_complete_mission(self, mission_id):
        """Test complete mission"""
        completion_data = {
            "mission_id": mission_id,
            "fase1": {
                "crenca_limitante": "Não sou interessante",
                "previsao_catastrofica": "A pessoa vai me ignorar",
                "nivel_ansiedade": 7
            },
            "fase3": {
                "o_que_aconteceu": "A pessoa foi receptiva",
                "resultado_real": "Tivemos uma boa conversa",
                "nivel_ansiedade_pos": 3,
                "aprendizado": "Pessoas são mais receptivas que imaginava"
            }
        }
        success, response = self.run_test(
            "Complete Mission",
            "POST",
            "missions/complete",
            200,
            data=completion_data
        )
        if success and response.get('evidence_id'):
            print(f"✅ Mission completed, evidence ID: {response['evidence_id']}")
            return True, response['evidence_id']
        return False, None

    def test_get_progress(self):
        """Test get user progress"""
        success, response = self.run_test(
            "Get User Progress",
            "GET",
            "progress",
            200
        )
        if success and 'nivel_atual' in response:
            print(f"✅ Current level: {response['nivel_atual']}")
            print(f"✅ Current XP: {response['xp_atual']}/{response['xp_proximo_nivel']}")
            print(f"✅ Streak: {response['streak']} days")
            return True
        return False

    def test_get_evidence(self):
        """Test get evidence diary"""
        success, response = self.run_test(
            "Get Evidence",
            "GET",
            "evidence",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Found {len(response)} evidence entries")
            return True
        return False

    def test_get_community(self):
        """Test get community posts"""
        success, response = self.run_test(
            "Get Community Posts",
            "GET",
            "community",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Found {len(response)} community posts")
            return True
        return False

def main():
    print("🚀 Starting LinkUp API Tests...")
    tester = LinkUpAPITester()
    
    # Test user registration
    if not tester.test_user_registration():
        print("❌ Registration failed, stopping tests")
        return 1
    
    # Test user login
    if not tester.test_user_login():
        print("❌ Login failed, stopping tests")
        return 1
    
    # Test profile
    if not tester.test_get_profile():
        print("❌ Profile retrieval failed")
    
    # Test onboarding
    if not tester.test_save_onboarding():
        print("❌ Onboarding save failed")
    
    # Test missions
    missions_success, missions = tester.test_get_missions()
    if not missions_success:
        print("❌ Get missions failed")
    
    # Test daily mission
    daily_success, daily_mission = tester.test_get_daily_mission()
    if not daily_success:
        print("❌ Get daily mission failed")
    
    # Test mission completion if we have a mission
    evidence_id = None
    if daily_success and daily_mission.get('id'):
        completion_success, evidence_id = tester.test_complete_mission(daily_mission['id'])
        if not completion_success:
            print("❌ Mission completion failed")
    
    # Test progress after mission completion
    if not tester.test_get_progress():
        print("❌ Progress retrieval failed")
    
    # Test evidence diary
    if not tester.test_get_evidence():
        print("❌ Evidence retrieval failed")
    
    # Test community
    if not tester.test_get_community():
        print("❌ Community retrieval failed")
    
    # Print final results
    print(f"\n📊 Final Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())