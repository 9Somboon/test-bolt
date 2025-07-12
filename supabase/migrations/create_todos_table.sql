/*
  # Create todos table
  1. New Tables: todos (id uuid, user_id uuid, task text, is_complete boolean, inserted_at timestamptz)
  2. Security: Enable RLS, add policies for authenticated users to CRUD their own todos.
*/
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task text NOT NULL,
  is_complete boolean DEFAULT false NOT NULL,
  inserted_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own todos
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own todos
CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own todos
CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own todos
CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Add index for user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);