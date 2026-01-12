// @ts-nocheck
export function useFormattedHotkey(action: HotkeyAction | null): string[] | null {
  const trigger = action != null ? (hotkeys[action]?.[0] ?? null) : null;
  if (trigger == null) {
    return null;
  }
  const os = type();
  const parts = trigger.split('+');
  const labelParts: string[] = [];
  for (const p of parts) {
    if (os === 'macos') {
      if (p === 'CmdCtrl') {
        labelParts.push('⌘');
      } else if (p === 'Shift') {
        labelParts.push('⇧');
      } else if (p === 'Control') {
        labelParts.push('⌃');
      } else if (p === 'Enter') {
        labelParts.push('↩');
      } else if (p === 'Tab') {
        labelParts.push('⇥');
      } else if (p === 'Backspace') {
        labelParts.push('⌫');
      } else if (p === 'Minus') {
        labelParts.push('-');
      } else if (p === 'Plus') {
        labelParts.push('+');
      } else if (p === 'Equal') {
        labelParts.push('=');
      } else {
        labelParts.push(capitalize(p));
      }
    } else {
      if (p === 'CmdCtrl') {
        labelParts.push('Ctrl');
      } else {
        labelParts.push(capitalize(p));
      }
    }
  }
  if (os === 'macos') {
    return labelParts;
  }
  return [labelParts.join('+')];
}