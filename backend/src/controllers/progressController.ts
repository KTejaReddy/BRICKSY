import { Response } from 'express';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import db from '../database/knexfile';
import { AuthRequest } from '../middleware/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      },
    );
    stream.end(buffer);
  });
}

export async function uploadProgress(req: AuthRequest, res: Response) {
  try {
    const { job_id } = req.body;
    const worker = await db('workers').where({ user_id: req.userId }).select('id').first();
    if (!worker) {
      return res.status(400).json({ error: 'Worker profile not found' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const photos: string[] = [];
    const videos: string[] = [];

    if (files?.photos) {
      for (const file of files.photos) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          photos.push(await uploadBuffer(file.buffer, 'bricksy/photos'));
        } else {
          photos.push(file.originalname);
        }
      }
    }

    if (files?.videos) {
      for (const file of files.videos) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          videos.push(await uploadBuffer(file.buffer, 'bricksy/videos'));
        } else {
          videos.push(file.originalname);
        }
      }
    }

    const [record] = await db('progress').insert({
      job_id, worker_id: worker.id, photos: photos.join(','), videos: videos.join(','),
      upload_date: new Date().toISOString().split('T')[0],
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
