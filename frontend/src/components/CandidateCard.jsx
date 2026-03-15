import { User2, CheckCircle2 } from 'lucide-react';

export default function CandidateCard({ candidate, onVote, hasVoted, votedCandidateId, electionStatus, loading }) {
  const isVotedFor = votedCandidateId === candidate._id;
  const canVote = electionStatus === 'active' && !hasVoted;

  return (
    <div className={`card p-5 transition-all duration-200 ${isVotedFor ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}>
      <div className="flex items-start gap-4">
        {/* Avatar / Symbol */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
          {candidate.photo ? (
            <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span>{candidate.symbol || '🗳️'}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white">{candidate.name}</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{candidate.party}</p>
            </div>
            {isVotedFor && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3" /> Your Vote
              </span>
            )}
          </div>

          {candidate.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{candidate.description}</p>
          )}
        </div>
      </div>

      {candidate.manifesto && (
        <details className="mt-4">
          <summary className="text-xs font-medium text-primary-600 cursor-pointer hover:text-primary-700 select-none">
            View Manifesto
          </summary>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl leading-relaxed">
            {candidate.manifesto}
          </p>
        </details>
      )}

      {canVote && (
        <button
          onClick={() => onVote(candidate._id)}
          disabled={loading}
          className="mt-4 w-full btn-primary flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>🗳️ Cast Your Vote</>
          )}
        </button>
      )}
    </div>
  );
}
