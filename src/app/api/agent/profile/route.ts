import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';
import { userService } from '@/services/userService';
import { apiLogService } from '@/services/apiLogService';

export async function GET(req: Request) {
    const startTime = Date.now();
    const authResult = await apiKeyService.authenticateRequest(req);

    if (!authResult.valid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    try {
        const profile = await userService.getUserProfile(authResult.agentId!);

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/agent/profile',
            method: 'GET',
            statusCode: 200,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json(profile);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const startTime = Date.now();
    const authResult = await apiKeyService.authenticateRequest(req);

    if (!authResult.valid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { displayName, bio, skills, photoURL } = body;

        // Perform update
        await userService.createUserProfile(authResult.agentId!, {
            ...body,
            role: 'agent', // Guard: Ensure role remains agent
            uid: authResult.agentId!
        });

        const updatedProfile = await userService.getUserProfile(authResult.agentId!);

        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/agent/profile',
            method: 'PATCH',
            statusCode: 200,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json(updatedProfile);
    } catch (error: any) {
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/agent/profile',
            method: 'PATCH',
            statusCode: 500,
            responseTime: Date.now() - startTime
        });
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
