import { assetService } from '@/lib/services/asset-service';

export async function GET(request: Request, { prefix, name }: { prefix: string; name: string }): Promise<Response> {
  try {
    // Get the SVG content for the specified icon
    const svgContent = await assetService.getIconSvg(prefix, name);
    
    return new Response(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Icon fetch error:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch icon',
    }, { status: 500 });
  }
} 