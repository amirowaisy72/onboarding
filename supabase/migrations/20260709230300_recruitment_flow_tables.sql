/*
# Recruitment Flow — Candidate Conversation Tracking

This migration creates the data layer for an animated, chat-based recruitment
experience. A recruiter sends a public link to a candidate. The candidate opens
the page, chats step-by-step with a virtual recruiter persona ("Amanda"), and
each answer is recorded. At the end, the candidate is shown the Reception
Manager's Telegram contact so the conversation continues there.

## Tables

### recruitment_sessions
Represents one candidate's journey through the full conversation script.
- id            (uuid, PK) — session identifier
- candidate_name (text)    — optional, captured from the opening screen
- candidate_email (text)   — optional, captured from the opening screen
- source        (text)     — where the candidate came from (e.g. ref code)
- status        (text)     — 'in_progress' | 'completed' | 'abandoned' (default in_progress)
- current_step  (int)      — last step index the candidate reached (default 0)
- reached_telegram (bool)  — true once the Telegram reveal screen is shown
- completed_at  (timestamptz) — set when the flow finishes
- created_at    (timestamptz)
- updated_at    (timestamptz)

### recruitment_answers
One row per answered step within a session.
- id          (uuid, PK)
- session_id  (uuid, FK -> recruitment_sessions ON DELETE CASCADE)
- step_index  (int)       — which step (0-based) of the script
- step_key    (text)      — stable identifier for the step (e.g. 'greeting')
- question    (text)      — the recruiter message that prompted the answer (snapshot)
- answer      (text)      — the candidate's selected / typed answer
- answer_label (text)     — human-readable label for option answers
- created_at  (timestamptz)

## Security
- This is a NO-AUTH public recruitment flow: candidates are NOT signed in.
- RLS enabled on both tables.
- Policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because the data is intentionally submitted by anonymous visitors via the
  public link. The recruiter reviews results server-side with elevated roles.
*/

CREATE TABLE IF NOT EXISTS recruitment_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text,
  candidate_email text,
  source text,
  status text NOT NULL DEFAULT 'in_progress',
  current_step int NOT NULL DEFAULT 0,
  reached_telegram boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recruitment_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recruitment_sessions" ON recruitment_sessions;
CREATE POLICY "anon_select_recruitment_sessions"
ON recruitment_sessions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recruitment_sessions" ON recruitment_sessions;
CREATE POLICY "anon_insert_recruitment_sessions"
ON recruitment_sessions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recruitment_sessions" ON recruitment_sessions;
CREATE POLICY "anon_update_recruitment_sessions"
ON recruitment_sessions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recruitment_sessions" ON recruitment_sessions;
CREATE POLICY "anon_delete_recruitment_sessions"
ON recruitment_sessions FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS recruitment_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES recruitment_sessions(id) ON DELETE CASCADE,
  step_index int NOT NULL,
  step_key text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  answer_label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recruitment_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recruitment_answers" ON recruitment_answers;
CREATE POLICY "anon_select_recruitment_answers"
ON recruitment_answers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recruitment_answers" ON recruitment_answers;
CREATE POLICY "anon_insert_recruitment_answers"
ON recruitment_answers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recruitment_answers" ON recruitment_answers;
CREATE POLICY "anon_update_recruitment_answers"
ON recruitment_answers FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recruitment_answers" ON recruitment_answers;
CREATE POLICY "anon_delete_recruitment_answers"
ON recruitment_answers FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_recruitment_answers_session_id
ON recruitment_answers(session_id);

CREATE INDEX IF NOT EXISTS idx_recruitment_sessions_status
ON recruitment_sessions(status);

CREATE INDEX IF NOT EXISTS idx_recruitment_sessions_created_at
ON recruitment_sessions(created_at desc);