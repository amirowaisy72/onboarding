'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, Briefcase, Wallet, GraduationCap, ShieldCheck } from 'lucide-react';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [starting, setStarting] = useState(false);

  const validName = name.trim().length >= 2;

  function handleStart(e) {
    e?.preventDefault?.();
    setTouched(true);
    if (!validName) return;
    setStarting(true);
    setTimeout(() => {
      onStart({ name: name.trim() });
    }, 700);
  }

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-5xl">
        {/* Hero */}
        <div className="text-center animate-slide-up-fade">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Remote Hiring — Open Now
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Remote Data Optimization
            <span className="block bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            A flexible, remote role with guided onboarding and a{' '}
            <span className="font-semibold text-foreground">$15 joining reward</span>{' '}
            for eligible participants. Start with a short conversation with our team.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '0.1s' }}>
          {[
            { icon: Briefcase, title: 'Fully Remote', desc: 'Work from anywhere, on your schedule.' },
            { icon: Wallet, title: 'Joining Reward', desc: '$15 for eligible new members.' },
            { icon: GraduationCap, title: 'Guided Training', desc: 'Step-by-step onboarding included.' },
          ].map((f, i) => (
            <div
              key={f.title}
              className="animate-slide-up-fade rounded-2xl border border-border/60 bg-card/70 p-5 text-left shadow-sm backdrop-blur-md"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Sign-in / start card */}
        <div
          className="mx-auto mt-10 max-w-md animate-slide-up-fade rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-xl sm:p-8"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Your details are only used to guide your application.
          </div>
          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                className="h-12 w-full rounded-xl border border-input bg-background/60 px-4 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              {touched && !validName && (
                <p className="mt-1.5 text-xs text-destructive">Please enter your name (2+ characters).</p>
              )}
            </div>
            <button
              type="submit"
              disabled={starting}
              className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-sky-500 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-70"
            >
              <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
              {starting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Connecting…
                </>
              ) : (
                <>
                  Start Conversation
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Takes ~2 minutes · No commitment to continue
          </p>
        </div>
      </div>
    </main>
  );
}
