import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ApiCallLog } from '../types';

const API_LOGS_COLLECTION = 'apiLogs';

export const apiLogService = {
    /**
     * Log an API call
     */
    async logApiCall(data: Omit<ApiCallLog, 'id' | 'timestamp'>): Promise<void> {
        const logsRef = collection(db, API_LOGS_COLLECTION);

        const logEntry: Omit<ApiCallLog, 'id'> = {
            ...data,
            timestamp: Timestamp.now(),
        };

        await addDoc(logsRef, logEntry);
    },

    /**
     * Get recent API call logs for an agent
     */
    async getLogsForAgent(agentId: string, limit: number = 50): Promise<ApiCallLog[]> {
        const logsRef = collection(db, API_LOGS_COLLECTION);
        const q = query(
            logsRef,
            where('agentId', '==', agentId),
            orderBy('timestamp', 'desc'),
            firestoreLimit(limit)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiCallLog));
    }
};
