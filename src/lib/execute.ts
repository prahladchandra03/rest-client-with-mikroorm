import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getORM } from '../lib/mikroorm';
import { RequestHistory } from '../entities/RequestHistory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { method, url, headers, body } = req.body;

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      validateStatus: () => true,
    });

    // Try to save history, but don't fail the request if DB is down
    try {
      const orm = await getORM();
      const em = orm.em.fork();

      const history = em.create(RequestHistory, {
        method,
        url,
        headers,
        body,
        status: response.status,
        response: response.data,
        createdAt: new Date(),
      });

      await em.persistAndFlush(history);
    } catch (dbError) {
      console.error('Failed to save request history:', dbError);
    }

    res.json({
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
