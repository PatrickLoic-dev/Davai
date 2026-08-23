/** True when running installed/launched as a standalone PWA (not a regular browser tab). */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  const standaloneDisplay =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: fullscreen)').matches ||
    window.matchMedia?.('(display-mode: minimal-ui)').matches;
  // Legacy iOS Safari flag — iOS doesn't support the display-mode media query.
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  return Boolean(standaloneDisplay || iosStandalone);
}
