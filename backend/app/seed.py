import json
import datetime
import requests
from .database import SUPABASE_REST_URL, SUPABASE_HEADERS
from . import schemas

# Sample data translated from frontend `src/lib/data.ts`
INITIAL_CALLS = [
    {
        "id": "ch-1",
        "use_case_id": "agri-1",
        "date": "2026-04-05T14:30:00",
        "status": "completed",
        "duration": "3:45",
        "caller_name": "Rajesh Kumar",
        "caller_number": "+91 99887 76655",
        "call_from_number": "+91 98765 43210",
        "summary": "Customer called regarding crop insurance claim for wheat damage due to unseasonal rain. AI agent verified policy details, guided through claim filing, and scheduled a field inspection for April 8th.",
        "transcript": [
            {"speaker": "ai", "text": "Namaste! Welcome to Vriksha Agriculture Helpline. How can I assist you today?", "timestamp": "0:00"},
            {"speaker": "user", "text": "Hi, I need to file a crop insurance claim.", "timestamp": "0:05"}
        ],
        "audio_url": ""
    },
    {
        "id": "ch-4",
        "use_case_id": "ins-1",
        "date": "2026-04-05T11:00:00",
        "status": "completed",
        "duration": "4:12",
        "caller_name": "Priya Sharma",
        "caller_number": "+91 99001 12233",
        "call_from_number": "+91 76543 21098",
        "summary": "Policy renewal reminder call. Customer confirmed renewal and updated nominee details.",
        "transcript": [
            {"speaker": "ai", "text": "Good morning! This is Vriksha AI calling from ABC Insurance.", "timestamp": "0:00"}
        ],
        "audio_url": ""
    }
]

def seed_data():
    print("Seeding data to Supabase...")
    
    for call_data in INITIAL_CALLS:
        # Check if exists
        check_url = f"{SUPABASE_REST_URL}/call_history?id=eq.{call_data['id']}&select=id"
        response = requests.get(check_url, headers=SUPABASE_HEADERS)
        data = response.json()
        
        if not data:
            print(f"Inserting {call_data['id']}...")
            requests.post(f"{SUPABASE_REST_URL}/call_history", headers=SUPABASE_HEADERS, data=json.dumps(call_data))
        else:
            print(f"Updating {call_data['id']}...")
            requests.patch(check_url, headers=SUPABASE_HEADERS, data=json.dumps(call_data))
    
    print("Seed data applied successfully!")

if __name__ == "__main__":
    seed_data()
