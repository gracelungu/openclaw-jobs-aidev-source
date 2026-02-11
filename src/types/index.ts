
import { Timestamp } from 'firebase/firestore';

// -- Users --
export type UserRole = 'human' | 'agent';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    createdAt: Timestamp;
    updatedAt: Timestamp;

    // Specific to Agents / Freelancers
    title?: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
    isVerified?: boolean;
    onlineStatus?: 'online' | 'offline';
    agentId?: string; // e.g., ALXR-88219

    // External Tool Integrations
    integrations?: {
        github?: { connected: boolean; username?: string };
        openai?: { connected: boolean };
        stripe?: { connected: boolean; status?: string };
        discord?: { connected: boolean };
    };

    // Payment & Billing
    billing?: {
        preferredCurrency: 'USD' | 'EUR' | 'BTC';
        payoutMethod?: {
            type: 'visa' | 'mastercard' | 'crypto';
            last4?: string;
            expiry?: string;
        };
    };

    // Stats (Denormalized)
    rating: number;
    reviewCount: number;
    jobsCompleted: number;
}

// -- Jobs --
export type JobStatus =
    | 'open'
    | 'bidding'
    | 'assigned'
    | 'in_progress'
    | 'review'
    | 'completed'
    | 'cancelled';

export type PaymentType = 'fixed' | 'hourly';

export interface Job {
    id: string;
    title: string;
    description: string;
    category: string;

    // Budget & Payment
    paymentType: PaymentType;
    budgetMin?: number;
    budgetMax?: number;
    currency: string;

    // Status Tracking
    status: JobStatus;

    // Relationships
    clientId: string;       // Ref to users/{uid} (Creator)
    freelancerId?: string;  // Ref to users/{uid} (Assigned Agent/Human)

    // Metadata
    tags: string[];
    requirements?: string[];
    permissions?: string[];
    attachments?: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    deadline?: Timestamp;

    // Metrics (Denormalized)
    proposalCount: number;
}

// -- Proposals --
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Proposal {
    id: string;
    jobId: string;
    clientId: string; // Denormalized for security rules (allows "list" queries by client)
    freelancerId: string; // Ref to users/{uid}

    // Snapshot for list views to avoid extra reads
    freelancerName: string;
    freelancerAvatar?: string;

    coverLetter: string;
    bidAmount: number;
    estimatedDuration: string;

    status: ProposalStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// -- Reviews --
export interface Review {
    id: string;
    jobId: string;
    reviewerId: string;
    subjectId: string;

    rating: number; // 1-5
    comment: string;

    createdAt: Timestamp;
}

// -- API Keys (for Agents) --
export interface ApiKey {
    id: string;
    agentId: string; // Ref to users/{uid}
    keyHash: string; // SHA-256 hash of the actual key
    name: string; // User-friendly name for the key
    createdAt: Timestamp;
    lastUsedAt?: Timestamp;
    isActive: boolean;
}

// -- API Call Logs --
export interface ApiCallLog {
    id: string;
    apiKeyId: string; // Ref to apiKeys/{id}
    agentId: string; // Denormalized for easier querying
    endpoint: string; // e.g., "/api/jobs/search"
    method: string; // GET, POST, etc.
    statusCode: number;
    timestamp: Timestamp;
    requestBody?: any; // Optional: store request payload
    responseTime: number; // milliseconds
}
// -- Services (Agent Offerings) --
export interface ServiceTier {
    name: string; // Basic, Standard, Premium
    description: string;
    deliveryTime: number; // in days
    revisions: number; // or -1 for unlimited
    features: string[];
    price: number;
    hasCloudHosting?: boolean;
}

export interface AgentService {
    id: string;
    agentId: string; // Ref to users/{uid}
    agentIdentifier?: string; // Custom ID like ALXR-88219
    agentName: string;
    agentAvatar?: string;
    title: string;
    description: string;
    category: string;
    tags: string[];

    // Pricing
    tiers: {
        basic: ServiceTier;
        standard?: ServiceTier;
        premium?: ServiceTier;
    };
    useTiers: boolean; // false if only basic is used

    // Media
    mainImage: string;
    gallery: string[];
    videoUrl?: string;

    // Stats
    rating: number;
    reviewCount: number;
    orderCount: number;

    status: 'draft' | 'active' | 'paused';
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
