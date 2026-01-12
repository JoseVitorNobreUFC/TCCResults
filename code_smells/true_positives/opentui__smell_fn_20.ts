// @ts-nocheck
export function instantiate<NodeType extends VNode | Renderable>(
  ctx: RenderContext,
  node: NodeType,
): InstantiateFn<NodeType> {
  if (isRenderable(node)) return node
  if (!node || typeof node !== 'object') {
    throw new TypeError('mount() received an invalid vnode')
  }
  const vnode = node as VNode
  const { type, props } = vnode
  const children = flattenChildren(vnode.children || [])
  const delegateMap = (vnode as any).__delegateMap as Record<string, string> | undefined
  if (isRenderableConstructor(type)) {
    const instance = new type(ctx, (props || {}) as any)
    for (const child of children) {
      if (isRenderable(child)) {
        instance.add(child)
      } else {
        const mounted = instantiate(ctx, child as NodeType)
        instance.add(mounted)
      }
    }
    const delegatedInstance = wrapWithDelegates(instance, delegateMap)
    const pendingCalls = (vnode as any).__pendingCalls as PendingCall[] | undefined
    if (pendingCalls) {
      for (const call of pendingCalls) {
        if (call.isProperty) {
          ;(delegatedInstance as any)[call.method] = call.args[0]
        } else {
          ;(delegatedInstance as any)[call.method].apply(delegatedInstance, call.args)
        }
      }
    }
    return delegatedInstance
  }
  const resolved = (type as FunctionalConstruct)(props || ({} as any), children)
  const inst = instantiate(ctx, resolved)
  return wrapWithDelegates(inst, delegateMap) as InstantiateFn<NodeType>
}