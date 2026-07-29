import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

const ALLOWED_TABLES = ['users', 'workers', 'jobs', 'recommendations', 'payments', 'progress', 'reviews', 'insurance'];

export async function getTable(req: AuthRequest, res: Response) {
  try {
    const { table } = req.params;
    if (!ALLOWED_TABLES.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }
    const rows = await db(table).orderBy('id', 'desc');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
