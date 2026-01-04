import { NextResponse } from 'next/server';
import { NameSchema } from '@/schemas/request.schema';

export async function GET() {
  return NextResponse.json(
    { message: 'Hello from the secure GET endpoint.' },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const parsed = NameSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name } = parsed.data;

  return NextResponse.json(
    { message: `Hello ${name}, from the secure POST endpoint.` },
    { status: 200 }
  );
}
