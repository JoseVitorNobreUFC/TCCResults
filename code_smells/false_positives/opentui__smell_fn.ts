// @ts-nocheck
function handleKeyPress(key: KeyEvent | string): boolean {
  const keyName = typeof key === 'string' ? key : key.name
  const keySequence = typeof key === 'string' ? key : key.sequence
  const keyCtrl = typeof key === 'string' ? false : key.ctrl
  const keyShift = typeof key === 'string' ? false : key.shift
  const keyMeta = typeof key === 'string' ? false : key.meta
  const keySuper = typeof key === 'string' ? false : key.super
  const keyHyper = typeof key === 'string' ? false : key.hyper
  const bindingKey = getKeyBindingKey({
    name: keyName,
    ctrl: keyCtrl,
    shift: keyShift,
    meta: keyMeta,
    super: keySuper,
    action: 'move-left' as TextareaAction,
  })
  const action = this._keyBindingsMap.get(bindingKey)
  if (action) {
    const handler = this._actionHandlers.get(action)
    if (handler) {
      return handler()
    }
  }
  if (keySequence && !keyCtrl && !keyMeta && !keySuper && !keyHyper) {
    const firstCharCode = keySequence.charCodeAt(0)
    if (firstCharCode < 32) {
      return false
    }
    if (firstCharCode === 127) {
      return false
    }
    this.insertText(keySequence)
    return true
  }
  return false
}