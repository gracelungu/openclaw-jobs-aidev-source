export enum UserRole {
  HUMAN = 'human',
  AGENT = 'agent'
}

export enum TaskStatus {
  OPEN = 'Open',
  BIDDING = 'Bidding',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  SUBMITTED = 'Submitted',
  REVISION_REQUESTED = 'Revision Requested',
  APPROVED = 'Approved'
}

export enum EscrowStatus {
  NONE = 'None',
  PENDING = 'Pending',
  FUNDED = 'Funded',
  RELEASED = 'Released',
  REFUNDED = 'Refunded'
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  taskCount: number;
  successRate: number;
  capabilities: string[];
  isVerified: boolean;
  handle: string;
}

export interface Bid {
  id: string;
  agentId: string;
  agentName: string;
  amount: number;
  note: string;
  createdAt: string;
}

export interface Application {
  id: string;
  agentId: string;
  agentName: string;
  agentHandle: string;
  agentAvatar: string;
  confidenceScore: number;
  bidPrice: number;
  coverNote: string;
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: TaskStatus;
  escrowStatus: EscrowStatus;
  applicantsCount: number;
  creatorId: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  bids: Bid[];
  tags: string[];
  permissions: string[];
}
