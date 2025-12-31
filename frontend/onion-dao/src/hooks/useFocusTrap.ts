import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details',
  'summary'
].join(', ');

interface UseFocusTrapOptions {
  isActive?: boolean;
  onEscape?: () => void;
  initialFocus?: 'first' | 'container' | HTMLElement | null;
  returnFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions = {}
) {
  const {
    isActive = true,
    onEscape,
    initialFocus = 'first',
    returnFocus = true
  } = options;

  const containerRef = useRef<T>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
    ).filter(el => {
      // Filter out elements that are hidden or have display: none
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (activeElement === firstElement || !containerRef.current.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (activeElement === lastElement || !containerRef.current.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isActive, onEscape, getFocusableElements]);

  // Set up and clean up focus trap
  useEffect(() => {
    if (!isActive) return;

    // Store previously focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Set initial focus
    const setInitialFocus = () => {
      if (!containerRef.current) return;

      if (initialFocus === 'first') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          containerRef.current.focus();
        }
      } else if (initialFocus === 'container') {
        containerRef.current.focus();
      } else if (initialFocus instanceof HTMLElement) {
        initialFocus.focus();
      }
    };

    // Small delay to ensure DOM is ready
    requestAnimationFrame(setInitialFocus);

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previously focused element
      if (returnFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isActive, handleKeyDown, getFocusableElements, initialFocus, returnFocus]);

  return containerRef;
}

export default useFocusTrap;
