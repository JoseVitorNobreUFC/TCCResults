// @ts-nocheck
function setProperty(instance: Instance, type: Type, propKey: string, propValue: any, oldPropValue?: any) {
  switch (propKey) {
    case 'onChange':
      if (instance instanceof InputRenderable) {
        initEventListeners(instance, InputRenderableEvents.CHANGE, propValue, oldPropValue)
      } else if (instance instanceof SelectRenderable) {
        initEventListeners(instance, SelectRenderableEvents.SELECTION_CHANGED, propValue, oldPropValue)
      } else if (instance instanceof TabSelectRenderable) {
        initEventListeners(instance, TabSelectRenderableEvents.SELECTION_CHANGED, propValue, oldPropValue)
      }
      break
    case 'onInput':
      if (instance instanceof InputRenderable) {
        initEventListeners(instance, InputRenderableEvents.INPUT, propValue, oldPropValue)
      }
      break
    case 'onSubmit':
      if (instance instanceof InputRenderable) {
        initEventListeners(instance, InputRenderableEvents.ENTER, propValue, oldPropValue)
      }
      break
    case 'onSelect':
      if (instance instanceof SelectRenderable) {
        initEventListeners(instance, SelectRenderableEvents.ITEM_SELECTED, propValue, oldPropValue)
      } else if (instance instanceof TabSelectRenderable) {
        initEventListeners(instance, TabSelectRenderableEvents.ITEM_SELECTED, propValue, oldPropValue)
      }
      break
    case 'focused':
      if (isRenderable(instance)) {
        if (!!propValue) {
          instance.focus()
        } else {
          instance.blur()
        }
      }
      break
    case 'style':
      setStyle(instance, propValue, oldPropValue)
      break
    case 'children':
      break
    default:
      instance[propKey] = propValue
  }
}