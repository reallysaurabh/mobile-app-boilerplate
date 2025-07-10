// This endpoint is not needed as Supabase Auth handles registration
// Users register through Supabase Auth on the frontend
// After registration, they call /api/auth/sync to sync to our database

export async function POST(): Promise<Response> {
  return new Response(JSON.stringify({ 
    error: 'Use Supabase Auth for registration. Call /api/auth/sync after authentication.' 
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
} 