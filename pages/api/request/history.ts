import type { NextApiRequest, NextApiResponse } from 'next';
import { getORM } from '../../../src/lib/mikroorm';
import { RequestHistory } from '../../../src/entities/RequestHistory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const orm = await getORM();
    const em = orm.em.fork();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [data, total] = await em.findAndCount(RequestHistory, {}, {
      offset,
      limit,
      orderBy: { createdAt: 'DESC' },
    });

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('History API Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
