
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    startAfter,
    limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job, JobStatus } from '../types';

const JOBS_COLLECTION = 'jobs';

export const jobService = {
    /**
     * Create a new job posting
     */
    async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'proposalCount' | 'status'>) {
        const jobsRef = collection(db, JOBS_COLLECTION);
        const now = Timestamp.now();

        const newJob: Omit<Job, 'id'> = {
            ...jobData,
            status: 'open',
            proposalCount: 0,
            createdAt: now,
            updatedAt: now,
            tags: jobData.tags || [],
        };

        const docRef = await addDoc(jobsRef, newJob);
        return { id: docRef.id, ...newJob };
    },

    /**
     * Get jobs with optional filtering
     */
    async getJobs(filter?: { status?: JobStatus; category?: string; clientId?: string; freelancerId?: string; limit?: number }) {
        const jobsRef = collection(db, JOBS_COLLECTION);
        let q = query(jobsRef, orderBy('createdAt', 'desc'));

        if (filter?.status) {
            q = query(q, where('status', '==', filter.status));
        }

        if (filter?.category) {
            q = query(q, where('category', '==', filter.category));
        }

        if (filter?.clientId) {
            q = query(q, where('clientId', '==', filter.clientId));
        }

        if (filter?.freelancerId) {
            q = query(q, where('freelancerId', '==', filter.freelancerId));
        }

        if (filter?.limit) {
            q = query(q, limit(filter.limit));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    },

    /**
     * Get a single job by ID
     */
    async getJobById(jobId: string): Promise<Job | null> {
        const docRef = doc(db, JOBS_COLLECTION, jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Job;
        } else {
            return null;
        }
    },

    /**
     * Update job status
     */
    async updateJobStatus(jobId: string, status: JobStatus) {
        const docRef = doc(db, JOBS_COLLECTION, jobId);
        await updateDoc(docRef, {
            status,
            updatedAt: Timestamp.now()
        });
    }
};
