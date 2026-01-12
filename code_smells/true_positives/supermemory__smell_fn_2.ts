// @ts-nocheck
const render = () => {
	if (!this.gl || !this.program || this.effects.size === 0) {
		this.animationFrame = requestAnimationFrame(render)
		return
	}
	const currentTime = (performance.now() - this.startTime) / 1000
	for (const [id, effect] of Array.from(this.effects)) {
		const mousePos = this.mousePositions.get(id) || { x: 0, y: 0 }
		if (effect.width <= 0 || effect.height <= 0) {
			continue
		}
		if (
			this.canvas!.width !== effect.width ||
			this.canvas!.height !== effect.height
		) {
			this.canvas!.width = effect.width
			this.canvas!.height = effect.height
			this.gl.viewport(0, 0, effect.width, effect.height)
		}
		this.gl.clearColor(0, 0, 0, 0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
		if (this.uniforms.resolution) {
			this.gl.uniform2f(
				this.uniforms.resolution,
				effect.width,
				effect.height,
			)
		}
		if (this.uniforms.time) {
			this.gl.uniform1f(this.uniforms.time, currentTime)
		}
		if (this.uniforms.mouse) {
			this.gl.uniform2f(this.uniforms.mouse, mousePos.x, mousePos.y)
		}
		if (this.uniforms.expanded) {
			this.gl.uniform1f(
				this.uniforms.expanded,
				effect.isExpanded ? 1.0 : 0.0,
			)
		}
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
		const targetCtx = effect.targetCanvas.getContext(`2d`)
		if (targetCtx) {
			targetCtx.clearRect(0, 0, effect.width, effect.height)
			targetCtx.drawImage(this.canvas!, 0, 0)
		}
	}
	this.animationFrame = requestAnimationFrame(render)
}