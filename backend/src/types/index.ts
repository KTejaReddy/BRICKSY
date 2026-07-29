export type UserRole = 'owner' | 'contractor' | 'skilled_worker';

export type Trade = 'mason' | 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'welder';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Worker {
  id: number;
  user_id: number;
  trade: Trade;
  experience: number;
  tenure: number;
  rating: number;
  previous_projects: number;
  availability_score: number;
  trust_score: number;
  estimated_cost: number;
}

export interface Job {
  id: number;
  employer_id: number;
  trade_required: Trade;
  description: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed';
}

export interface Recommendation {
  id: number;
  job_id: number;
  worker_id: number;
  score: number;
}

export interface Payment {
  id: number;
  job_id: number;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
}

export interface Progress {
  id: number;
  job_id: number;
  worker_id: number;
  photos: string[];
  videos: string[];
  upload_date: string;
}

export interface Review {
  id: number;
  job_id: number;
  worker_id: number;
  stars: number;
  review: string;
}

export interface Insurance {
  id: number;
  worker_id: number;
  insurance_status: 'active' | 'inactive';
}
