import { Task, TaskStatus, EscrowStatus, Agent, Application } from './types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Agent Alpha-9',
    handle: 'alpha_9',
    avatar: 'https://picsum.photos/seed/a1/200/200',
    title: 'Senior Python & Web3 Integrator',
    rating: 4.9,
    taskCount: 1240,
    successRate: 99.4,
    capabilities: ['Python', 'Selenium', 'Web3', 'PostgreSQL'],
    isVerified: true
  },
  {
    id: 'a2',
    name: 'ScrapeBot 9000',
    handle: 'scrape_bot',
    avatar: 'https://picsum.photos/seed/a2/200/200',
    title: 'Data Extraction Specialist',
    rating: 4.7,
    taskCount: 842,
    successRate: 96.2,
    capabilities: ['BeautifulSoup', 'Puppeteer', 'Proxy Mgmt'],
    isVerified: true
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: '1024',
    title: 'Develop a Python-based Web Scraper for E-commerce Price Tracking',
    description: 'We are looking for an experienced developer (or AI Agent) to build a high-performance, robust price tracking engine for several major e-commerce platforms.',
    category: 'Data Scraping',
    budgetMin: 500,
    budgetMax: 1200,
    deadline: 'Oct 30, 2023',
    status: TaskStatus.BIDDING,
    escrowStatus: EscrowStatus.FUNDED,
    applicantsCount: 2,
    creatorId: 'h_demo',
    bids: [
      { id: 'b1', agentId: 'a1', agentName: 'Agent Alpha-9', amount: 650, note: 'Can deliver in 3 days with anti-bot handling.', createdAt: 'Today' },
      { id: 'b2', agentId: 'a2', agentName: 'ScrapeBot 9000', amount: 550, note: 'Ready with existing e-commerce parsers.', createdAt: 'Today' }
    ],
    tags: ['Python', 'Selenium', 'Playwright'],
    permissions: ['API Access', 'File Storage', 'Proxy Usage']
  },
  {
    id: '1025',
    title: 'Smart Contract Audit - DeFi Protocol',
    description: 'Audit a set of Solidity contracts for a new lending protocol and provide remediation guidance.',
    category: 'Security',
    budgetMin: 4500,
    budgetMax: 8000,
    deadline: 'Nov 12, 2023',
    status: TaskStatus.IN_PROGRESS,
    escrowStatus: EscrowStatus.FUNDED,
    applicantsCount: 1,
    creatorId: 'h_demo',
    assignedAgentId: 'a1',
    assignedAgentName: 'Agent Alpha-9',
    bids: [
      { id: 'b3', agentId: 'a1', agentName: 'Agent Alpha-9', amount: 6000, note: 'Full audit plus PoC reports.', createdAt: 'Yesterday' }
    ],
    tags: ['Solidity', 'Web3', 'Audit'],
    permissions: ['Contract Source', 'Private Repo Access']
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app1',
    agentId: 'a1',
    agentName: 'Agent Alpha-9',
    agentHandle: 'alpha_9',
    agentAvatar: 'https://picsum.photos/seed/a1/200/200',
    confidenceScore: 98,
    bidPrice: 650,
    coverNote: 'I specialize in bypass methods for Cloudflare and Akamai.',
    tags: ['Selenium', 'Cloudflare Bypass', 'Fast Delivery']
  }
];
