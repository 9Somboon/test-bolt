/*
  # Add inserted_at column to todos table
  1. Modify Table: todos (add inserted_at timestamptz)
*/
ALTER TABLE todos
ADD COLUMN IF NOT EXISTS inserted_at timestamptz DEFAULT now() NOT NULL;

-- Re-add index for user_id in case it was not created or dropped
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);