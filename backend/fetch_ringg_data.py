import sys
import json
from app.ringg_client import ringg_client

def main():
    print("--- Fetching Ringg.ai Data ---")
    
    try:
        # 1. Fetch Agents
        print("\n[1] Agents (Assistants):")
        agents = ringg_client.get_agents()
        print(json.dumps(agents, indent=2))
        
        # 2. Fetch Phone Numbers
        print("\n[2] Workspace Phone Numbers:")
        numbers = ringg_client.get_phone_numbers()
        print(json.dumps(numbers, indent=2))
        
        # 3. Fetch Call History
        print("\n[3] Call History (Recent):")
        history = ringg_client.get_call_history(limit=5)
        print(json.dumps(history, indent=2))
        
        print("\n--- Summary ---")
        print(f"Total Agents: {len(agents.get('agents', []))}")
        print(f"Total Calls Fetched: {len(history.get('calls', []))}")
        
    except Exception as e:
        print(f"\nError fetching data: {e}")

if __name__ == "__main__":
    main()
