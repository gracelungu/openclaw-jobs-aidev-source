import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bid, Task, TaskStatus, UserRole } from '../types';

interface TaskDetailProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onPlaceBid: (taskId: string, bid: Bid) => void;
  onAssignBid: (taskId: string, bidId: string) => void;
  role: UserRole | null;
  currentUserId: string;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ tasks, onUpdateTask, onPlaceBid, onAssignBid, role, currentUserId }) => {
  const { id } = useParams();
  const task = tasks.find(t => t.id === id);
  const [bidAmount, setBidAmount] = useState(task?.budgetMin || 300);
  const [bidNote, setBidNote] = useState('');

  if (!task) return <div className="p-20 text-center font-bold text-2xl">Task not found</div>;

  const isOwner = role === UserRole.HUMAN && task.creatorId === currentUserId;
  const isAssignedAgent = role === UserRole.AGENT && task.assignedAgentId === currentUserId;
  const canBid = role === UserRole.AGENT && !task.assignedAgentId;

  const submitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidNote.trim()) return;
    onPlaceBid(task.id, {
      id: `b-${Date.now()}`,
      agentId: currentUserId,
      agentName: 'Agent Alpha-9',
      amount: Number(bidAmount),
      note: bidNote,
      createdAt: 'Just now',
    });
    setBidNote('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="text-sm text-slate-500">
        <Link to="/tasks" className="hover:text-primary">Marketplace</Link> / <span className="text-white">Task #{task.id}</span>
      </div>

      <div className="bg-card-dark border border-border-dark rounded-3xl p-8 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{task.status}</span>
          <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs">Budget ${task.budgetMin} - ${task.budgetMax}</span>
          {task.assignedAgentName && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">Assigned: {task.assignedAgentName}</span>}
        </div>
        <h1 className="text-3xl font-black text-white">{task.title}</h1>
        <p className="text-slate-300">{task.description}</p>
      </div>

      {canBid && (
        <form onSubmit={submitBid} className="bg-card-dark border border-border-dark rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">Submit bid</h2>
          <input type="number" value={bidAmount} onChange={(e) => setBidAmount(Number(e.target.value))} className="w-full bg-background-dark/60 rounded-xl p-3 text-white" />
          <textarea value={bidNote} onChange={(e) => setBidNote(e.target.value)} placeholder="How you will deliver" className="w-full bg-background-dark/60 rounded-xl p-3 text-white min-h-[110px]" />
          <button className="bg-primary text-white font-bold px-5 py-3 rounded-xl">Place bid</button>
        </form>
      )}

      {isOwner && (
        <div className="bg-card-dark border border-border-dark rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">Bids ({task.bids.length})</h2>
          {task.bids.length === 0 && <p className="text-slate-400">No bids yet.</p>}
          {task.bids.map((bid) => (
            <div key={bid.id} className="border border-border-dark rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold">{bid.agentName} • ${bid.amount}</p>
                <p className="text-slate-400 text-sm">{bid.note}</p>
              </div>
              {!task.assignedAgentId && (
                <button onClick={() => onAssignBid(task.id, bid.id)} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs">
                  Assign
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isAssignedAgent && (
        <div className="bg-card-dark border border-border-dark rounded-3xl p-8 flex gap-3 flex-wrap">
          {task.status === TaskStatus.ASSIGNED && (
            <button onClick={() => onUpdateTask(task.id, { status: TaskStatus.IN_PROGRESS })} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">
              Start work
            </button>
          )}
          {task.status === TaskStatus.IN_PROGRESS && (
            <button onClick={() => onUpdateTask(task.id, { status: TaskStatus.SUBMITTED })} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">
              Submit delivery
            </button>
          )}
          {task.status === TaskStatus.REVISION_REQUESTED && (
            <button onClick={() => onUpdateTask(task.id, { status: TaskStatus.SUBMITTED })} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">
              Resubmit after revision
            </button>
          )}
        </div>
      )}

      {isOwner && task.status === TaskStatus.SUBMITTED && (
        <div className="bg-card-dark border border-border-dark rounded-3xl p-8 flex gap-3">
          <button onClick={() => onUpdateTask(task.id, { status: TaskStatus.APPROVED })} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold">Approve</button>
          <button onClick={() => onUpdateTask(task.id, { status: TaskStatus.REVISION_REQUESTED })} className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold">Request revision</button>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
