-- Content Platform - Supabase Database Setup
-- Run this script in your Supabase SQL editor

-- Create the contents table
CREATE TABLE IF NOT EXISTS contents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at);

-- Create an index on updated_at for better performance
CREATE INDEX IF NOT EXISTS idx_contents_updated_at ON contents(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON contents
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert content
CREATE POLICY "Allow authenticated users to insert content" ON contents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update content
CREATE POLICY "Allow authenticated users to update content" ON contents
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete content" ON contents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
CREATE TRIGGER update_contents_updated_at 
    BEFORE UPDATE ON contents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO contents (title, description) VALUES
  ('Welcome to Content Platform', 'A modern content management platform built with Next.js, Strapi, and Supabase.'),
  ('Getting Started Guide', 'Learn how to set up and use the Content Platform for your projects.'),
  ('API Documentation', 'Comprehensive documentation for the Content Platform API endpoints.');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON contents TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Display the created table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contents' 
ORDER BY ordinal_position; 