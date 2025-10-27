-- Disable Row Level Security for demo tables
-- This allows the Python script to insert data via the API

ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.respondents DISABLE ROW LEVEL SECURITY;


