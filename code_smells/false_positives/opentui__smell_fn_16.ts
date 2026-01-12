// @ts-nocheck
rendererInstance.keyInput.on('keypress', (key) => {
  if (key.name === 's' && scrollBox) {
    const currentSticky = scrollBox.stickyScroll
    scrollBox.stickyScroll = !currentSticky
    console.log(`Sticky scroll ${!currentSticky ? 'enabled' : 'disabled'}`)
    if (instructionsBox && instructionsBox.getChildren().length >= 3) {
      const statusText = instructionsBox.getChildren()[2] as TextRenderable
      statusText.content = t`${bold(fg('#7aa2f7')('Status:'))} ${fg('#c0caf5')('Sticky Scroll:')} ${(scrollBox as any).stickyScroll ? fg('#9ece6a')('ENABLED') : fg('#f7768e')('DISABLED')}`
    }
  } else if (key.name === 't' && scrollBox) {
    addItem(true)
    console.log('Added item at top')
  } else if (key.name === 'b' && scrollBox) {
    addItem(false)
    console.log('Added item at bottom')
  } else if (key.name === 'e' && scrollBox) {
    clearAllItems()
  }
})