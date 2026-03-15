import { useState, useEffect } from 'react';
import { Users, Search, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

export default function ManageVoters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVoters = async () => {
    try {
      const res = await api.get('/user/voters');
      setVoters(res.data.voters);
    } catch {
      toast.error('Failed to load voters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVoters(); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/user/${deleteTarget._id}`);
      toast.success('Voter deleted');
      setDeleteTarget(null);
      fetchVoters();
    } catch {
      toast.error('Failed to delete voter');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = voters.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <><Navbar /><Loader full /></>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title flex items-center gap-2"><Users className="w-6 h-6 text-primary-600" /> Manage Voters</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{voters.length} registered voters</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input pl-9 py-2 text-sm" placeholder="Search voters..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No voters found" message={search ? 'No voters match your search.' : 'No voters have registered yet.'} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    {['Voter', 'Email', 'Joined', 'Elections Voted', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map(v => (
                    <tr key={v._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {v.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">{v.email}</td>
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                          {v.votedElections?.length > 0
                            ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {v.votedElections.length}</>
                            : <><XCircle className="w-4 h-4 text-slate-300" /> 0</>
                          }
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => setDeleteTarget(v)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Voter"
        message={`Remove "${deleteTarget?.name}" (${deleteTarget?.email}) from the system?`}
        loading={deleting}
      />

      <Footer />
    </div>
  );
}
