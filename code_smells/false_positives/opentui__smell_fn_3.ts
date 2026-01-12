// @ts-nocheck
inputListener = (key: KeyEvent) => {
  if (key.name === 'g' && currentGenerator) {
    console.log('Generating 100 particles (burst)...')
    currentGenerator.spawnParticles(100).then(() => {
      console.log('Particle burst spawn call completed.')
    })
  }
  if (key.name === 'a' && currentGenerator) {
    console.log('Starting auto-spawn (30 particles/sec)...')
    currentGenerator.setAutoSpawn(AUTO_SPAWN_RATE)
    const configName = configs[currentGeneratorKey as keyof typeof configs].name
    if (configInfoText) {
      configInfoText.content = `Mode: ${configName} | Auto-spawning`
    }
  }
  if (key.name === 's' && currentGenerator) {
    console.log('Stopping auto-spawn...')
    currentGenerator.stopAutoSpawn()
    const configName = configs[currentGeneratorKey as keyof typeof configs].name
    if (configInfoText) {
      configInfoText.content = `Mode: ${configName} | Idle`
    }
  }
  if (key.name === 'x' && currentGenerator) {
    console.log('Clearing all particles...')
    currentGenerator.dispose()
  }
  if (key.name === '1') {
    switchToGenerator('3d-static')
  }
  if (key.name === '2') {
    switchToGenerator('2d-static')
  }
  if (key.name === '3') {
    switchToGenerator('3d-animated')
  }
  if (key.name === '4') {
    configs.custom.params.gravity = new THREE.Vector3(
      0,
      THREE.MathUtils.randFloat(-9.8, 9.8),
      THREE.MathUtils.randFloat(-2.0, 2.0),
    )
    console.log(
      `Custom gravity: Y=${configs.custom.params.gravity.y.toFixed(1)}, Z=${configs.custom.params.gravity.z.toFixed(1)}`,
    )
    switchToGenerator('custom')
  }
  if (key.name === '5') {
    switchToGenerator('2d-animated')
  }
}