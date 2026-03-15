import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResultChart from '../components/ResultChart';
import Loader from '../components/Loader';
import api from '../services/api';

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/results/${id}`)
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Loader full /></>;
  if (!data) return <><Navbar /><div className="page-container"><p>Results not found.</p></div></>;

  const { election, results } = data;
  const winner = results[0];
  const totalVotes = election.totalVotes;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="page-container">
        <Link to="/elections" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Elections
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`status-${election.status}`}>{election.status}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{election.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> {totalVotes} total votes cast
          </p>
        </div>

        {/* Winner banner */}
        {election.status === 'completed' && winner && winner.voteCount > 0 && (
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-7 h-7" />
              <span className="font-display font-bold text-xl">Election Winner</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                {winner.symbol || '🏆'}
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{winner.name}</p>
                <p className="text-amber-100">{winner.party}</p>
                <p className="text-sm text-amber-100 mt-0.5">{winner.voteCount} votes · {winner.percentage}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Live results for active */}
        {election.status === 'active' && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live results — updating as votes are cast
          </div>
        )}

        {/* Chart */}
        {results.length > 0 && (
          <div className="mb-6">
            <ResultChart results={results} title="Vote Distribution" />
          </div>
        )}

        {/* Detailed breakdown */}
        <div className="card">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" /> Detailed Results
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">No votes have been cast yet.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {results.map((r, i) => (
                <div key={r._id} className="p-5 flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    i === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' :
                    'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {i + 1}
                  </div>

                  {/* Symbol */}
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl flex-shrink-0">
                    {r.symbol || '🗳️'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{r.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{r.party}</p>

                    {/* Progress bar */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-primary-600' : 'bg-slate-400'}`}
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 w-12 text-right">{r.percentage}%</span>
                    </div>
                  </div>

                  {/* Vote count */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-slate-900 dark:text-white text-lg">{r.voteCount}</p>
                    <p className="text-xs text-slate-400">votes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
