'use client';

import { RECRUITER } from '@/lib/recruitment-steps';

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <Avatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/50 bg-card px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground/60"
            style={{
              animation: 'typing-dot 1.2s infinite',
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function RecruiterBubble({ children, delay = 0 }) {
  return (
    <div
      className="flex items-end gap-2 animate-bubble-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <Avatar />
      <div className="flex flex-col items-start">
        <span className="mb-1 ml-1 text-xs font-medium text-muted-foreground">
          {RECRUITER.name}
        </span>
        <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-primary/15 bg-gradient-to-br from-primary to-sky-500 px-4 py-3 text-[15px] leading-relaxed text-white shadow-md shadow-primary/20">
          {children}
        </div>
      </div>
    </div>
  );
}

export function CandidateBubble({ children, label }) {
  return (
    <div className="flex flex-col items-end animate-bubble-in">
      <span className="mb-1 mr-1 text-xs font-medium text-muted-foreground">You</span>
      <div className="max-w-[85%] rounded-2xl rounded-br-md border border-border/60 bg-card px-4 py-3 text-[15px] leading-relaxed text-foreground shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-sm font-semibold text-white shadow-md shadow-primary/30">
      {RECRUITER.avatarInitial}
      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
    </div>
  );
}
