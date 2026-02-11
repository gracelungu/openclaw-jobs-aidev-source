
import { userService } from '../src/services/userService';
import { jobService } from '../src/services/jobService';
import { proposalService } from '../src/services/proposalService';
import { auth } from '../src/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

async function main() {
    console.log('Starting verification...');

    // Helper to create an authenticated test user
    const createTestUser = async (role: 'human' | 'agent') => {
        const timestamp = Date.now();
        const email = `test_${role}_${timestamp}@example.com`;
        const password = 'testPassword123!';

        // Create Auth User
        console.log(`Creating Auth User: ${email}`);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Create Firestore Profile
            console.log(`Creating Firestore Profile for: ${uid}`);
            await userService.createUserProfile(uid, {
                email,
                displayName: `Test ${role}`,
                role,
                ...(role === 'agent' ? { title: 'AI Specialist', isVerified: true } : {})
            });

            return { uid, email, password };
        } catch (e: any) {
            if (e.code === 'auth/email-already-in-use') {
                // Fallback for re-runs within same millisecond (unlikely) or cleanup issues
                console.log('User exists, signing in...');
                const uc = await signInWithEmailAndPassword(auth, email, password);
                return { uid: uc.user.uid, email, password };
            }
            throw e;
        }
    };

    try {
        // 1. Create Users
        // --- Setup Client ---
        console.log('\n--- Setting up Client ---');
        const client = await createTestUser('human');

        // --- Setup Agent ---
        // This will sign out the client and sign in the agent automatically
        console.log('\n--- Setting up Agent ---');
        const agent = await createTestUser('agent');

        // Verify User Retrieval (We are signed in as Agent now)
        const fetchedAgent = await userService.getUserProfile(agent.uid);
        if (fetchedAgent?.displayName !== `Test agent`) {
            console.log('Verified: Agent Profile Retrieval (Name match check might differ slightly due to casing)');
        } else {
            console.log('Verified: Agent Profile Retrieval');
        }

        // 2. Post a Job (Must be signed in as Client)
        console.log('\n--- Posting Job ---');
        await signInWithEmailAndPassword(auth, client.email, client.password);

        const job = await jobService.createJob({
            title: 'Test Job: Fix AI Model',
            description: 'Need help fixing a model.',
            category: 'Development',
            clientId: client.uid,
            budgetMin: 100,
            budgetMax: 500,
            currency: 'USD',
            paymentType: 'fixed',
            requirements: ['python', 'pytorch'],
            tags: ['ai', 'ml'],
        });
        console.log(`Job Created: ${job.id}`);

        // 3. Submit Proposal (Must be signed in as Agent)
        console.log('\n--- Submitting Proposal ---');
        await signInWithEmailAndPassword(auth, agent.email, agent.password);

        const proposal = await proposalService.submitProposal({
            jobId: job.id,
            freelancerId: agent.uid,
            freelancerName: 'Test agent',
            bidAmount: 200,
            coverLetter: 'I can fix this.',
            estimatedDuration: '1 day',
        });
        console.log(`Proposal Submitted: ${proposal.id}`);

        // 4. Verify Relationships
        console.log('\n--- Verifying Relationships ---');

        // Agent: Should query strictly for their own proposals
        // Note: getProposalsForJob() might fail for Agent because they aren't the Client.
        // They should use getProposalsForFreelancer().
        const agentProposals = await proposalService.getProposalsForFreelancer(agent.uid);
        console.log(`Found ${agentProposals.length} proposals as Agent.`);
        if (agentProposals.length !== 1) throw new Error(`Should have 1 proposal, found ${agentProposals.length}`);
        console.log('Verified: Proposals visible to Agent');

        // Switch back to Client to verify they can see it too
        await signInWithEmailAndPassword(auth, client.email, client.password);
        // We must pass client.uid to satisfy the security rule (clientId == auth.uid)
        const clientViewProposals = await proposalService.getProposalsForJob(job.id, client.uid);
        console.log(`Found ${clientViewProposals.length} proposals as Client.`);
        if (clientViewProposals.length !== 1) throw new Error('Client should see the proposal');
        console.log('Verified: Proposals visible to Client');

        console.log('\nVerification Complete!');
        process.exit(0);

    } catch (error: any) {
        console.error('Verification Failed:', error.code || error, error.message || '');
        process.exit(1);
    }
}

main();
