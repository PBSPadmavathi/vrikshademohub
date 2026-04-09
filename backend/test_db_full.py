import requests
import json
import uuid
import datetime

SUPABASE_URL = "https://yhzwnopwfgrxmdpqbake.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloendub3B3ZmdyeG1kcHFiYWtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ3MTgzMCwiZXhwIjoyMDkxMDQ3ODMwfQ.nOLEhiHIvcldDSR61jIR5YrOyoI88xLknxTSHz0f47Y"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def insert_test_record():
    print(f"Inserting test record into call_history at {SUPABASE_URL}...")
    test_id = f"test-{uuid.uuid4()}"
    data = {
        "id": test_id,
        "use_case_id": "test-case",
        "caller_name": "Test User",
        "caller_number": "+1234567890",
        "call_from_number": "+0987654321",
        "status": "completed",
        "duration": "1:00",
        "summary": "This is a test summary from the AI agent.",
        "transcript": [{"speaker": "ai", "text": "Hello test!", "timestamp": "0:00"}],
        "date": datetime.datetime.utcnow().isoformat()
    }
    
    try:
        response = requests.post(f"{SUPABASE_URL}/rest/v1/call_history", headers=headers, data=json.dumps(data))
        if response.status_code == 201:
            print(f"Success! Record {test_id} inserted.")
            return True
        else:
            print(f"Insertion failed. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"Error during insertion: {e}")
        return False

def check_table():
    print(f"Checking records in call_history...")
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/call_history?select=id,caller_name", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} records:")
            for rec in data:
                print(f" - {rec['id']}: {rec['caller_name']}")
            return True
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error checking records: {e}")
        return False

if __name__ == "__main__":
    if insert_test_record():
        check_table()
