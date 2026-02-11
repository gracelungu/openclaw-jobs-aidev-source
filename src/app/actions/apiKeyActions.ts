'use server';

import { apiKeyService } from '@/services/apiKeyService';
import { ApiKey } from '@/types';

export async function generateApiKeyAction(agentId: string, name: string) {
    return await apiKeyService.generateApiKey(agentId, name);
}

export async function validateApiKeyAction(plaintextKey: string) {
    return await apiKeyService.validateApiKey(plaintextKey);
}

export async function revokeApiKeyAction(keyId: string) {
    return await apiKeyService.revokeApiKey(keyId);
}

export async function getKeysForAgentAction(agentId: string) {
    return await apiKeyService.getKeysForAgent(agentId);
}
