import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seedData(db: Knex): Promise<void> {
  const userCount = await db('users').count('id as count').first();
  if (userCount && Number(userCount.count) > 0) return;

  const hash = bcrypt.hashSync('password123', 10);

  // Users
  const roles = ['owner', 'contractor', 'skilled_worker'];
  const trades = ['mason', 'electrician', 'plumber', 'carpenter', 'painter', 'welder'];
  const users: { name: string; email: string; password: string; role: string }[] = [];

  for (let i = 1; i <= 12; i++) {
    const role = i === 1 ? 'owner' : i <= 4 ? 'contractor' : 'skilled_worker';
    users.push({
      name: `${role === 'owner' ? 'Alice' : role === 'contractor' ? 'Bob' : 'Charlie'} ${i}`,
      email: `user${i}@test.com`,
      password: hash,
      role,
    });
  }

  for (const u of users) {
    await db('users').insert(u);
  }

  // Workers
  for (let i = 0; i < 8; i++) {
    const userId = i + 5;
    await db('workers').insert({
      user_id: userId,
      trade: trades[i % trades.length],
      experience: Math.floor(Math.random() * 20) + 1,
      tenure: Math.floor(Math.random() * 10) + 1,
      rating: parseFloat((Math.random() * 4 + 1).toFixed(2)),
      previous_projects: Math.floor(Math.random() * 50) + 1,
      availability_score: parseFloat((Math.random() * 100).toFixed(2)),
      trust_score: parseFloat((Math.random() * 100).toFixed(2)),
      estimated_cost: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    });
  }

  // Insurance for workers
  for (let i = 1; i <= 8; i++) {
    await db('insurance').insert({
      worker_id: i,
      insurance_status: 'active',
    });
  }

  // Jobs posted by contractors (users 2-4)
  for (let i = 1; i <= 3; i++) {
    await db('jobs').insert({
      employer_id: i + 1,
      trade_required: trades[(i * 2) % trades.length],
      description: `Need a skilled ${trades[(i * 2) % trades.length]} for a residential project.`,
      budget: parseFloat((Math.random() * 5000 + 1000).toFixed(2)),
      status: i === 1 ? 'completed' : 'open',
      worker_id: i === 1 ? i : null,
    });
  }

  // Payments for completed job
  const completedJob = await db('jobs').where({ status: 'completed' }).first();
  if (completedJob) {
    await db('payments').insert({
      job_id: completedJob.id,
      amount: completedJob.budget,
      payment_status: 'completed',
    });

    // Progress for completed job
    await db('progress').insert({
      job_id: completedJob.id,
      worker_id: completedJob.worker_id,
      photos: '',
      videos: '',
      upload_date: new Date().toISOString().split('T')[0],
      approved: true,
    });

    // Review for completed job
    await db('reviews').insert({
      job_id: completedJob.id,
      worker_id: completedJob.worker_id,
      stars: 5,
      review: 'Excellent work! Highly recommended.',
    });
  }

  console.log('Seed data inserted successfully');
}
