import { useEffect, useRef, useState } from 'react';

import {
  KeyEventMap,
  KeyEventModes,
  textInputKeyHandler,
} from '@topology-utils/hooks/useDocumentListener/utils/types';
import { isModalOpen } from '@topology-utils/modal-utils';

const useDocumentListener = <T extends HTMLElement>(
  keyEventMap: KeyEventMap = textInputKeyHandler,
) => {
  const [visible, setVisible] = useState(true);
  const ref = useRef<T>(null);

  const handleEvent = (e) => {
    if (!ref?.current?.contains(e.target)) {
      setVisible(false);
    }
  };

  const handleKeyEvents = (e) => {
    // Don't steal focus from a modal open on top of the page.
    if (isModalOpen()) {
      return;
    }
    const { nodeName } = e.target;
    switch (keyEventMap[e.key]) {
      case KeyEventModes.HIDE:
        setVisible(false);
        ref.current.blur();
        break;
      case KeyEventModes.FOCUS:
        if (
          document.activeElement !== ref.current &&
          // Don't steal focus if the user types the focus shortcut in another text input.
          nodeName !== 'INPUT' &&
          nodeName !== 'TEXTAREA'
        ) {
          ref.current.focus();
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleEvent, true);
    document.addEventListener('keydown', handleKeyEvents, true);
    return () => {
      document.removeEventListener('click', handleEvent, true);
      document.removeEventListener('keydown', handleKeyEvents, true);
    };
  });

  return { visible, setVisible, ref };
};

export default useDocumentListener;
