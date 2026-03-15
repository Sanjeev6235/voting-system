import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Vote, Users, BarChart3, Plus, Calendar, Pencil, Trash2, CheckCircle, Clock, PlayCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import ElectionCard from '../components/ElectionCard';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

const INITIAL_FORM = { title: '', description: '', startDate: '', endDate: '', status: 'upcoming' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editElection, setEditElection] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, electionsRes] = await Promise.all([
        api.get('/results/stats/dashboard'),
        api.get('/elections'),
      ]);
      setStats(statsRes.data.stats);
      setElections(electionsRes.data.elections);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditElection(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (e) => {
    setEditElection(e);
    setForm({
      title: e.title,
      description: e.description,
      startDate: e.startDate?.slice(0, 10),
      endDate: e.endDate?.slice(0, 10),
      status: e.status,
    });
    setShowModal(true);
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      if (editElection) {
        await api.put(`/elections/${editElection._id}`, form);
        toast.success('Election updated');
      } else {
        await api.post('/elections', form);
        toast.success('Election created');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving election');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/elections/${deleteTarget._id}`);
      toast.success('Election deleted');
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/elections/${id}/status`, { status });
      toast.success(`Election marked as ${status}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <><Navbar /><Loader full /></>;

  const statCards = stats ? [
    { label: 'Total Elections', value: stats.totalElections, icon: Vote, color: 'primary' },
    { label: 'Active Now', value: stats.activeElections, icon: PlayCircle, color: 'emerald' },
    { label: 'Total Voters', value: stats.totalVoters, icon: Users, color: 'violet' },
    { label: 'Votes Cast', value: stats.totalVotes, icon: BarChart3, color: 'amber' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-primary-600" /> Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage elections, candidates, and voters</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/voters" className="btn-secondary flex items-center gap-2 text-sm"><Users className="w-4 h-4" /> Voters</Link>
            <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> New Election</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Elections table */}
        <div className="card">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900 dark:text-white">All Elections</h2>
            <span className="text-sm text-slate-500">{elections.length} total</span>
          </div>

          {elections.length === 0 ? (
            <EmptyState icon={Vote} title="No elections yet" message="Create your first election to get started." action={<button onClick={openCreate} className="btn-primary text-sm">Create Election</button>} />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {elections.map((el) => (
                <div key={el._id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`status-${el.status}`}>{el.status}</span>
                    </div>
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">{el.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(el.startDate).toLocaleDateString()} — {new Date(el.endDate).toLocaleDateString()} · {el.totalVotes} votes
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {el.status === 'upcoming' && (
                      <button onClick={() => handleStatusChange(el._id, 'active')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 transition-colors">
                        <PlayCircle className="w-3.5 h-3.5" /> Start
                      </button>
                    )}
                    {el.status === 'active' && (
                      <button onClick={() => handleStatusChange(el._id, 'completed')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> End
                      </button>
                    )}
                    <Link to={`/elections/${el._id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button onClick={() => openEdit(el)} className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(el)} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editElection ? 'Edit Election' : 'Create Election'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" placeholder="Election title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea className="input resize-none" rows={3} placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date *</label>
              <input type="date" className="input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="label">End Date *</label>
              <input type="date" className="input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editElection ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Election"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will also delete all related candidates and votes.`}
        loading={deleting}
      />

      <Footer />
    </div>
  );
}
