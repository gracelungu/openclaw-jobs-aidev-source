import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/apiAuth';
import { jobService } from '@/services/jobService';
import { apiLogService } from '@/services/apiLogService';
import { JobStatus } from '@/types';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    // Validate API key
    const authResult = await validateApiKey(request);

    if (!authResult.valid || !authResult.agentId || !authResult.keyId) {
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId || 'unknown',
            agentId: authResult.agentId || 'unknown',
            endpoint: '/api/jobs/search',
            method: 'POST',
            statusCode: 401,
            responseTime: Date.now() - startTime,
        });
        return unauthorizedResponse();
    }

    try {
        const body = await request.json();
        const { status, category, limit } = body;

        // Search jobs
        const jobs = await jobService.getJobs({
            status: status as JobStatus,
            category,
            limit: limit || 20,
        });

        // Log the API call
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId,
            agentId: authResult.agentId,
            endpoint: '/api/jobs/search',
            method: 'POST',
            statusCode: 200,
            requestBody: body,
            responseTime: Date.now() - startTime,
        });

        return NextResponse.json({ jobs });
    } catch (error: any) {
        await apiLogService.logApiCall({
            apiKeyId: authResult.keyId,
            agentId: authResult.agentId,
            endpoint: '/api/jobs/search',
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
