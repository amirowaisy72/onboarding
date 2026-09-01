import { supabase, isSupabaseConfigured } from './supabase';

// Create a new recruitment session for an anonymous candidate.
// Returns a session id (string) when Supabase is configured, or null when it
// isn't — the chat flow continues either way.
export async function createSession({ name, email, source } = {}) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('recruitment_sessions')
    .insert({
      candidate_name: name || null,
      candidate_email: email || null,
      source: source || null,
      status: 'in_progress',
      current_step: 0,
      reached_telegram: false,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

// Record one answered step and advance the session pointer.
export async function recordAnswer({
  sessionId,
  stepIndex,
  stepKey,
  question,
  answer,
  answerLabel,
  isLast = false,
}) {
  if (!isSupabaseConfigured || !sessionId) return;

  const { error: ansError } = await supabase
    .from('recruitment_answers')
    .insert({
      session_id: sessionId,
      step_index: stepIndex,
      step_key: stepKey,
      question,
      answer,
      answer_label: answerLabel || null,
    });
  if (ansError) throw ansError;

  const patch = {
    current_step: stepIndex + 1,
    updated_at: new Date().toISOString(),
  };
  if (isLast) {
    patch.status = 'completed';
    patch.completed_at = new Date().toISOString();
    patch.reached_telegram = true;
  }

  const { error: sessError } = await supabase
    .from('recruitment_sessions')
    .update(patch)
    .eq('id', sessionId);
  if (sessError) throw sessError;
}
