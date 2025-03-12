/*
  # Asset Management Schema

  1. New Tables
    - `assets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `status` (text)
      - `location` (text)
      - `value` (numeric)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `asset_activities`
      - `id` (uuid, primary key)
      - `asset_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `action` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  status text NOT NULL,
  location text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create asset_activities table
CREATE TABLE IF NOT EXISTS asset_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_activities ENABLE ROW LEVEL SECURITY;

-- Policies for assets
CREATE POLICY "Users can view their own assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own assets"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own assets"
  ON assets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for asset_activities
CREATE POLICY "Users can view their own asset activities"
  ON asset_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own asset activities"
  ON asset_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());