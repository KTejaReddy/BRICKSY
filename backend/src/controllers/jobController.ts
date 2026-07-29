import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function createJob(req: AuthRequest, res: Response) {
  try {
    const { trade_required, description, budget } = req.body;
    const [job] = await db('jobs').insert({
      employer_id: req.userId, trade_required, description, budget, status: 'open',
    }).returning('*');
    res.status(201).json(job);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getJobs(req: AuthRequest, res: Response) {
  try {
    const jobs = await db('jobs')
      .join('users', 'jobs.employer_id', 'users.id')
      .select('jobs.*', 'users.name as employer_name')
      .orderBy('jobs.id', 'desc');
    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAvailableJobs(req: AuthRequest, res: Response) {
  try {
    const worker = await db('workers').where({ user_id: req.userId }).select('id', 'trade').first();
    if (!worker) {
      return res.status(400).json({ error: 'Worker profile not found' });
    }
    const jobs = await db('jobs')
      .join('users', 'jobs.employer_id', 'users.id')
      .select('jobs.*', 'users.name as employer_name')
      .where({ 'jobs.status': 'open', 'jobs.trade_required': worker.trade })
      .whereNull('jobs.worker_id')
      .orderBy('jobs.id', 'desc');
    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function acceptJob(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const worker = await db('workers').where({ user_id: req.userId }).select('id').first();
    if (!worker) {
      return res.status(400).json({ error: 'Worker profile not found' });
    }
    const [job] = await db('jobs')
      .where({ id, status: 'open' })
      .whereNull('worker_id')
      .update({ worker_id: worker.id })
      .returning('*');
    if (!job) {
      return res.status(400).json({ error: 'Job not available for acceptance' });
    }
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateJob(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { description, budget, status } = req.body;
    const updates: Record<string, any> = {};
    if (description !== undefined) updates.description = description;
    if (budget !== undefined) updates.budget = budget;
    if (status !== undefined) updates.status = status;
    const [job] = await db('jobs').where({ id }).update(updates).returning('*');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
