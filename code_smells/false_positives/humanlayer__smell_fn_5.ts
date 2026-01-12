// @ts-nocheck
(ev, handler) => {
  switch (handler.keys?.join('')) {
    case Hotkeys.ARROW_UP:
    case Hotkeys.ARROW_DOWN: {
      if (filteredItems.length > 0) {
        const direction = handler.keys?.join('') === Hotkeys.ARROW_UP ? -1 : 1
        const newIndex = (selectedIndex + direction + filteredItems.length) % filteredItems.length
        setSelectedIndex(newIndex)
      }
      break
    }
    case Hotkeys.TAB: {
      if (dropdownOpen && filteredItems.length > 0) {
        ev.preventDefault()
        const selected = filteredItems[selectedIndex]
        if (selected) {
          setSearchValue(selected.path)
        }
        setDropdownOpen(false)
      }
      break
    }
    case Hotkeys.ENTER: {
      ev.preventDefault()
      let finalValue = searchValue

      if (dropdownOpen && filteredItems.length > 0 && selectedIndex >= 0) {
        const selected = filteredItems[selectedIndex]
        if (selected) {
          finalValue = selected.path
        }
      }
      setSearchValue(finalValue)
      setDropdownOpen(false)
      if (onSubmit) {
        onSubmit(finalValue)
      }
      break
    }
    case Hotkeys.ESCAPE: {
      ev.stopPropagation()
      setDropdownOpen(false)
      inputRef.current?.blur()
      break
    }
  }
}