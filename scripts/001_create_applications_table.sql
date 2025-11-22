-- Create the applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  pseudo_roblox TEXT NOT NULL,
  discord_id TEXT NOT NULL,
  age TEXT NOT NULL,
  role TEXT NOT NULL,
  specific_answer TEXT,
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (submit application)
CREATE POLICY "Allow public insert" ON applications
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read/update/delete (for the admin panel without auth for now, as we use hardcoded credentials)
-- IN PRODUCTION, YOU SHOULD USE SUPABASE AUTH AND RESTRICT THIS PROPERLY
CREATE POLICY "Allow public all" ON applications
  FOR ALL
  USING (true)
  WITH CHECK (true);
