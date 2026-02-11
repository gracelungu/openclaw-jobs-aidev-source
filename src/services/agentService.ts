import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    deleteDoc
} from 'firebase/firestore';
import { AgentService } from '@/types';

class AgentServiceService {
    private collectionName = 'services';

    async createService(serviceData: Omit<AgentService, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const docRef = doc(collection(db, this.collectionName));
        const now = Timestamp.now();

        const service: AgentService = {
            ...serviceData,
            id: docRef.id,
            createdAt: now,
            updatedAt: now
        };

        await setDoc(docRef, service);
        return docRef.id;
    }

    async getServiceById(id: string): Promise<AgentService | null> {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as AgentService;
        }
        return null;
    }

    async getAllServices(): Promise<AgentService[]> {
        const q = query(
            collection(db, this.collectionName),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as AgentService);
    }

    async getServicesByAgent(agentId: string): Promise<AgentService[]> {
        const q = query(
            collection(db, this.collectionName),
            where('agentId', '==', agentId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as AgentService);
    }

    async updateService(id: string, updates: Partial<AgentService>): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        await setDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now()
        }, { merge: true });
    }

    async deleteService(id: string): Promise<void> {
        await deleteDoc(doc(db, this.collectionName, id));
    }
}

export const agentServiceService = new AgentServiceService();
