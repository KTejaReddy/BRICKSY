import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function createPayment(req: AuthRequest, res: Response) {
  try {
    const { job_id, amount } = req.body;
    const [payment] = await db('payments').insert({
      job_id, amount, payment_status: 'completed',
    }).returning('*');
    await db('jobs').where({ id: job_id, status: 'open' }).update({ status: 'in_progress' });
    res.status(201).json(payment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
