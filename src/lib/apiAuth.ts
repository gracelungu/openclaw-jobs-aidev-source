import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';

export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; agentId?: string; keyId?: string }> {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    return await apiKeyService.validateApiKey(token);
}

export function unauthorizedResponse() {
    return NextResponse.json(
        { error: 'Unauthorized. Please provide a valid API key.' },
        { status: 401 }
    );
}
