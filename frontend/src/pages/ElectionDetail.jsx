import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Search, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CandidateCard from '../components/CandidateCard';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CAND_INIT = { name: '', party: '', symbol: '🗳️', photo: '', description: '', manifesto: '' };

export default function ElectionDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ hasVoted: false, vote: null });
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [search, setSearch] = useState('');

  // Candidate modal state
  const [showCandModal, setShowCandModal] = useState(false);
  const [editCand, setEditCand] = useState(null);
  const [candForm, setCandForm] = useState(CAND_INIT);
  const [savingCand, setSavingCand] = useState(false);
  const [deleteCandTarget, setDeleteCandTarget] = useState(null);
  const [deletingCand, setDeletingCand] = useState(false);

  const fetchAll = async () => {
    try {
      const [elRes, candRes] = await Promise.all([
        api.get(`/elections/${id}`),
        api.get(`/candidates/${id}`),
      ]);
      setElection(elRes.data.election);
      setCandidates(candRes.data.candidates);

      if (!isAdmin) {
        const voteRes = await api.get(`/votes/check/${id}`);
        setVoteStatus(voteRes.data);
      }
    } catch {
      toast.error('Failed to load election details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleVote = async (candidateId) => {
    setVoting(true);
    try {
      await api.post('/votes', { electionId: id, candidateId });
      toast.success('🗳️ Vote cast successfully!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  // Candidate CRUD
  const openCreateCand = () => { setEditCand(null); setCandForm(CAND_INIT); setShowCandModal(true); };
  const openEditCand = (c) => {
    setEditCand(c);
    setCandForm({ name: c.name, party: c.party, symbol: c.symbol, photo: c.photo, description: c.description, manifesto: c.manifesto });
    setShowCandModal(true);
  };

  const handleSaveCand = async (ev) => {
    ev.preventDefault();
    if (!candForm.name || !candForm.party) return toast.error('Name and party are required');
    setSavingCand(true);
    try {
      if (editCand) {
        await api.put(`/candidates/${editCand._id}`, candForm);
        toast.success('Candidate updated');
      } else {
        await api.post('/candidates', { ...candForm, electionId: id });
        toast.success('Candidate added');
      }
      setShowCandModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving candidate');
    } finally {
      setSavingCand(false);
    }
  };

  const handleDeleteCand = async () => {
    setDeletingCand(true);
    try {
      await api.delete(`/candidates/${deleteCandTarget._id}`);
      toast.success('Candidate deleted');
      setDeleteCandTarget(null);
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingCand(false);
    }
  };

  if (loading) return <><Navbar /><Loader full /></>;
  if (!election) return <><Navbar /><div className="page-container"><p>Election not found.</p></div></>;

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.party.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = { active: 'status-active', upcoming: 'status-upcoming', completed: 'status-completed' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="page-container">
        {/* Back */}
        <Link to="/elections" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Elections
        </Link>

        {/* Election header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={statusColors[election.status]}>{election.status}</span>
                {election.status !== 'upcoming' && (
                  <Link to={`/results/${id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline">
                    <BarChart3 className="w-3.5 h-3.5" /> View Results
                  </Link>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{election.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{election.description}</p>
              <div className="flex gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                <span>📅 {new Date(election.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>→</span>
                <span>{new Date(election.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>· {election.totalVotes} votes</span>
              </div>
            </div>
          </div>

          {/* Vote status banner */}
          {!isAdmin && election.status === 'active' && voteStatus.hasVoted && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              ✅ You voted for <strong>{voteStatus.vote?.candidateId?.name}</strong>
            </div>
          )}
          {!isAdmin && election.status === 'active' && !voteStatus.hasVoted && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
              🗳️ This election is active. Select a candidate below to cast your vote.
            </div>
          )}
          {!isAdmin && election.status === 'upcoming' && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-700 dark:text-blue-400 text-sm">
              ⏳ Voting hasn't started yet. Check back on {new Date(election.startDate).toLocaleDateString()}.
            </div>
          )}
        </div>

        {/* Candidates header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="font-display font-bold text-slate-900 dark:text-white text-xl">
            Candidates <span className="text-slate-400 font-normal text-base">({candidates.length})</span>
          </h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="input pl-9 py-2 text-sm" placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {isAdmin && (
              <button onClick={openCreateCand} className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Candidate
              </button>
            )}
          </div>
        </div>

        {/* Candidates grid */}
        {filtered.length === 0 ? (
          <EmptyState icon={Plus} title="No candidates" message={isAdmin ? 'Add candidates to this election.' : 'No candidates have been added yet.'} action={isAdmin && <button onClick={openCreateCand} className="btn-primary text-sm">Add Candidate</button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(c => (
              <div key={c._id} className="relative">
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <button onClick={() => openEditCand(c)} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow text-slate-500 hover:text-primary-600 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteCandTarget(c)} className="p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow text-slate-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <CandidateCard
                  candidate={c}
                  onVote={handleVote}
                  hasVoted={voteStatus.hasVoted}
                  votedCandidateId={voteStatus.vote?.candidateId?._id}
                  electionStatus={election.status}
                  loading={voting}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      <Modal isOpen={showCandModal} onClose={() => setShowCandModal(false)} title={editCand ? 'Edit Candidate' : 'Add Candidate'} size="md">
        <form onSubmit={handleSaveCand} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" placeholder="Full name" value={candForm.name} onChange={e => setCandForm({ ...candForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Party *</label>
              <input className="input" placeholder="Party name" value={candForm.party} onChange={e => setCandForm({ ...candForm, party: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Symbol (emoji)</label>
              <input className="input" placeholder="🗳️" value={candForm.symbol} onChange={e => setCandForm({ ...candForm, symbol: e.target.value })} />
            </div>
            <div>
              <label className="label">Photo URL</label>
              <input className="input" placeholder="https://..." value={candForm.photo} onChange={e => setCandForm({ ...candForm, photo: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Short Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Brief intro..." value={candForm.description} onChange={e => setCandForm({ ...candForm, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Manifesto</label>
            <textarea className="input resize-none" rows={3} placeholder="Election promises and plans..." value={candForm.manifesto} onChange={e => setCandForm({ ...candForm, manifesto: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCandModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={savingCand} className="btn-primary flex-1">
              {savingCand ? 'Saving...' : editCand ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteCandTarget}
        onClose={() => setDeleteCandTarget(null)}
        onConfirm={handleDeleteCand}
        title="Delete Candidate"
        message={`Remove "${deleteCandTarget?.name}" from this election?`}
        loading={deletingCand}
      />

      <Footer />
    </div>
  );
}
