import { z } from 'zod';
import { db } from '../../../lib/db';
import { users } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserFromRequest } from '../../../lib/auth/middleware';

const syncUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// POST /api/auth/sync - Sync Supabase Auth user to our database
export async function POST(request: Request): Promise<Response> {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user exists in our database
    const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    
    if (existingUser[0]) {
      // User exists, return existing user
      return new Response(JSON.stringify({ user: existingUser[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse optional body for additional user info
    let additionalInfo: { firstName?: string; lastName?: string } = {};
    try {
      const body = await request.json();
      additionalInfo = syncUserSchema.parse(body);
    } catch {
      // If no body or invalid body, use defaults
    }

    // Create user in our database
    const newUser = await db.insert(users).values({
      id: user.id,
      email: user.email!,
      firstName: additionalInfo.firstName || user.user_metadata?.firstName || null,
      lastName: additionalInfo.lastName || user.user_metadata?.lastName || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return new Response(JSON.stringify({ user: newUser[0] }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('User sync error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 