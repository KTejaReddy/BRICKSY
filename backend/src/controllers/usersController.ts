import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function getAllUsers(_req: AuthRequest, res: Response) {
  try {
    const users = await db('users').select('id', 'name', 'email', 'role').orderBy('id', 'desc');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
