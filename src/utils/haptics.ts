export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) return;
  
  // Try to avoid vibrating on desktop, typical mobile breakpoint is < 768
  if (window.innerWidth > 1024) return;

  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(10); // Very brief, light tap
        break;
      case 'medium':
        window.navigator.vibrate(20);
        break;
      case 'heavy':
        window.navigator.vibrate(30);
        break;
      default:
        window.navigator.vibrate(10);
    }
  } catch (e) {
    // Gracefully fail if vibrate is not supported or blocked
  }
};
