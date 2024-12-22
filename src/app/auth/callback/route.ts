import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const oauth_token = searchParams.get('oauth_token');
  const oauth_verifier = searchParams.get('oauth_verifier');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error) {
    console.error('Twitter OAuth Error:', { error, error_description });
    return NextResponse.redirect(new URL('/auth/error', req.url));
  }

  console.log('Twitter OAuth Callback:', { oauth_token, oauth_verifier });
  return NextResponse.redirect(new URL('/', req.url));
} 