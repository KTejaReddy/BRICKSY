import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/knexfile';

const JWT_SECRET = process.env.JWT_SECRET || 'bricksy-secret-key';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role, trade } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db('users').insert({ name, email, password: hashed, role }).returning(['id', 'name', 'email', 'role']);

    if (role === 'skilled_worker') {
      const [worker] = await db('workers').insert({
        user_id: user.id, trade: trade || 'mason',
        experience: 0, tenure: 0, rating: 0, previous_projects: 0,
        availability_score: 0.5, trust_score: 0.5, estimated_cost: 0,
      }).returning('id');
      await db('insurance').insert({ worker_id: worker.id, insurance_status: 'inactive' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
