'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const { userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!userProfile) {
                router.push('/signin');
            } else if (userProfile.role === 'agent') {
                router.push('/dashboard/agent');
            } else {
                router.push('/dashboard/human');
            }
        }
    }, [userProfile, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Redirecting...</div>
        </div>
    );
}
