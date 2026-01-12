// @ts-nocheck
function rebuildNavStack() {
  if (!schema.value) return
  const newNavStack: ExplorerNavStack = [initialNavStackItem]
  let lastEntity: GraphQLNamedType | GraphQLField<any, any, any> | null = null
  for (const item of navStack.value.slice(1)) {
    if (item.def) {
      if (isNamedType(item.def)) {
        const newType = schema.value.getType(item.def.name)
        if (newType) {
          newNavStack.push({
            name: item.name,
            def: newType,
          })
          lastEntity = newType
        } else {
          break
        }
      } else if (lastEntity === null) {
        break
      } else if (isObjectType(lastEntity) || isInputObjectType(lastEntity)) {
        const field = lastEntity.getFields()[item.name]
        if (field) {
          newNavStack.push({
            name: item.name,
            def: field,
          })
        } else {
          break
        }
      } else if (
        isScalarType(lastEntity) ||
        isEnumType(lastEntity) ||
        isInterfaceType(lastEntity) ||
        isUnionType(lastEntity)
      ) {
        break
      } else {
        const field: GraphQLField<any, any> = lastEntity
        const arg = field.args.find((a) => a.name === item.name)

        if (arg) {
          newNavStack.push({
            name: item.name,
            def: field,
          })
        } else {
          break
        }
      }
    } else {
      lastEntity = null
      newNavStack.push(item)
    }
  }
  navStack.value = newNavStack
}