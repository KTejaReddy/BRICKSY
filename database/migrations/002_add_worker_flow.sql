-- Migration 002: Add worker acceptance and progress approval columns
-- Up

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS worker_id INTEGER REFERENCES workers(id) ON DELETE SET NULL;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Down
-- ALTER TABLE jobs DROP COLUMN IF EXISTS worker_id;
-- ALTER TABLE progress DROP COLUMN IF EXISTS approved;
