'use client';

import { useEffect, useState } from 'react';
import { Send, Copy, Check, PartyPopper, ExternalLink, MessageCircle } from 'lucide-react';

export default function TelegramReveal({ candidateName, telegramId }) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const handle = telegramId ? `@${telegramId}` : '@ReceptionManager';
  const displayUrl = telegramId ? `https://t.me/${telegramId}` : 'https://t.me/ReceptionManager';

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  async function copyHandle() {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — user can select manually
    }
  }

  return (
    <div className="relative animate-slide-up-fade">
      {showConfetti && <Confetti />}

      <div className="relative overflow-hidden rounded-3xl border border-sky-400/30 bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 p-1 shadow-2xl shadow-sky-500/30">
        <div className="rounded-[22px] bg-gradient-to-br from-sky-500 to-blue-700 p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center text-white">
            <div className="relative mb-5">
              <span className="absolute inset-0 rounded-full bg-white/20 pulse-ring" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm animate-telegram-glow">
                <PartyPopper className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              You're all set, {candidateName ? candidateName.split(' ')[0] : 'there'}!
            </h2>
            <p className="mt-2 max-w-sm text-sm text-sky-100 sm:text-base">
              You've completed the conversation. The final step is to connect with our{' '}
              <span className="font-semibold text-white">Reception Manager</span> on Telegram to
              receive your onboarding instructions and joining reward.
            </p>
          </div>

          {/* Telegram handle card */}
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Send className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-200">
                  Reception Manager · Telegram
                </p>
                <p className="truncate text-lg font-semibold">{handle}</p>
              </div>
              <button
                onClick={copyHandle}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Copy Telegram handle"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* CTA */}
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-white text-base font-bold text-sky-700 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            Continue on Telegram
            <ExternalLink className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </a>

          <p className="mt-4 text-center text-xs text-sky-100/80">
            Send a quick message mentioning you completed the conversation with Amanda to get
            onboarded fast.
          </p>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ['#38bdf8', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'];
  const pieces = Array.from({ length: 36 });
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 2.5 + Math.random() * 1.5;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 0.6}px`,
              background: color,
              animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}
