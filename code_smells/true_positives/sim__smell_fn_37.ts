// @ts-nocheck
params: (params) => {
  if (!params || !params.apiKey || params.apiKey.trim() === '') {
    throw new Error('Mistral API key is required')
  }
  const parameters: any = {
    apiKey: params.apiKey.trim(),
    resultType: params.resultType || 'markdown',
  }
  const inputMethod = params.inputMethod || 'url'
  if (inputMethod === 'url') {
    if (!params.filePath || params.filePath.trim() === '') {
      throw new Error('PDF Document URL is required')
    }
    parameters.filePath = params.filePath.trim()
  } else if (inputMethod === 'upload') {
    if (!params.fileUpload) {
      throw new Error('Please upload a PDF document')
    }
    parameters.fileUpload = params.fileUpload
  }
  let pagesArray: number[] | undefined
  if (params.pages && params.pages.trim() !== '') {
    try {
      pagesArray = params.pages
        .split(',')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0)
        .map((p: string) => {
          const num = Number.parseInt(p, 10)
          if (Number.isNaN(num) || num < 0) {
            throw new Error(`Invalid page number: ${p}`)
          }
          return num
        })
      if (pagesArray && pagesArray.length === 0) {
        pagesArray = undefined
      }
    } catch (error: any) {
      throw new Error(`Page number format error: ${error.message}`)
    }
  }
  if (pagesArray && pagesArray.length > 0) {
    parameters.pages = pagesArray
  }
  return parameters
}