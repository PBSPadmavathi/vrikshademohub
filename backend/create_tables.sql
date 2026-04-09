-- Run this SQL in your Supabase SQL Editor to create the necessary table.

-- Create the call_history table
CREATE TABLE IF NOT EXISTS public.call_history (
    id TEXT PRIMARY KEY,
    use_case_id TEXT NOT NULL,
    caller_name TEXT,
    caller_number TEXT,
    call_from_number TEXT,
    status TEXT DEFAULT 'in-progress',
    duration TEXT DEFAULT '0:00',
    summary TEXT,
    transcript JSONB DEFAULT '[]'::jsonb,
    audio_url TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by use_case_id
CREATE INDEX IF NOT EXISTS idx_call_history_use_case_id ON public.call_history(use_case_id);

-- Enable Realtime for this table (optional, but useful for Supabase)
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_history;
