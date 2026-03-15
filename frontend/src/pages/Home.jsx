import { Link } from 'react-router-dom';
import { Vote, Shield, BarChart3, Users, ChevronRight, CheckCircle, Lock, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: <Shield className="w-6 h-6 text-primary-600" />, title: 'Secure Voting', desc: 'JWT authentication & bcrypt password hashing protect every vote.' },
    { icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, title: 'One Person, One Vote', desc: 'Our system prevents duplicate votes with unique voter tracking.' },
    { icon: <BarChart3 className="w-6 h-6 text-violet-500" />, title: 'Live Results', desc: 'Real-time vote tallying with beautiful charts and analytics.' },
    { icon: <Users className="w-6 h-6 text-amber-500" />, title: 'Role-Based Access', desc: 'Separate admin and voter panels for clean workflow.' },
    { icon: <Lock className="w-6 h-6 text-rose-500" />, title: 'Protected Routes', desc: 'All sensitive pages require proper authentication.' },
    { icon: <Zap className="w-6 h-6 text-cyan-500" />, title: 'Instant Updates', desc: 'Vote counts update in real time after each submission.' },
  ];

  const steps = [
    { step: '01', title: 'Create an Account', desc: 'Register as a voter in seconds.' },
    { step: '02', title: 'Browse Elections', desc: 'View all active and upcoming elections.' },
    { step: '03', title: 'Cast Your Vote', desc: 'Select your candidate and vote securely.' },
    { step: '04', title: 'View Results', desc: 'Track live results with charts and analytics.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-violet-500/5 to-transparent dark:from-primary-900/30" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-1.5 text-sm font-medium mb-8 animate-fade-in">
            <Vote className="w-4 h-4" />
            Secure • Transparent • Democratic
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 animate-slide-up leading-tight">
            Your Voice,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
              Your Vote
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in">
            A modern, secure online voting platform built for colleges, organizations, and communities. Cast your vote confidently — every vote counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="btn-primary inline-flex items-center gap-2 text-base py-3 px-8"
              >
                Go to Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-base py-3 px-8">
                  Get Started Free <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary inline-flex items-center gap-2 text-base py-3 px-8">
                  Sign In
                </Link>
              </>
            )}
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 animate-fade-in">
            {[['100%', 'Secure'], ['Real-time', 'Results'], ['Zero', 'Duplicate Votes']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl font-bold text-primary-600">{num}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">Why VoteSecure?</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Built with security, transparency, and ease-of-use in mind.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400">Vote in 4 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-300 to-slate-200 dark:from-primary-700 dark:to-slate-700" />
                )}
                <div className="relative w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <span className="font-display font-bold text-white text-lg">{s.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="card p-12 bg-gradient-to-br from-primary-600 to-violet-700 border-0 rounded-3xl shadow-2xl">
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Vote?</h2>
              <p className="text-primary-200 mb-8 text-lg">Join thousands of users making their voices heard digitally.</p>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all">
                Create Free Account <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Vote className="w-4 h-4 text-primary-600" />
            <span className="font-display font-bold text-slate-600 dark:text-slate-300">VoteSecure</span>
          </div>
          <p>© 2025 VoteSecure. Built with the MERN Stack. Final Year College Project.</p>
        </div>
      </footer>
    </div>
  );
}
