import axios, { Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getORM } from '../../../src/lib/mikroorm';
import { RequestHistory } from '../../../src/entities/RequestHistory';

interface ExecuteRequestBody {
  method: Method;
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { method, url, headers, body } = req.body as ExecuteRequestBody;

  if (!url || !method) {
    return res.status(400).json({ error: 'URL and Method are required' });
  }

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      validateStatus: () => true,
      timeout: 30000, // 30s timeout to prevent hanging
    });

    const orm = await getORM();
    const em = orm.em.fork();

    const history = em.create(RequestHistory, {
      method,
      url,
      headers,
      body,
      status: response.status,
      response: response.data,
    });

    await em.persistAndFlush(history);

    res.json({
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
  } catch (error: any) {
    console.error('Execute API Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
