import { supabase, isSupabaseConfigured } from '../lib/supabase';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;
let voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;
const cloudUrlCache = new Map<string, string>();

function getRussianVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  // Prefer voices the OS provides locally: "remote" voices stream audio from
  // a network endpoint (e.g. Google's), which browser-level VPNs/ad-blockers
  // (Opera GX being a known offender) can silently swallow.
  const russian = voices.filter(v => v.lang === 'ru-RU' || v.lang.startsWith('ru'));
  return russian.find(v => v.localService) ?? russian[0] ?? null;
}

function speakWithBrowserTTS(text: string, rate = 0.78): boolean {
  if (!('speechSynthesis' in window)) return false;
  const voice = getRussianVoice();
  if (!voice) return false;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = rate;
  utterance.pitch = 1.05;
  utterance.voice = voice;

  utterance.onerror = e => {
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      console.error('speechSynthesis error:', e.error);
    }
  };

  currentUtterance = utterance;

  // Chromium has a well-known bug where speak() called right after cancel()
  // (or as the very first call in a session) is silently dropped. A short
  // delay works around it reliably.
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  }, 40);

  return true;
}

/**
 * Cloud TTS via the `tts` Supabase Edge Function (ElevenLabs under the
 * hood, permanently cached in Storage). Works identically in every browser
 * — no dependency on OS-installed voices — as long as the function is
 * deployed and ELEVENLABS_API_KEY is set. Resolves false on any failure so
 * callers can fall back to the browser's built-in synthesis.
 */
async function speakWithCloudTTS(text: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    let url = cloudUrlCache.get(text);
    if (!url) {
      const { data, error } = await supabase.functions.invoke<{ url: string }>('tts', {
        body: { text },
      });
      if (error || !data?.url) return false;
      url = data.url;
      cloudUrlCache.set(text, url);
    }

    currentAudio?.pause();
    const audio = new Audio(url);
    currentAudio = audio;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

/**
 * Speaks Russian text, preferring cloud TTS (consistent quality everywhere)
 * and transparently falling back to the browser's Web Speech API if the
 * cloud function isn't deployed yet, errors, or the user is offline.
 */
export async function speakRussian(text: string, rate = 0.78): Promise<boolean> {
  const cloudOk = await speakWithCloudTTS(text);
  if (cloudOk) return true;
  return speakWithBrowserTTS(text, rate);
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  currentAudio?.pause();
  currentUtterance = null;
}

/** True if either the cloud function or a local browser voice can speak. */
export function isSpeechSupported(): boolean {
  return isSupabaseConfigured || 'speechSynthesis' in window;
}

/**
 * Chrome/Opera load voices asynchronously and getVoices() often returns []
 * on the very first call. This resolves once voices are available (or a
 * 1.5s timeout elapses, in case 'voiceschanged' never fires — a known
 * Chromium quirk on some platforms).
 */
export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!('speechSynthesis' in window)) return Promise.resolve([]);
  if (voicesReadyPromise) return voicesReadyPromise;

  voicesReadyPromise = new Promise(resolve => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    window.speechSynthesis.getVoices();
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 1500);
  });

  return voicesReadyPromise;
}

/**
 * True once audio playback is possible some way — cloud TTS is configured,
 * or at least one local browser voice (any language, checked defensively)
 * is available so a browser-TTS fallback can work.
 */
export function hasAnyVoice(): boolean {
  if (isSupabaseConfigured) return true;
  return 'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0;
}

/** True once a Russian voice specifically is available (browser TTS only). */
export function hasRussianVoice(): boolean {
  return getRussianVoice() !== null;
}
