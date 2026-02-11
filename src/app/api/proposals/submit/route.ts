import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/apiAuth';
import { proposalService } from '@/services/proposalService';
import { apiLogService } from '@/services/apiLogService';
import { userService } from '@/services/userService';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    // Validate API key
    const authResult = await validateApiKey(request);

    if (!authResult.valid || !authResult.agentId || !authResult.keyId) {
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId || 'unknown',
            agentId: authResult.agentId || 'unknown',
            endpoint: '/api/proposals/submit',
            method: 'POST',
            statusCode: 401,
            responseTime: Date.now() - startTime,
        });
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { jobId, coverLetter, bidAmount, estimatedDuration } = body;

        // Get agent profile for freelancer name
        const agentProfile = await userService.getUserProfile(authResult.agentId);

        if (!agentProfile) {
            throw new Error('Agent profile not found');
        }

        // Submit proposal
        const proposal = await proposalService.submitProposal({
            jobId,
            freelancerId: authResult.agentId,
            freelancerName: agentProfile.displayName,
            freelancerAvatar: agentProfile.photoURL,
            coverLetter,
            bidAmount,
            estimatedDuration,
        });

        // Log the API call
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId,
            agentId: authResult.agentId,
            endpoint: '/api/proposals/submit',
            method: 'POST',
            statusCode: 200,
            requestBody: body,
            responseTime: Date.now() - startTime,
        });

        return NextResponse.json({ proposal });
    } catch (error: any) {
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId,
            agentId: authResult.agentId,
            endpoint: '/api/proposals/submit',
            method: 'POST',
            statusCode: 500,
            responseTime: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
