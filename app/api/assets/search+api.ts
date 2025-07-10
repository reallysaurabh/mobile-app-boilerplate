import { z } from 'zod';
import { assetService } from '@/lib/services/asset-service';
import { AssetSearchParams } from '@/lib/types/assets';

// Validation schema for search parameters
const searchParamsSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  type: z.enum(['image', 'icon', 'all']).default('all'),
  category: z.string().optional(),
  color: z.string().optional(),
  orientation: z.enum(['landscape', 'portrait', 'square']).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  per_page: z.coerce.number().min(1).max(50).default(20),
  page: z.coerce.number().min(1).default(1),
  safe_search: z.coerce.boolean().default(true),
  min_width: z.coerce.number().optional(),
  min_height: z.coerce.number().optional(),
  style: z.string().optional(),
});

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    // Validate and parse search parameters
    const validatedParams = searchParamsSchema.parse(searchParams);
    
    // Search for assets using the asset service
    const results = await assetService.searchImages(validatedParams as AssetSearchParams);
    
    return Response.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Asset search error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: 'Invalid parameters',
        details: error.errors,
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Asset search failed',
    }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate search parameters from request body
    const validatedParams = searchParamsSchema.parse(body);
    
    // Search for assets using the asset service
    const results = await assetService.searchImages(validatedParams as AssetSearchParams);
    
    return Response.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Asset search error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: 'Invalid parameters',
        details: error.errors,
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Asset search failed',
    }, { status: 500 });
  }
} 