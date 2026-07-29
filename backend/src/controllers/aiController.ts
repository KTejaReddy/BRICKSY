import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';
import { getRecommendations } from '../services/aiService';

export async function recommend(req: AuthRequest, res: Response) {
  try {
    const { job_id, trade_required } = req.body;

    const workers = await db('workers')
      .join('users', 'workers.user_id', 'users.id')
      .select('workers.*', 'users.name')
      .where('workers.trade', trade_required);

    if (workers.length === 0) {
      return res.json({ recommendations: [] });
    }

    const aiResult = await getRecommendations({
      workers: workers.map((w: any) => ({
        id: w.id,
        experience: w.experience,
        tenure: w.tenure,
        rating: w.rating,
        previous_projects: w.previous_projects,
        estimated_cost: w.estimated_cost,
        availability_score: w.availability_score,
        trust_score: w.trust_score,
        trade: w.trade,
      })),
      job: { trade_required },
    });

    let scored: any[];
    if (aiResult.error) {
      scored = workers.map((w: any) => {
        const score =
          w.rating * 0.3 +
          (w.experience / 30) * 0.2 +
          (w.tenure / 20) * 0.1 +
          (w.previous_projects / 50) * 0.1 +
          w.availability_score * 0.15 +
          w.trust_score * 0.15;
        return { ...w, score };
      });
    } else {
      scored = aiResult.recommendations || [];
    }

    scored.sort((a: any, b: any) => b.score - a.score);

    for (const worker of scored) {
      const exists = await db('recommendations').where({ job_id, worker_id: worker.id }).first();
      if (!exists) {
        await db('recommendations').insert({ job_id, worker_id: worker.id, score: worker.score });
      }
    }

    res.json({ recommendations: scored });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
