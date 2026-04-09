from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from . import schemas, crud
import time
import random

app = FastAPI(title="Vriksha AI Demo Hub API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# No database dependency needed for Supabase client

@app.get("/")
def read_root():
    return {"message": "Vriksha AI Demo Hub Backend is running!"}

@app.post("/api/calls/initiate", response_model=schemas.CallDetail)
def initiate_call(call: schemas.CallCreate, background_tasks: BackgroundTasks):
    # Check if this is a Ringg agent (UUID-like ID or specific industry)
    is_ringg = "-" in call.use_case_id and len(call.use_case_id) > 10
    
    if is_ringg:
        from .ringg_client import ringg_client
        try:
            # We assume 'call.call_from_number' is the 'from_number_id' when using Ringg
            ringg_response = ringg_client.start_call(
                name=call.caller_name,
                mobile_number=call.caller_number,
                agent_id=call.use_case_id,
                from_number_id=call.call_from_number
            )
            
            # Since Ringg handles the call, we just create a record of the initiation
            # and let the history fetch handle the actual data later.
            db_call = crud.create_call(call)
            # Update status to in-progress or something similar if needed
            return db_call
        except Exception as e:
            print(f"Ringg Call Initiation Failed: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to initiate Ringg call: {str(e)}")
    else:
        # Standard simulated demo call
        db_call = crud.create_call(call)
        
        if not db_call:
            raise HTTPException(status_code=500, detail="Failed to create call in Supabase")

        # Simulate call completion in background
        background_tasks.add_task(simulate_call_completion, db_call["id"])
        
        return db_call

@app.get("/api/calls/history/{use_case_id}", response_model=list[schemas.CallDetail])
def get_history(use_case_id: str):
    if use_case_id == "ringg" or "-" in use_case_id:
        return crud.get_ringg_history(use_case_id)
    calls = crud.get_calls_by_use_case(use_case_id)
    return calls

@app.get("/api/ringg/history")
def get_ringg_history_all(agent_id: str = None, agent_name_filter: str = None):
    from .crud import get_ringg_history
    return get_ringg_history(agent_id, agent_name_filter)

@app.get("/api/ringg/agents")
def get_ringg_agents():
    from .ringg_client import ringg_client
    try:
        return ringg_client.get_agents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ringg/numbers")
def get_ringg_numbers():
    from .ringg_client import ringg_client
    try:
        return ringg_client.get_phone_numbers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/calls/{call_id}", response_model=schemas.CallDetail)
def get_call_details(call_id: str):
    db_call = crud.get_call(call_id)
    if not db_call:
        raise HTTPException(status_code=404, detail="Call not found")
    return db_call

# Simulated background task to "complete" a call
def simulate_call_completion(call_id: str):
    # Wait a few seconds to simulate a real call
    time.sleep(10)
    
    # Mocking a successful call completion
    duration = f"{random.randint(1, 5)}:{random.randint(10, 59):02d}"
    summary = "AI agent successfully handled the inquiry and provided necessary information."
    transcript = [
        {"speaker": "ai", "text": "Hello! This is Vriksha AI, how can I help you?", "timestamp": "0:00"},
        {"speaker": "user", "text": "I would like to know more about this use case.", "timestamp": "0:05"},
        {"speaker": "ai", "text": "Certainly! I've initiated this demo for you. Is there anything specific you need?", "timestamp": "0:12"},
        {"speaker": "user", "text": "No, that's all. Thank you.", "timestamp": "0:25"},
        {"speaker": "ai", "text": "You're welcome! Have a great day.", "timestamp": "0:30"}
    ]
    
    crud.update_call_status(
        call_id, 
        status="completed", 
        duration=duration, 
        summary=summary, 
        transcript=transcript
    )
