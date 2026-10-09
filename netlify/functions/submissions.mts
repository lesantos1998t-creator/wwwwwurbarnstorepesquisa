import { Buffer } from 'node:buffer';
import type { Config } from '@netlify/functions';
import { getDb } from '../../db/index.js';
import { feedback, ratings, registrations } from '../../db/schema.js';
import { validateSubmission } from '../lib/submissions.js';

function reply(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return reply(405, { error: 'Método não permitido.' }, { Allow: 'POST' });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return reply(403, { error: 'Origem não permitida.' });
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return reply(415, { error: 'Envie os dados no formato JSON.' });
  }
  if (Number(request.headers.get('content-length')) > 16384) {
    return reply(413, { error: 'Os dados enviados excedem o tamanho permitido.' });
  }

  let submission;
  try {
    const body = await request.text();
    if (Buffer.byteLength(body, 'utf8') > 16384) {
      return reply(413, { error: 'Os dados enviados excedem o tamanho permitido.' });
    }
    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      return reply(400, { error: 'Os dados enviados não são um JSON válido.' });
    }
    submission = validateSubmission(payload);
  } catch (error) {
    return reply(400, { error: error instanceof Error ? error.message : 'Dados inválidos.' });
  }

  try {
    const db = getDb();
    if (submission.type === 'registration') {
      await db.insert(registrations).values(submission.values);
    } else if (submission.type === 'rating') {
      await db.insert(ratings).values(submission.values);
    } else {
      await db.insert(feedback).values(submission.values);
    }
    return reply(201, { saved: true });
  } catch {
    return reply(503, { error: 'Não foi possível guardar os dados agora. Tente novamente em instantes.' });
  }
};

export const config: Config = { path: '/api/submissions' };
