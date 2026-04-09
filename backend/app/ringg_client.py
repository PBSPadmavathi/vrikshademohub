import os
import requests
from dotenv import load_dotenv

load_dotenv()

class RinggClient:
    def __init__(self):
        self.base_url = "https://prod-api.ringg.ai/ca/api/v0"
        self.api_key = os.getenv("RINGG_API_KEY")
        self.headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }

    def get_agents(self, limit=20, offset=0):
        url = f"{self.base_url}/agent/all?limit={limit}&offset={offset}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_phone_numbers(self):
        url = f"{self.base_url}/workspace/numbers"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_call_history(self, limit=20, offset=0, status=None, agent_id=None):
        params = {
            "limit": limit,
            "offset": offset
        }
        if status:
            params["status"] = status
        if agent_id:
            params["agent_id"] = agent_id
            
        url = f"{self.base_url}/calling/history"
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()

    def start_call(self, name: str, mobile_number: str, agent_id: str, from_number_id: str, custom_args: dict = None):
        url = f"{self.base_url}/calling/outbound/individual"
        data = {
            "name": name,
            "mobile_number": mobile_number,
            "agent_id": agent_id,
            "from_number_id": from_number_id,
            "custom_args_values": custom_args or {}
        }
        response = requests.post(url, headers=self.headers, json=data)
        response.raise_for_status()
        return response.json()

# Singleton instance
ringg_client = RinggClient()
