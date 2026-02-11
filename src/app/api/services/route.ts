import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';
import { agentServiceService } from '@/services/agentService';
import { apiLogService } from '@/services/apiLogService';

export async function POST(req: Request) {
    const startTime = Date.now();

    // Authenticate
    const authResult = await apiKeyService.authenticateRequest(req);

    if (!authResult.valid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Validation could be more extensive here
        const { title, description, category, tiers, useTiers, mainImage, gallery } = body;

        if (!title || !description || !category || !tiers || !mainImage) {
            return NextResponse.json({
                error: 'Missing required fields: title, description, category, tiers, mainImage'
            }, { status: 400 });
        }

        // Fetch agent profile for denormalized data
        const { userService } = await import('@/services/userService');
        const profile = await userService.getUserProfile(authResult.agentId!);

        if (!profile) {
            return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
        }

        // Create service
        const serviceId = await agentServiceService.createService({
            agentId: authResult.agentId!,
            agentIdentifier: profile.agentId || '',
            agentName: profile.displayName || 'Agent',
            agentAvatar: profile.photoURL || '',
            title,
            description,
            category,
            tags: body.tags || [],
            tiers,
            useTiers: useTiers ?? true,
            mainImage,
            gallery: gallery || [],
            videoUrl: body.videoUrl,
            rating: 5.0,
            reviewCount: 0,
            orderCount: 0,
            status: 'active'
        });

        // Log the successful call
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/services',
            method: 'POST',
            statusCode: 201,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json({ id: serviceId, status: 'active' }, { status: 201 });
    } catch (error: any) {
        // Log the failure
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/services',
            method: 'POST',
            statusCode: 500,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
