import { Vote, Github, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">VoteSecure</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              A secure, transparent, and modern online voting platform built for academic and institutional elections.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
              <li><Link to="/elections" className="hover:text-primary-600 transition-colors">Elections</Link></li>
              <li><Link to="/login" className="hover:text-primary-600 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Security</h4>
            <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>JWT authentication, bcrypt hashing, and one-person-one-vote enforcement ensures election integrity.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} VoteSecure. Built with MERN Stack.</p>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <Github className="w-4 h-4" /> View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
