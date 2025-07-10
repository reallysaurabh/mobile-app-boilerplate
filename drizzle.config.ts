import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
  const envLines = envFile.split('\n');
  
  for (const line of envLines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        process.env[key] = valueParts.join('=');
      }
    }
  }
} catch (error) {
  console.warn('Could not load .env.local file:', error);
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}); 