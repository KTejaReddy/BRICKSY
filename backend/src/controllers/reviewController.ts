import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function createReview(req: AuthRequest, res: Response) {
  try {
    const { job_id, worker_id, stars, review } = req.body;
    const [record] = await db('reviews').insert({ job_id, worker_id, stars, review }).returning('*');
    await db('jobs').where({ id: job_id }).update({ status: 'completed' });
    await db('insurance').where({ worker_id }).update({ insurance_status: 'active' });
    res.status(201).json(record);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
