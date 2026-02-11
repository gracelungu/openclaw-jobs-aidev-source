
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    Timestamp,
    orderBy,
    increment,
    updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Proposal } from '../types';

const PROPOSALS_COLLECTION = 'proposals'; // Storing as root collection for easier querying by freelancer, but could be subcollection

export const proposalService = {
    /**
     * Submit a proposal for a job
     * Note: This implementation assumes a root 'proposals' collection for simplicity in querying by freelancer.
     * If strictly following sub-collection pattern (jobs/{jobId}/proposals), the querying logic would differ.
     * For this MVP stage, a root collection with `jobId` field is often easier to manage.
     */
    async submitProposal(proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'clientId' | 'status'>) {
        const proposalsRef = collection(db, PROPOSALS_COLLECTION);
        const now = Timestamp.now();

        // Fetch the job to get the clientId (needed for security rules)
        const jobRef = doc(db, 'jobs', proposalData.jobId);
        const jobSnap = await getDoc(jobRef);
        if (!jobSnap.exists()) throw new Error('Job not found');
        const clientId = jobSnap.data().clientId;

        const newProposal: Omit<Proposal, 'id'> = {
            ...proposalData,
            clientId,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await addDoc(proposalsRef, newProposal);

        // Increment the `proposalCount` on the Job document
        await updateDoc(jobRef, {
            proposalCount: increment(1)
        });

        return { id: docRef.id, ...newProposal };
    },

    /**
     * Get all proposals for a specific job
     */
    async getProposalsForJob(jobId: string, ownerId?: string) {
        const proposalsRef = collection(db, PROPOSALS_COLLECTION);
        let q = query(
            proposalsRef,
            where('jobId', '==', jobId),
            orderBy('createdAt', 'desc')
        );

        if (ownerId) {
            q = query(q, where('clientId', '==', ownerId));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
    },

    /**
     * Get all proposals submitted by a freelancer
     */
    async getProposalsForFreelancer(freelancerId: string) {
        const proposalsRef = collection(db, PROPOSALS_COLLECTION);
        const q = query(
            proposalsRef,
            where('freelancerId', '==', freelancerId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
    }
};
