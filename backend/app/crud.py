import requests
import json
from .database import SUPABASE_REST_URL, SUPABASE_HEADERS
from .ringg_client import ringg_client
from . import schemas
import uuid
import datetime

def get_call(call_id: str):
    # Try Ringg first if ID looks like a Ringg ID (or just try both)
    # For now, let's keep it simple and try Supabase first
    url = f"{SUPABASE_REST_URL}/call_history?id=eq.{call_id}&select=*"
    response = requests.get(url, headers=SUPABASE_HEADERS)
    data = response.json()
    return data[0] if data else None

def get_calls_by_use_case(use_case_id: str):
    url = f"{SUPABASE_REST_URL}/call_history?use_case_id=eq.{use_case_id}&select=*&order=date.desc"
    response = requests.get(url, headers=SUPABASE_HEADERS)
    return response.json()

def get_ringg_history(agent_id: str = None, name_filter: str = None):
    """Fetch history from Ringg.ai and optionally filter by agent name substring"""
    try:
        # If agent_id is "ringg" (the category ID), we fetch all. 
        # If it's a UUID, we filter by that specific agent.
        filter_agent = agent_id if agent_id and len(agent_id) > 10 else None
        
        # Fetch more history to increase chance of finding branded matches
        ringg_data = ringg_client.get_call_history(limit=100, agent_id=filter_agent)
        calls = ringg_data.get("calls", [])
        
        mapped_calls = []
        for call in calls:
            # Map Ringg response fields to our normalized history schema
            agent_details = call.get("agent", {})
            real_agent_name = agent_details.get("agent_display_name") or call.get("agent_display_name") or "Agent"
            
            # Filter by agent name ONLY if we are doing a broad search (no specific agent_id)
            if not filter_agent and name_filter and name_filter.lower() not in real_agent_name.lower():
                continue

            # Map Ringg transcript (JSON string) to our list of TranscriptEntry
            raw_transcript = call.get("transcript", "[]")
            if isinstance(raw_transcript, str):
                try:
                    raw_transcript = json.loads(raw_transcript)
                except:
                    raw_transcript = []
            
            formatted_transcript = []
            for entry in raw_transcript:
                formatted_transcript.append({
                    "speaker": "ai" if "bot" in entry else "user",
                    "text": entry.get("bot") or entry.get("user") or "",
                    "timestamp": entry.get("timestamp", "")
                })

            # Map to our schema
            mapped_calls.append({
                "id": call.get("id"),
                "use_case_id": call.get("agent_id") or "ringg",
                "caller_name": call.get("name") or "Customer", # The person called
                "caller_number": call.get("to_number"),
                "call_from_number": call.get("from_numbers", [""])[0],
                "status": call.get("status"),
                "date": call.get("created_at"),
                "duration": f"{int(call.get('call_duration', 0) // 60)}:{int(call.get('call_duration', 0) % 60):02d}",
                "transcript": formatted_transcript,
                "audio_url": call.get("audio_recording") or ""
            })
        return mapped_calls
    except Exception as e:
        print(f"Error fetching Ringg history: {e}")
        return []

def create_call(call: schemas.CallCreate):
    new_id = str(uuid.uuid4())
    data = {
        "id": new_id,
        "use_case_id": call.use_case_id,
        "caller_name": call.caller_name,
        "caller_number": call.caller_number,
        "call_from_number": call.call_from_number,
        "status": "in-progress",
        "date": datetime.datetime.utcnow().isoformat(),
        "duration": "0:00",
        "summary": "Call initiated and connecting...",
        "transcript": []
    }
    url = f"{SUPABASE_REST_URL}/call_history"
    response = requests.post(url, headers=SUPABASE_HEADERS, data=json.dumps(data))
    inserted_data = response.json()
    return inserted_data[0] if inserted_data else None

def update_call_status(call_id: str, status: str, duration: str = None, summary: str = None, transcript: list = None):
    update_data = {"status": status}
    if duration is not None: update_data["duration"] = duration
    if summary is not None: update_data["summary"] = summary
    if transcript is not None: update_data["transcript"] = transcript
    
    url = f"{SUPABASE_REST_URL}/call_history?id=eq.{call_id}"
    response = requests.patch(url, headers=SUPABASE_HEADERS, data=json.dumps(update_data))
    updated_data = response.json()
    return updated_data[0] if updated_data else None
