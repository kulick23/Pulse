import { RefObject, useEffect, useRef } from 'react';

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Provides the keyboard and focus behaviour required by modal dialogs.
 * The overlay is still responsible for suppressing pointer interaction.
 */
export const useAccessibleDialog = <T extends HTMLElement>(
  onClose: () => void,
  active = true
): RefObject<T | null> => {
  const dialogRef = useRef<T>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    document.body.style.overflow = 'hidden';

    window.requestAnimationFrame(() => {
      const preferred = dialog?.querySelector<HTMLElement>(
        '[data-dialog-initial-focus]'
      );
      const first = dialog?.querySelector<HTMLElement>(focusableSelector);
      (preferred ?? first ?? dialog)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      const currentDialog = dialogRef.current;
      if (!currentDialog) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const controls = Array.from(
        currentDialog.querySelectorAll<HTMLElement>(focusableSelector)
      );
      if (controls.length === 0) {
        event.preventDefault();
        currentDialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [active]);

  return dialogRef;
};
