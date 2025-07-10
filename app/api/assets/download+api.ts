import { z } from 'zod';
import { assetService } from '@/lib/services/asset-service';

const downloadParamsSchema = z.object({
  url: z.string().url('Valid URL is required'),
  filename: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'original']).optional(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { url, filename } = downloadParamsSchema.parse(body);
    
    // Download the asset
    const blob = await assetService.downloadImage(url, filename);
    
    // Convert blob to array buffer for response
    const arrayBuffer = await blob.arrayBuffer();
    
    // Determine content type from the blob or URL
    const contentType = blob.type || 'application/octet-stream';
    const extension = url.split('.').pop()?.toLowerCase() || 'file';
    const downloadFilename = filename || `asset-${Date.now()}.${extension}`;
    
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': String(arrayBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error('Asset download error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: 'Invalid parameters',
        details: error.errors,
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Asset download failed',
    }, { status: 500 });
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const downloadParams = Object.fromEntries(url.searchParams.entries());
    
    const { url: assetUrl, filename } = downloadParamsSchema.parse(downloadParams);
    
    // Download the asset
    const blob = await assetService.downloadImage(assetUrl, filename);
    
    // Convert blob to array buffer for response
    const arrayBuffer = await blob.arrayBuffer();
    
    // Determine content type from the blob or URL
    const contentType = blob.type || 'application/octet-stream';
    const extension = assetUrl.split('.').pop()?.toLowerCase() || 'file';
    const downloadFilename = filename || `asset-${Date.now()}.${extension}`;
    
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': String(arrayBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error('Asset download error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: 'Invalid parameters',
        details: error.errors,
      }, { status: 400 });
    }
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Asset download failed',
    }, { status: 500 });
  }
} 