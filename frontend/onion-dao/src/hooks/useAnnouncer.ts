import { useCallback, useEffect, useRef } from 'react';

type AriaLive = 'polite' | 'assertive' | 'off';

interface AnnounceOptions {
  priority?: AriaLive;
  delay?: number;
}

/**
 * Hook for making announcements to screen readers
 * Creates a live region that announces messages accessibly
 */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  // Create the announcer element on mount
  useEffect(() => {
    // Check if announcer already exists
    let announcer = document.getElementById('sr-announcer') as HTMLDivElement;

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }

    announcerRef.current = announcer;

    // Cleanup on unmount (but keep the announcer for other components)
    return () => {
      // Don't remove the announcer as other components might use it
    };
  }, []);

  const announce = useCallback((message: string, options: AnnounceOptions = {}) => {
    const { priority = 'polite', delay = 100 } = options;

    if (!announcerRef.current) return;

    const announcer = announcerRef.current;

    // Set the priority
    announcer.setAttribute('aria-live', priority);

    // Clear the message first (needed for repeated announcements)
    announcer.textContent = '';

    // Add the message after a small delay
    setTimeout(() => {
      announcer.textContent = message;
    }, delay);
  }, []);

  const announcePolite = useCallback((message: string) => {
    announce(message, { priority: 'polite' });
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, { priority: 'assertive' });
  }, [announce]);

  return {
    announce,
    announcePolite,
    announceAssertive
  };
}

export default useAnnouncer;
