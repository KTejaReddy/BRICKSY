import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function uploadProgress(req: AuthRequest, res: Response) {
  try {
    const { job_id } = req.body;
    const worker = await db('workers').where({ user_id: req.userId }).select('id').first();
    if (!worker) {
      return res.status(400).json({ error: 'Worker profile not found' });
    }
    const photos = ((req.files as any)?.photos || []).map((f: any) => f.filename);
    const videos = ((req.files as any)?.videos || []).map((f: any) => f.filename);
    const [record] = await db('progress').insert({
      job_id, worker_id: worker.id, photos, videos, upload_date: new Date().toISOString().split('T')[0],
    }).returning('*');
    res.status(201).json(record);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getProgress(req: AuthRequest, res: Response) {
  try {
    const { jobId } = req.params;
    const records = await db('progress')
      .join('workers', 'progress.worker_id', 'workers.id')
      .join('users', 'workers.user_id', 'users.id')
      .select('progress.*', 'users.name as worker_name')
      .where('progress.job_id', jobId)
      .orderBy('progress.upload_date', 'desc');
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function approveProgress(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const [record] = await db('progress').where({ id }).update({ approved: true }).returning('*');
    if (!record) {
      return res.status(404).json({ error: 'Progress record not found' });
    }
    res.json(record);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
