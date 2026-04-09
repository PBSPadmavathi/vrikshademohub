from pydantic import BaseModel
from typing import List, Optional
import datetime

class TranscriptEntry(BaseModel):
    speaker: str # 'ai' or 'user'
    text: str
    timestamp: str

class CallBase(BaseModel):
    use_case_id: str
    caller_name: str
    caller_number: str
    call_from_number: str

class CallCreate(CallBase):
    pass

class CallDetail(CallBase):
    id: str
    status: str
    duration: Optional[str] = "0:00"
    summary: Optional[str] = ""
    transcript: List[TranscriptEntry] = []
    audio_url: Optional[str] = ""
    date: datetime.datetime

    class Config:
        from_attributes = True
