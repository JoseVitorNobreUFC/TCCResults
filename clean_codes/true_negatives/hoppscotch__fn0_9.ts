// @ts-nocheck
export const useRequestNameGeneration = (targetNameRef: Ref<string>) => {
  const toast = useToast()
  const t = useI18n()
  const route = useRoute()
  const targetPage = computed(() => {
    return route.fullPath.includes(`/graphql`) ? `gql` : `rest`
  })
  const isGenerateRequestNamePending = ref(false)
  const generateRequestNameForPlatform =
    platform.experiments?.aiExperiments?.generateRequestName
  const currentUser = useReadonlyStream(
    platform.auth.getCurrentUserStream(),
    platform.auth.getCurrentUser()
  )
  const ENABLE_AI_EXPERIMENTS = useSetting(`ENABLE_AI_EXPERIMENTS`)
  const canDoRequestNameGeneration = computed(() => {
    return ENABLE_AI_EXPERIMENTS.value && !!platform.experiments?.aiExperiments
  })
  const lastTraceID = ref<string | null>(null)
  const generateRequestName = async (
    requestContext: HoppRESTRequest | HoppGQLRequest | null
  ) => {
    if (!currentUser.value) {
      invokeAction(`modals.login.toggle`)
      return
    }
    if (!requestContext || !generateRequestNameForPlatform) {
      toast.error(t(`request.generate_name_error`))
      return
    }
    const namingStyle = useSetting(`AI_REQUEST_NAMING_STYLE`).value
    const customNamingStyle = useSetting(`CUSTOM_NAMING_STYLE`).value
    isGenerateRequestNamePending.value = true
    platform.analytics?.logEvent({
      type: `EXPERIMENTS_GENERATE_REQUEST_NAME_WITH_AI`,
      platform: targetPage.value,
    })
    const result = await generateRequestNameForPlatform(
      JSON.stringify(requestContext),
      namingStyle === `CUSTOM` ? customNamingStyle : namingStyle
    )
    if (result && E.isLeft(result)) {
      toast.error(t(`request.generate_name_error`))
      isGenerateRequestNamePending.value = false
      return
    }
    targetNameRef.value = result.right.request_name
    lastTraceID.value = result.right.trace_id
    isGenerateRequestNamePending.value = false
  }
  return {
    generateRequestName,
    isGenerateRequestNamePending,
    canDoRequestNameGeneration,
    lastTraceID,
  }
}