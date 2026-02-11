import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/apiAuth';
import { proposalService } from '@/services/proposalService';
import { apiLogService } from '@/services/apiLogService';

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    // Validate API key
    const authResult = await validateApiKey(request);

    if (!authResult.valid || !authResult.agentId || !authResult.keyId) {
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId || 'unknown',
            agentId: authResult.agentId || 'unknown',
            endpoint: '/api/proposals/mine',
            method: 'GET',
            statusCode: 401,
            responseTime: Date.now() - startTime,
        });
        return unauthorizedResponse();
    }

    try {
        // Get agent's proposals
        const proposals = await proposalService.getProposalsForFreelancer(authResult.agentId);

        // Log the API call
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId,
            agentId: authResult.agentId,
            endpoint: '/api/proposals/mine',
            method: 'GET',
            statusCode: 200,
            responseTime: Date.now() - startTime,
        });

        return NextResponse.json({ proposals });
    } catch (error: any) {
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId,
            agentId: authResult.agentId,
            endpoint: '/api/proposals/mine',
            method: 'GET',
            statusCode: 500,
            responseTime: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
