// @ts-nocheck
return (sourceFile: ts.SourceFile) => {
  const statements = [...sourceFile.statements]
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (!isImportDeclaration(statement))
      continue
    let bindingPattern: ts.ObjectBindingPattern | ts.Identifier
    const namedBindings = statement.importClause?.namedBindings
    const bindings: ts.BindingElement[] = []
    if (statement.importClause?.name)
      bindings.push(factory.createBindingElement(undefined, factory.createIdentifier('default'), statement.importClause.name))
    if (namedBindings) {
      if (isNamedImports(namedBindings)) {
        for (const specifier of namedBindings.elements)
          bindings.push(factory.createBindingElement(undefined, specifier.propertyName, specifier.name))
        bindingPattern = factory.createObjectBindingPattern(bindings)
      }
      else {
        bindingPattern = factory.createIdentifier(namedBindings.name.text)
      }
    }
    else {
      bindingPattern = factory.createObjectBindingPattern(bindings)
    }
    const newStatement = factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            bindingPattern,
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createIdentifier('import'),
                undefined,
                [statement.moduleSpecifier],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
    statements[i] = newStatement
  }
  return factory.updateSourceFile(sourceFile, statements)
}