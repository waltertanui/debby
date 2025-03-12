/*
  # Enhanced Asset Management Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `read` (boolean)
      - `created_at` (timestamp)
    
    - `audit_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `action` (text)
      - `resource_type` (text)
      - `resource_id` (text)
      - `changes` (jsonb)
      - `created_at` (timestamp)

  2. Asset Table Updates
    - Add columns for enhanced asset tracking
    - Add lifecycle management
    - Add maintenance scheduling

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  changes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add new columns to assets table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE assets 
      ADD COLUMN assigned_to uuid REFERENCES auth.users(id),
      ADD COLUMN lifecycle_stage text DEFAULT 'new',
      ADD COLUMN next_maintenance timestamptz,
      ADD COLUMN notes text,
      ADD COLUMN attachments text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for audit logs
CREATE POLICY "Users can view audit logs for their assets"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    resource_id IN (
      SELECT id::text FROM assets WHERE user_id = auth.uid()
    )
  );

-- Create trigger to update assets updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to create user profile after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();