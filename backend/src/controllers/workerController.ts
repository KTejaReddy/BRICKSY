import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function getWorkers(_req: AuthRequest, res: Response) {
  try {
    const workers = await db('workers')
      .join('users', 'workers.user_id', 'users.id')
      .select('workers.*', 'users.name', 'users.email');
    res.json(workers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getWorker(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const worker = await db('workers')
      .join('users', 'workers.user_id', 'users.id')
      .select('workers.*', 'users.name', 'users.email')
      .where('workers.id', id)
      .first();
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(worker);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateWorker(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { trade, experience, tenure, rating, previous_projects, availability_score, trust_score, estimated_cost } = req.body;
    const updates: Record<string, any> = {};
    if (trade !== undefined) updates.trade = trade;
    if (experience !== undefined) updates.experience = experience;
    if (tenure !== undefined) updates.tenure = tenure;
    if (rating !== undefined) updates.rating = rating;
    if (previous_projects !== undefined) updates.previous_projects = previous_projects;
    if (availability_score !== undefined) updates.availability_score = availability_score;
    if (trust_score !== undefined) updates.trust_score = trust_score;
    if (estimated_cost !== undefined) updates.estimated_cost = estimated_cost;
    const [worker] = await db('workers').where({ id }).update(updates).returning('*');
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(worker);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
