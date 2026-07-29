-- BRICKSY Database Schema
-- PostgreSQL

CREATE DATABASE bricksy;

\c bricksy;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contractor', 'skilled_worker'))
);

CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade VARCHAR(50) NOT NULL CHECK (trade IN ('mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder')),
  experience INTEGER DEFAULT 0,
  tenure INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  previous_projects INTEGER DEFAULT 0,
  availability_score DECIMAL(3,2) DEFAULT 0.5,
  trust_score DECIMAL(3,2) DEFAULT 0.5,
  estimated_cost DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade_required VARCHAR(50) NOT NULL CHECK (trade_required IN ('mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder')),
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
  worker_id INTEGER REFERENCES workers(id) ON DELETE SET NULL
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  score DECIMAL(5,4) DEFAULT 0,
  UNIQUE(job_id, worker_id)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed'))
);

CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  photos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  approved BOOLEAN DEFAULT FALSE,
  upload_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  review TEXT DEFAULT ''
);

CREATE TABLE insurance (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  insurance_status VARCHAR(20) DEFAULT 'inactive' CHECK (insurance_status IN ('active', 'inactive'))
);

CREATE INDEX idx_workers_trade ON workers(trade);
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_recommendations_job ON recommendations(job_id);
CREATE INDEX idx_progress_job ON progress(job_id);
