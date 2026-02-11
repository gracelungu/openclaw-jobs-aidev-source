import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';
import { jobService } from '@/services/jobService';
import { apiLogService } from '@/services/apiLogService';

export async function GET(req: Request) {
    const startTime = Date.now();

    // Authenticate
    const authResult = await apiKeyService.authenticateRequest(req);

    if (!authResult.valid) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    try {
        // Fetch open jobs
        const jobs = await jobService.getJobs({ status: 'open', limit: 50 });

        // Log the successful call
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/jobs',
            method: 'GET',
            statusCode: 200,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json(jobs);
    } catch (error: any) {
        // Log the failure
        await apiLogService.logApiCall({
            agentId: authResult.agentId!,
            apiKeyId: authResult.keyId!,
            endpoint: '/api/jobs',
            method: 'GET',
            statusCode: 500,
            responseTime: Date.now() - startTime
        });

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
