import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function getProjects(req: AuthRequest, res: Response) {
  try {
    const jobs = await db('jobs')
      .join('users', 'jobs.employer_id', 'users.id')
      .select('jobs.*', 'users.name as employer_name')
      .orderBy('jobs.id', 'desc');

    const jobIds = jobs.map(j => j.id);
    let progressRows: any[] = [];
    if (jobIds.length > 0) {
      progressRows = await db('progress').whereIn('job_id', jobIds).select('*');
    }

    const progressByJob: Record<number, any[]> = {};
    for (const p of progressRows) {
      if (!progressByJob[p.job_id]) progressByJob[p.job_id] = [];
      progressByJob[p.job_id].push({
        id: p.id, photos: p.photos, videos: p.videos, upload_date: p.upload_date,
      });
    }

    const result = jobs.map(j => ({
      ...j, progress_updates: progressByJob[j.id] || [],
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
