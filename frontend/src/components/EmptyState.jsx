export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
        {Icon && <Icon className="w-7 h-7 text-slate-400" />}
      </div>
      <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-2">{title}</h3>
      {message && <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-5">{message}</p>}
      {action}
    </div>
  );
}
