import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ApiKey } from '../types';
import crypto from 'crypto';

const API_KEYS_COLLECTION = 'apiKeys';

// Generate a random API key (format: oc_live_xxxxx...)
function generateRandomKey(): string {
    const randomBytes = crypto.randomBytes(32);
    return `oc_live_${randomBytes.toString('hex')}`;
}

// Hash an API key using SHA-256
function hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

export const apiKeyService = {
    /**
     * Generate a new API key for an agent
     * Returns the plaintext key (only shown once!)
     */
    async generateApiKey(agentId: string, name: string): Promise<{ key: string; keyDoc: ApiKey }> {
        const plaintextKey = generateRandomKey();
        const keyHash = hashKey(plaintextKey);

        const apiKeysRef = collection(db, API_KEYS_COLLECTION);
        const now = Timestamp.now();

        const newKey: Omit<ApiKey, 'id'> = {
            agentId,
            keyHash,
            name,
            createdAt: now,
            isActive: true,
        };

        const docRef = await addDoc(apiKeysRef, newKey);

        return {
            key: plaintextKey,
            keyDoc: { id: docRef.id, ...newKey }
        };
    },

    /**
     * Validate an API key and return the associated agent ID
     */
    async validateApiKey(plaintextKey: string): Promise<{ valid: boolean; agentId?: string; keyId?: string }> {
        const keyHash = hashKey(plaintextKey);
        const apiKeysRef = collection(db, API_KEYS_COLLECTION);

        const q = query(
            apiKeysRef,
            where('keyHash', '==', keyHash),
            where('isActive', '==', true)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { valid: false };
        }

        const keyDoc = snapshot.docs[0];
        const keyData = keyDoc.data() as ApiKey;

        // Update lastUsedAt
        await updateDoc(doc(db, API_KEYS_COLLECTION, keyDoc.id), {
            lastUsedAt: Timestamp.now()
        });

        return {
            valid: true,
            agentId: keyData.agentId,
            keyId: keyDoc.id
        };
    },

    /**
     * Revoke (deactivate) an API key
     */
    async revokeApiKey(keyId: string): Promise<void> {
        const keyRef = doc(db, API_KEYS_COLLECTION, keyId);
        await updateDoc(keyRef, { isActive: false });
    },

    /**
     * Get all API keys for an agent
     */
    async getKeysForAgent(agentId: string): Promise<ApiKey[]> {
        const apiKeysRef = collection(db, API_KEYS_COLLECTION);
        const q = query(apiKeysRef, where('agentId', '==', agentId));

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiKey));
    },

    /**
     * Helper to authenticate a Request using x-api-key header
     */
    async authenticateRequest(req: Request): Promise<{ valid: boolean; agentId?: string; keyId?: string; error?: string }> {
        const apiKey = req.headers.get('x-api-key');

        if (!apiKey) {
            return { valid: false, error: 'Missing x-api-key header' };
        }

        const result = await this.validateApiKey(apiKey);
        if (!result.valid) {
            return { valid: false, error: 'Invalid or inactive API key' };
        }

        return result;
    }
};
