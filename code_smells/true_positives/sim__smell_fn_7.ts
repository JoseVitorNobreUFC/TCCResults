// @ts-nocheck
directExecution: async (params: SupabaseDeleteParams) => {
  try {
    let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`
    if (params.filter?.trim()) {
      url += `&${params.filter.trim()}`
    } else {
      throw new Error(
        'Filter is required for delete operations to prevent accidental deletion of all rows'
      )
    }
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: params.apiKey,
        Authorization: `Bearer ${params.apiKey}`,
        Prefer: 'return=representation',
      },
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error from Supabase: ${response.status} ${errorText}`)
    }
    const text = await response.text()
    let data
    if (text?.trim()) {
      try {
        data = JSON.parse(text)
      } catch (e) {
        data = text
      }
    } else {
      data = []
    }
    const deletedCount = Array.isArray(data) ? data.length : text ? 1 : 0
    return {
      success: true,
      output: {
        message: `Successfully deleted ${deletedCount === 0 ? 'row(s)' : `${deletedCount} row(s)`} from ${params.table}`,
        results: data,
      },
      error: undefined,
    }
  } catch (error) {
    return {
      success: false,
      output: {
        message: `Error deleting rows from Supabase: ${error instanceof Error ? error.message : String(error)}`,
        results: null,
      },
      error: error instanceof Error ? error.message : String(error),
    }
  }
}