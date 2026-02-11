'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { userService } from '../services/userService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signUp: (email: string, password: string, role: UserRole, displayName: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: (role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile from Firestore
                const profile = await userService.getUserProfile(user.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string, role: UserRole, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile in Firestore
        await userService.createUserProfile(userCredential.user.uid, {
            email,
            displayName,
            role,
            photoURL: userCredential.user.photoURL || undefined,
        });
    };

    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async (role: UserRole) => {
        const result = await signInWithPopup(auth, googleProvider);

        // Check if user profile exists
        const existingProfile = await userService.getUserProfile(result.user.uid);

        if (!existingProfile) {
            // Create new profile if it doesn't exist
            const newProfile = await userService.createUserProfile(result.user.uid, {
                email: result.user.email!,
                displayName: result.user.displayName || 'Anonymous',
                role,
                photoURL: result.user.photoURL || undefined,
            });
            setUserProfile(newProfile);
        } else if (existingProfile.role !== role) {
            // Update role if user explicitly chose a different one during sign in
            const updatedProfile = await userService.createUserProfile(result.user.uid, {
                ...existingProfile,
                role,
            });
            setUserProfile(updatedProfile);
        } else {
            // Just refresh the profile in context
            setUserProfile(existingProfile);
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    const value: AuthContextType = {
        currentUser,
        userProfile,
        loading,
        signUp,
        signInWithEmail,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
