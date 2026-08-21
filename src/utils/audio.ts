let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function getRussianVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.lang === 'ru-RU') ??
    voices.find(v => v.lang.startsWith('ru')) ??
    null
  );
}

export function speakRussian(text: string, rate = 0.78): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = rate;
  utterance.pitch = 1.05;

  const voice = getRussianVoice();
  if (voice) utterance.voice = voice;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
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
    // Nudge some browsers into firing voiceschanged.
    window.speechSynthesis.getVoices();
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 1500);
  });

  return voicesReadyPromise;
}

/** True once at least one system voice (any language) is available. */
export function hasAnyVoice(): boolean {
  return 'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0;
}

/** True once a Russian voice specifically is available. */
export function hasRussianVoice(): boolean {
  return getRussianVoice() !== null;
}
