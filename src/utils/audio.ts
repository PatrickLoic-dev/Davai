let currentUtterance: SpeechSynthesisUtterance | null = null;

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

export function preloadVoices(): void {
  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {}, { once: true });
  }
}
