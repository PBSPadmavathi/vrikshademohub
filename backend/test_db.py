import requests
import json

SUPABASE_URL = "https://yhzwnopwfgrxmdpqbake.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloendub3B3ZmdyeG1kcHFiYWtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ3MTgzMCwiZXhwIjoyMDkxMDQ3ODMwfQ.nOLEhiHIvcldDSR61jIR5YrOyoI88xLknxTSHz0f47Y"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def check_table():
    print(f"Checking table call_history at {SUPABASE_URL}...")
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/call_history?select=id", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Found {len(data)} records in call_history.")
            return True
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    check_table()
