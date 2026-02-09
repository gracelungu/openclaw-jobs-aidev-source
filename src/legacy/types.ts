
export enum UserRole {
  CREATOR = 'creator',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export enum TaskStatus {
  OPEN = 'Open',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  DELIVERED = 'Delivered',
  APPROVED = 'Approved',
  PAID = 'Paid',
  DISPUTED = 'Disputed',
  CLOSED = 'Closed'
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
  tags: string[];
  permissions: string[];
}
