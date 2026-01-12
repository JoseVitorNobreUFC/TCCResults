// @ts-nocheck
keyListener = (key: KeyEvent) => {
  if (key.name === `p` && engine) {
    engine.saveToFile(`screenshot-${Date.now()}.png`)
  }
  if (key.name === `w`) {
    cameraNode.translateY(0.5)
  } else if (key.name === `s`) {
    cameraNode.translateY(-0.5)
  } else if (key.name === `a`) {
    cameraNode.translateX(-0.5)
  } else if (key.name === `d`) {
    cameraNode.translateX(0.5)
  }
  if (key.name === `q`) {
    cameraNode.rotateY(0.1)
  } else if (key.name === `e`) {
    cameraNode.rotateY(-0.1)
  }
  if (key.name === `z`) {
    cameraNode.translateZ(0.1)
  } else if (key.name === `x`) {
    cameraNode.translateZ(-0.1)
  }
  if (key.name === `r`) {
    cameraNode.position.set(0, 0, 2)
    cameraNode.rotation.set(0, 0, 0)
    cameraNode.quaternion.set(0, 0, 0, 1)
    cameraNode.up.set(0, 1, 0)
    cameraNode.lookAt(0, 0, 0)
  }
  if (key.name === `u` && engine) {
    engine.toggleSuperSampling()
  }
  if (key.name === `i` && engine) {
    const currentAlgorithm = engine.getSuperSampleAlgorithm()
    const newAlgorithm =
      currentAlgorithm === SuperSampleAlgorithm.STANDARD
        ? SuperSampleAlgorithm.PRE_SQUEEZED
        : SuperSampleAlgorithm.STANDARD
    engine.setSuperSampleAlgorithm(newAlgorithm)
  }
  if (key.name === `space`) {
    rotationEnabled = !rotationEnabled
  }
}