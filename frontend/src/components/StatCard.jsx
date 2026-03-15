export default function StatCard({ label, value, icon: Icon, color = 'primary', sub }) {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber:   'from-amber-500 to-amber-600',
    rose:    'from-rose-500 to-rose-600',
    violet:  'from-violet-500 to-violet-600',
    sky:     'from-sky-500 to-sky-600',
  };
  const bgs = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    amber:   'bg-amber-50 dark:bg-amber-900/20',
    rose:    'bg-rose-50 dark:bg-rose-900/20',
    violet:  'bg-violet-50 dark:bg-violet-900/20',
    sky:     'bg-sky-50 dark:bg-sky-900/20',
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
        <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
