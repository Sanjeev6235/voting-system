import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ElectionCard from '../components/ElectionCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function VoterDashboard() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/elections')
      .then(res => setElections(res.data.elections))
      .catch(() => toast.error('Failed to load elections'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Loader full /></>;

  const active = elections.filter(e => e.status === 'active');
  const upcoming = elections.filter(e => e.status === 'upcoming');
  const completed = elections.filter(e => e.status === 'completed');
  const votedIds = user?.votedElections || [];
  const activeNotVoted = active.filter(e => !votedIds.includes(e._id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="page-container">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="font-display text-3xl font-bold">{user?.name} 👋</h1>
              <p className="text-primary-100 mt-2 text-sm">
                {activeNotVoted.length > 0
                  ? `You have ${activeNotVoted.length} active election${activeNotVoted.length > 1 ? 's' : ''} waiting for your vote.`
                  : 'You\'re all caught up! Check back for upcoming elections.'}
              </p>
            </div>
            <div className="hidden sm:flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center">
              <Vote className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="flex gap-4 mt-6 flex-wrap">
            {[
              { label: 'Active', value: active.length, icon: '🟢' },
              { label: 'Voted In', value: votedIds.length, icon: '✅' },
              { label: 'Upcoming', value: upcoming.length, icon: '🕐' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 min-w-[100px]">
                <p className="text-2xl font-display font-bold">{s.icon} {s.value}</p>
                <p className="text-primary-100 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active elections */}
        {active.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <h2 className="font-display font-bold text-slate-900 dark:text-white text-xl">Active Elections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {active.map(e => <ElectionCard key={e._id} election={e} />)}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display font-bold text-slate-900 dark:text-white text-xl mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Upcoming Elections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map(e => <ElectionCard key={e._id} election={e} />)}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display font-bold text-slate-900 dark:text-white text-xl mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-400" /> Completed Elections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {completed.map(e => <ElectionCard key={e._id} election={e} />)}
            </div>
          </section>
        )}

        {elections.length === 0 && (
          <EmptyState icon={Vote} title="No elections available" message="No elections have been created yet. Check back soon!" />
        )}
      </div>
      <Footer />
    </div>
  );
}
