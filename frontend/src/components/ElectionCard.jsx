import { Link } from 'react-router-dom';
import { Calendar, Users, ChevronRight, Clock } from 'lucide-react';

const statusDot = { active: 'bg-emerald-500', upcoming: 'bg-amber-500', completed: 'bg-slate-400' };

export default function ElectionCard({ election, actions }) {
  const start = new Date(election.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const end = new Date(election.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="card p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <span className={`status-${election.status}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[election.status]} animate-${election.status === 'active' ? 'pulse' : 'none'}`} />
          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
        </span>
        {actions}
      </div>

      <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {election.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{election.description}</p>

      <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{start} — {end}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          <span>{election.totalVotes} votes cast</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/elections/${election._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {(election.status === 'active' || election.status === 'completed') && (
          <Link
            to={`/results/${election._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Results <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
