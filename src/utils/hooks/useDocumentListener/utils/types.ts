import { KEYBOARD_SHORTCUTS } from '../../../../const';

export enum KeyEventModes {
  HIDE = 'HIDE',
  FOCUS = 'FOCUS',
}

export const textInputKeyHandler = {
  [KEYBOARD_SHORTCUTS.blurFilterInput]: KeyEventModes.HIDE,
  [KEYBOARD_SHORTCUTS.focusFilterInput]: KeyEventModes.FOCUS,
};

export type KeyEventMap = {
  [key: string]: KeyEventModes;
};
