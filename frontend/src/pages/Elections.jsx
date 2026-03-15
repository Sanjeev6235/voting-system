import { useState, useEffect } from 'react';
import { Search, Filter, Vote } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ElectionCard from '../components/ElectionCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

const FILTERS = ['all', 'active', 'upcoming', 'completed'];

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/elections')
      .then(res => setElections(res.data.elections))
      .catch(() => toast.error('Failed to load elections'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = elections.filter(e => {
    const matchStatus = filter === 'all' || e.status === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return <><Navbar /><Loader full /></>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title mb-1">Elections</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Browse and participate in available elections</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search elections..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {search || filter !== 'all' ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {filtered.length} election{filtered.length !== 1 ? 's' : ''} found
          </p>
        ) : null}

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No elections found"
            message={search ? `No results for "${search}"` : 'No elections match the selected filter.'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(e => <ElectionCard key={e._id} election={e} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
