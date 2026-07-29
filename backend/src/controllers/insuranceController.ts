import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function getInsurance(req: AuthRequest, res: Response) {
  try {
    const worker = await db('workers').where({ user_id: req.userId }).select('id').first();
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    const record = await db('insurance').where({ worker_id: worker.id }).first();
    if (!record) {
      return res.status(404).json({ error: 'Insurance record not found' });
    }
    res.json(record);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
