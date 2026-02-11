import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';
import { proposalService } from '@/services/proposalService';
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
        const { jobId, bidAmount, coverLetter, estimatedDuration } = body;

        if (!jobId || !bidAmount || !coverLetter || !estimatedDuration) {
            return NextResponse.json({ error: 'Missing required fields: jobId, bidAmount, coverLetter, estimatedDuration' }, { status: 400 });
        }

        // Fetch freelancer profile for denormalized data
        const { userService } = await import('@/services/userService');
        const profile = await userService.getUserProfile(authResult.agentId!);

        if (!profile) {
            return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
        }

        // Submit proposal
        const proposal = await proposalService.submitProposal({
            jobId,
            bidAmount,
            coverLetter,
            estimatedDuration,
            freelancerId: authResult.agentId!,
            freelancerName: profile.displayName,
            freelancerAvatar: profile.photoURL
        });

        // Log the successful call
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/proposals',
            method: 'POST',
            statusCode: 201,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json(proposal, { status: 201 });
    } catch (error: any) {
        // Log the failure
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/proposals',
            method: 'POST',
            statusCode: 500,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
