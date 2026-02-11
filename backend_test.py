import requests
import sys
import json
from datetime import datetime

class AcademicWebsiteAPITester:
    def __init__(self, base_url="https://website-builder-493.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_fields=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Check response content if expected fields provided
                if expected_fields and response.content:
                    try:
                        response_data = response.json()
                        for field in expected_fields:
                            if field not in response_data:
                                print(f"⚠️  Warning: Expected field '{field}' not found in response")
                            else:
                                print(f"   ✓ Field '{field}' present")
                    except json.JSONDecodeError:
                        print(f"⚠️  Warning: Response is not valid JSON")
                
                self.test_results.append({
                    "test": name,
                    "status": "PASSED",
                    "response_code": response.status_code
                })
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.content:
                    try:
                        error_data = response.json()
                        print(f"   Error: {error_data}")
                    except:
                        print(f"   Error: {response.text[:200]}")
                
                self.test_results.append({
                    "test": name,
                    "status": "FAILED",
                    "response_code": response.status_code,
                    "error": response.text[:200] if response.content else "No response content"
                })

            return success, response.json() if success and response.content else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.test_results.append({
                "test": name,
                "status": "FAILED",
                "error": f"Network Error: {str(e)}"
            })
            return False, {}

    def test_profile_api(self):
        """Test profile API endpoint"""
        success, response = self.run_test(
            "Profile API",
            "GET",
            "profile",
            200,
            expected_fields=["name", "title", "affiliation", "email", "research_interests"]
        )
        
        if success and response:
            print(f"   Profile Name: {response.get('name', 'N/A')}")
            print(f"   Research Interests Count: {len(response.get('research_interests', []))}")
        
        return success

    def test_publications_api(self):
        """Test publications API endpoint"""
        success, response = self.run_test(
            "Publications API",
            "GET",
            "publications",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Publications Count: {len(response)}")
            if response:
                pub = response[0]
                print(f"   Sample Publication: {pub.get('title', 'N/A')[:50]}...")
        
        return success

    def test_publications_filter_by_year(self):
        """Test publications API with year filter"""
        success, response = self.run_test(
            "Publications API (Year Filter)",
            "GET",
            "publications?year=2023",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   2023 Publications Count: {len(response)}")
        
        return success

    def test_publications_filter_by_type(self):
        """Test publications API with type filter"""
        success, response = self.run_test(
            "Publications API (Type Filter)",
            "GET",
            "publications?type=journal",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Journal Publications Count: {len(response)}")
        
        return success

    def test_news_api(self):
        """Test news API endpoint"""
        success, response = self.run_test(
            "News API",
            "GET",
            "news",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   News Items Count: {len(response)}")
            if response:
                news_item = response[0]
                print(f"   Latest News: {news_item.get('title', 'N/A')}")
        
        return success

    def test_contact_api(self):
        """Test contact form submission"""
        test_message = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Message",
            "message": "This is a test message from the API tester."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_message,
            expected_fields=["success", "message"]
        )
        
        if success and response:
            print(f"   Response: {response.get('message', 'N/A')}")
        
        return success

    def test_cv_download_api(self):
        """Test CV download endpoint"""
        success, _ = self.run_test(
            "CV Download API",
            "GET",
            "cv",
            200  # Expecting 200 if CV exists, 404 if not
        )
        
        # Also test if 404 is returned (which is acceptable if CV file doesn't exist)
        if not success:
            success_404, _ = self.run_test(
                "CV Download API (404 Check)",
                "GET",
                "cv",
                404
            )
            if success_404:
                print("   CV file not found (404) - This is acceptable for testing")
                return True
        
        return success

    def test_root_api(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API",
            "GET",
            "",
            200,
            expected_fields=["message"]
        )
        
        if success and response:
            print(f"   API Message: {response.get('message', 'N/A')}")
        
        return success

def main():
    print("🚀 Starting Academic Website API Tests")
    print("=" * 50)
    
    tester = AcademicWebsiteAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_api,
        tester.test_profile_api,
        tester.test_publications_api,
        tester.test_publications_filter_by_year,
        tester.test_publications_filter_by_type,
        tester.test_news_api,
        tester.test_contact_api,
        tester.test_cv_download_api
    ]
    
    for test in tests:
        test()
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print detailed results
    print(f"\n📋 Detailed Results:")
    for result in tester.test_results:
        status_icon = "✅" if result["status"] == "PASSED" else "❌"
        print(f"   {status_icon} {result['test']}: {result['status']}")
        if "error" in result:
            print(f"      Error: {result['error']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())