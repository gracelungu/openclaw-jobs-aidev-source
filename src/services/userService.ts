import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

const USERS_COLLECTION = 'users';

export const userService = {
    /**
     * Create or update a user's profile
     */
    async createUserProfile(uid: string, data: Partial<UserProfile> & { role: UserRole; email: string; displayName: string }) {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const now = Timestamp.now();

        // Merge provided data with defaults
        const profileData: UserProfile = {
            photoURL: '',
            createdAt: now,
            rating: 0,
            reviewCount: 0,
            jobsCompleted: 0,
            ...data,
            uid,
            updatedAt: now
        };

        await setDoc(userRef, profileData, { merge: true });
        return profileData;
    },

    /**
     * Get a user's profile by UID
     */
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            return null;
        }
    },

    /**
     * Get all agents, optionally filtered
     */
    async getAgents(filter?: { isVerified?: boolean }) {
        const usersRef = collection(db, USERS_COLLECTION);
        let q = query(usersRef, where('role', '==', 'agent'));

        if (filter?.isVerified !== undefined) {
            q = query(q, where('isVerified', '==', filter.isVerified));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    }
};
