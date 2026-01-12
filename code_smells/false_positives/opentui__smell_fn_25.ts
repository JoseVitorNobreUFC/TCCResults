// @ts-nocheck
renderer.setFrameCallback(async (deltaMs) => {
  const deltaTime = deltaMs / 1000
  time += deltaTime
  const cubeObject = sceneRoot.getObjectByName('cube') as ThreeMesh | undefined
  if (rotationEnabled && cubeObject) {
    cubeObject.rotation.x += rotationSpeed[0] * deltaTime
    cubeObject.rotation.y += rotationSpeed[1] * deltaTime
    cubeObject.rotation.z += rotationSpeed[2] * deltaTime
  }
  if (pointLightNode) {
    const radius = 3
    const speed = 0.9
    pointLightNode.position.set(Math.sin(time * speed) * radius, 1.5, Math.cos(time * speed) * radius)
    const vizObject = sceneRoot.getObjectByName('light_viz')
    if (vizObject) {
      vizObject.position.copy(pointLightNode.position)
    }
  }
  if (cubeObject) {
    let materialIndex = currentMaterial
    if (!manualMaterialSelection) {
      materialIndex = Math.floor(time * 0.5) % (materials.length - 1)
    }
    if (materialIndex < materials.length && cubeObject.material !== materials[materialIndex]) {
      const newMaterialInstance = materials[materialIndex]
      cubeObject.material = newMaterialInstance
      const material = cubeObject.material as MeshPhongMaterial
      material.specularMap = specularMapEnabled ? specularMapTexture : null
      material.normalMap = normalMapEnabled ? normalMapTexture : null
      material.emissiveMap = emissiveMapEnabled ? emissiveMapTexture : null
      material.emissive = new Color(0, 0, 0)
      material.emissiveIntensity = emissiveMapEnabled ? 0.7 : 0.0
      material.needsUpdate = true
    }
  }
  engine.drawScene(sceneRoot, framebuffer, deltaTime)
})