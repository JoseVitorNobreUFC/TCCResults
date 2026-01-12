// @ts-nocheck
async () => {
  const resultDoc = []
  for (const docObj of docArr) {
    try {
      const isValidOpenAPISpec =
        objectHasProperty(docObj, 'paths') &&
        (isOpenAPIV2Document(docObj) ||
          isOpenAPIV3Document(docObj) ||
          objectHasProperty(docObj, 'info'))

      if (!isValidOpenAPISpec) {
        throw new Error('INVALID_OPENAPI_SPEC')
      }
      try {
        const validatedDoc = await validateDocs(docObj)
        resultDoc.push(validatedDoc)
      } catch (validationError) {
        if (objectHasProperty(docObj, 'paths')) {
          resultDoc.push(docObj as OpenAPI.Document)
        } else {
          throw validationError
        }
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === 'INVALID_OPENAPI_SPEC'
      ) {
        throw new Error('INVALID_OPENAPI_SPEC')
      }
      if (
        err.files &&
        err.files instanceof SwaggerParser &&
        err.files.schema
      ) {
        resultDoc.push(err.files.schema)
      }
    }
  }
  return resultDoc
}