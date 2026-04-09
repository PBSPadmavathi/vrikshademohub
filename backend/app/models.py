from sqlalchemy import Column, String, DateTime, Text, JSON
from .database import Base
import datetime

class CallHistory(Base):
    __tablename__ = "call_history"

    id = Column(String, primary_key=True, index=True)
    use_case_id = Column(String, index=True)
    caller_name = Column(String)
    caller_number = Column(String)
    call_from_number = Column(String)
    status = Column(String) # completed, missed, in-progress, failed
    duration = Column(String)
    summary = Column(Text)
    transcript = Column(JSON) # Storing transcript nodes as a JSON array
    audio_url = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
