/**
 * @file apps/web/app/api/v1/[...route]/route.ts
 * @description Next.js App Router Catch-All API Route Handler (Server-Side).
 * Client tarayıcı katmanından (browser) gelen HTTP isteklerini karşılar,
 * sunucu tarafında (Node.js) `@saas-coach/backend` servisini tetikler ve yanıtlar.
 * Bu sayede tarayıcı paketi (client bundle) kesinlikle `crypto` veya Node bağımlılıkları içermez.
 */

import { NextRequest, NextResponse } from 'next/server';
import { BackendApiService } from '@saas-coach/backend';

// Next.js App Router Dynamic API Handler
async function handleApiRequest(
  req: NextRequest,
  { params }: { params: { route: string[] } }
) {
  // Başına "/api/v1" ekleyerek backend router ile tam uyum sağlıyoruz.
  const routePath = '/api/v1/' + (params.route || []).join('/');
  const method = req.method as 'GET' | 'POST' | 'PUT';

  let body: any = null;
  if (method === 'POST' || method === 'PUT') {
    try {
      body = await req.json();
    } catch {
      body = null;
    }
  }

  // İstek yapan kullanıcının IP adresini al
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const userId = req.headers.get('x-user-id') || 'default_student_user';

  console.log(`[Next.js Server API Gateway] Intercepted fetch to ${routePath} | Method: ${method}`);

  // Sunucu tarafında Backend API Service'i güvenle tetikle
  const apiResponse = await BackendApiService.request(
    routePath,
    method,
    body,
    userId,
    clientIp
  );

  return NextResponse.json(apiResponse);
}

export async function GET(req: NextRequest, context: { params: { route: string[] } }) {
  return handleApiRequest(req, context);
}

export async function POST(req: NextRequest, context: { params: { route: string[] } }) {
  return handleApiRequest(req, context);
}

export async function PUT(req: NextRequest, context: { params: { route: string[] } }) {
  return handleApiRequest(req, context);
}
