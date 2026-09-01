'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Check, Loader2, ArrowLeft, MoreVertical, Wifi, Phone } from 'lucide-react';
import { STEPS, RECRUITER } from '@/lib/recruitment-steps';
import { createSession, recordAnswer } from '@/lib/recruitment-api';
import { RecruiterBubble, CandidateBubble, TypingIndicator } from './ChatBubble';
import TelegramReveal from './TelegramReveal';

const TYPING_BASE_MS = 700;
const TYPING_PER_CHAR_MS = 18;
const MSG_GAP_MS = 420;
const OPTION_STAGGER_MS = 90;

// Read ?number= and ?tg= from the URL (if present).
function readUrlParams() {
  if (typeof window === 'undefined') return { phone: null, telegramId: null };
  const params = new URLSearchParams(window.location.search);
  return {
    phone: params.get('number') || null,
    telegramId: params.get('tg') || null,
  };
}

export default function RecruitmentFlow({ candidate }) {
  const [sessionId, setSessionId] = useState(null);
  const [sessionError, setSessionError] = useState(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [urlParams, setUrlParams] = useState({ phone: null, telegramId: null });

  const scrollRef = useRef(null);
  const timersRef = useRef([]);

  const candidateName = candidate?.name || '';

  // Read URL params on mount.
  useEffect(() => {
    setUrlParams(readUrlParams());
  }, []);

  // Create session once on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const id = await createSession({
          name: candidate?.name,
          email: null,
          source: typeof window !== 'undefined' ? window.location.search || null : null,
        });
        if (active) setSessionId(id);
      } catch (err) {
        if (active) setSessionError(err?.message || 'Could not start session');
      }
    })();
    return () => { active = false; };
  }, [candidate]);

  // Auto-scroll to bottom whenever messages/typing change.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, showPrompt, showOptions, done]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Reveal a set of recruiter messages with typing indicators, then show prompt+options.
  const revealMessages = useCallback((msgs, step, onDone) => {
    clearTimers();
    setTyping(true);
    setShowPrompt(false);
    setShowOptions(false);

    const timers = [];
    let elapsed = 0;
    msgs.forEach((msg, i) => {
      const typingDuration = TYPING_BASE_MS + msg.length * TYPING_PER_CHAR_MS;
      elapsed += typingDuration;
      timers.push(
        setTimeout(() => {
          setTyping(false);
          setMessages((prev) => [...prev, { role: 'recruiter', text: msg, key: `${step.key}-${i}-${Date.now()}` }]);
          if (i === msgs.length - 1) {
            timers.push(
              setTimeout(() => {
                setShowPrompt(true);
                timers.push(
                  setTimeout(() => setShowOptions(true), step.type === 'freeform' ? 200 : MSG_GAP_MS)
                );
              }, MSG_GAP_MS)
            );
          }
          if (i < msgs.length - 1) {
            timers.push(setTimeout(() => setTyping(true), 120));
          }
        }, elapsed)
      );
      elapsed += MSG_GAP_MS;
    });
    timersRef.current = timers;
  }, [clearTimers]);

  // Drive the message reveal for the current step.
  useEffect(() => {
    if (done || sessionError) return;
    const step = STEPS[stepIndex];
    if (!step) return;
    revealMessages(step.messages || [], step);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, done]);

  async function handleAnswer(answer, answerLabel) {
    if (submitting) return;
    const step = STEPS[stepIndex];
    if (!step) return;

    setSubmitting(true);
    setShowOptions(false);
    setShowPrompt(false);

    setMessages((prev) => [...prev, { role: 'candidate', text: answerLabel || answer, key: `c-${stepIndex}-${Date.now()}` }]);

    try {
      const isLast = stepIndex === STEPS.length - 1;
      if (sessionId) {
        await recordAnswer({
          sessionId,
          stepIndex,
          stepKey: step.key,
          question: step.prompt,
          answer,
          answerLabel: answerLabel || null,
          isLast,
        });
      }
    } catch (err) {
      console.error('Record answer failed:', err);
    } finally {
      setSubmitting(false);
    }

    // Branch handling: if this step has a branch for the chosen answer, reveal it.
    if (step.branches && step.branches[answer]) {
      const branch = step.branches[answer];
      setTimeout(() => {
        revealMessages(branch.messages, branch, () => {});
      }, 500);
      return;
    }

    if (step.isTelegramStep) {
      setTimeout(() => setDone(true), 600);
    } else {
      setTimeout(() => setStepIndex((s) => Math.min(s + 1, STEPS.length - 1)), 500);
    }
  }

  function handleOption(opt) {
    handleAnswer(opt.value, opt.label);
  }

  const step = STEPS[stepIndex];
  const progress = Math.round(((done ? STEPS.length : stepIndex) / STEPS.length) * 100);

  if (sessionError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-semibold text-destructive">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">{sessionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <div className="flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border/60 bg-card/90 px-4 py-3 backdrop-blur">
          <button
            onClick={() => window.history.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-sm font-semibold text-white shadow-md">
            {RECRUITER.avatarInitial}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{RECRUITER.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {RECRUITER.role}
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wifi className="h-4 w-4" />
            <MoreVertical className="h-4 w-4" />
          </div>
        </header>

        {/* Persistent contact bar — shown only if ?number= is in the URL */}
        {urlParams.phone && (
          <div className="flex items-center justify-center gap-2 border-b border-border/60 bg-primary/5 px-4 py-2 text-center">
            <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              To contact your mentor directly with specific questions, message{' '}
              <a
                href={`tel:${urlParams.phone}`}
                className="font-semibold text-primary hover:underline"
              >
                {urlParams.phone}
              </a>
            </p>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="chat-scroll flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {candidateName && (
            <div className="mb-2 text-center text-xs text-muted-foreground">
              Conversation with <span className="font-medium text-foreground">{candidateName}</span>
            </div>
          )}
          {messages.map((m) =>
            m.role === 'recruiter' ? (
              <RecruiterBubble key={m.key}>{m.text}</RecruiterBubble>
            ) : (
              <CandidateBubble key={m.key} label={m.label}>
                {m.text}
              </CandidateBubble>
            )
          )}
          {typing && <TypingIndicator />}

          {/* Prompt */}
          {showPrompt && !done && (
            <div className="animate-slide-up-fade pl-11">
              <p className="text-[15px] font-medium leading-relaxed text-foreground">
                {step.prompt}
              </p>
            </div>
          )}

          {/* Options */}
          {showOptions && !done && step.type === 'choice' && (
            <div className="space-y-2.5 pl-11">
              {step.options.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => handleOption(opt)}
                  disabled={submitting}
                  className="group flex w-full max-w-[85%] items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 text-left text-[15px] font-medium text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md disabled:opacity-60"
                  style={{ animation: `option-pop 0.4s ease-out ${i * OPTION_STAGGER_MS / 1000}s both` }}
                >
                  <span>{opt.label}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {showOptions && !done && step.type === 'confirm' && (
            <div className="flex flex-wrap gap-2.5 pl-11">
              {step.options.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => handleOption(opt)}
                  disabled={submitting}
                  className="group flex items-center gap-2 rounded-full border border-border/70 bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md disabled:opacity-60"
                  style={{ animation: `option-pop 0.4s ease-out ${i * OPTION_STAGGER_MS / 1000}s both` }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {showOptions && !done && step.type === 'freeform' && (
            <form onSubmit={(e) => { e.preventDefault(); const t = inputText.trim(); if (!t) return; setInputText(''); handleAnswer(t, t); }} className="pl-11">
              <div className="flex max-w-[85%] items-end gap-2 rounded-2xl border border-input bg-background/60 p-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={step.placeholder}
                  rows={2}
                  disabled={submitting}
                  className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const t = inputText.trim(); if (!t) return; setInputText(''); handleAnswer(t, t); }
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting || !inputText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-md transition-all hover:shadow-lg disabled:opacity-40"
                  aria-label="Send"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>
          )}

          {done && (
            <div className="pt-2">
              <TelegramReveal candidateName={candidateName} telegramId={urlParams.telegramId} />
            </div>
          )}
        </div>

        {/* Footer status */}
        <footer className="border-t border-border/60 bg-card/90 px-4 py-2.5 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {submitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving your answer…
                </>
              ) : done ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  Conversation complete
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Step {stepIndex + 1} of {STEPS.length} · {step.label}
                </>
              )}
            </span>
            <span className="hidden sm:inline">End-to-end encrypted session</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
