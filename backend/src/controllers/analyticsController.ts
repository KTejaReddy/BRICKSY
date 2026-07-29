import { Response } from 'express';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

export async function getAnalytics(req: AuthRequest, res: Response) {
  try {
    const totalUsers = (await db('users').count('id as count').first()) as any;
    const totalWorkers = (await db('workers').count('id as count').first()) as any;
    const totalJobs = (await db('jobs').count('id as count').first()) as any;
    const completedJobs = (await db('jobs').where({ status: 'completed' }).count('id as count').first()) as any;
    const totalPayments = (await db('payments').sum('amount as total').first()) as any;
    const avgRating = (await db('reviews').avg('stars as avg').first()) as any;
    const jobsByTrade = await db('jobs').select('trade_required').count('id as count').groupBy('trade_required');
    const workersByTrade = await db('workers').select('trade').count('id as count').groupBy('trade');

    res.json({
      totalUsers: Number(totalUsers.count) || 0,
      totalWorkers: Number(totalWorkers.count) || 0,
      totalJobs: Number(totalJobs.count) || 0,
      completedJobs: Number(completedJobs.count) || 0,
      totalPayments: Number(totalPayments.total) || 0,
      avgRating: Number(avgRating.avg) || 0,
      jobsByTrade,
      workersByTrade,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
