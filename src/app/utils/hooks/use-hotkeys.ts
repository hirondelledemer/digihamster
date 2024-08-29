import { useEffect } from "react";

// todo: cleanup
export interface HotkeyItemOptions {
  preventDefault?: boolean;
}

export type HotkeyItem = [
  string,
  (event: KeyboardEvent) => void,
  HotkeyItemOptions?
];

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean;
export type KeyboardModifiers = {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  mod: boolean;
  shift: boolean;
};

export type Hotkey = KeyboardModifiers & {
  key?: string;
};

function isExactHotkey(hotkey: Hotkey, event: KeyboardEvent): boolean {
  const { alt, ctrl, meta, mod, shift, key } = hotkey;
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey } = event;

  if (alt !== altKey) {
    return false;
  }

  if (mod) {
    if (!ctrlKey && !metaKey) {
      return false;
    }
  } else {
    if (ctrl !== ctrlKey) {
      return false;
    }
    if (meta !== metaKey) {
      return false;
    }
  }
  if (shift !== shiftKey) {
    return false;
  }

  if (
    key &&
    (pressedKey.toLowerCase() === key.toLowerCase() ||
      event.code.replace("Key", "").toLowerCase() === key.toLowerCase())
  ) {
    return true;
  }

  return false;
}

export function parseHotkey(hotkey: string): Hotkey {
  const keys = hotkey
    .toLowerCase()
    .split("+")
    .map((part) => part.trim());

  const modifiers: KeyboardModifiers = {
    alt: keys.includes("alt"),
    ctrl: keys.includes("ctrl"),
    meta: keys.includes("meta"),
    mod: keys.includes("mod"),
    shift: keys.includes("shift"),
  };

  const reservedKeys = ["alt", "ctrl", "meta", "shift", "mod"];

  const freeKey = keys.find((key) => !reservedKeys.includes(key));

  return {
    ...modifiers,
    key: freeKey,
  };
}

export function getHotkeyMatcher(hotkey: string): CheckHotkeyMatch {
  return (event) => isExactHotkey(parseHotkey(hotkey), event);
}

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false
) {
  if (event.target instanceof HTMLElement) {
    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(event.target.tagName);
    }

    return (
      !event.target.isContentEditable &&
      !tagsToIgnore.includes(event.target.tagName)
    );
  }

  return true;
}
export function useHotkeys(
  hotkeys: HotkeyItem[],
  tagsToIgnore: string[] = ["INPUT", "TEXTAREA", "SELECT"],
  triggerOnContentEditable = false
) {
  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      hotkeys.forEach(
        ([hotkey, handler, options = { preventDefault: true }]) => {
          if (
            getHotkeyMatcher(hotkey)(event) &&
            shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
          ) {
            if (options.preventDefault) {
              event.preventDefault();
            }

            handler(event);
          }
        }
      );
    };

    document.documentElement.addEventListener("keydown", keydownListener);
    return () =>
      document.documentElement.removeEventListener("keydown", keydownListener);
  }, [hotkeys, tagsToIgnore, triggerOnContentEditable]);
}

export default useHotkeys;
