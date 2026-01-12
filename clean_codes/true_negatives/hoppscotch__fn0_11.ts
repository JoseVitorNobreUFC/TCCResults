// @ts-nocheck
export async function generateAuthHeaders(
  auth: HoppRESTAuth,
  request: HoppRESTRequest,
  envVars: Environment[`variables`],
  showKeyIfSecret = false
): Promise<HoppRESTHeader[]> {
  switch (auth.authType) {
    case `basic`:
      return generateBasicAuthHeaders(auth, request, envVars, showKeyIfSecret)
    case `bearer`:
      return generateBearerAuthHeaders(auth, request, envVars, showKeyIfSecret)
    case `api-key`:
      return auth.addTo === `HEADERS`
        ? generateApiKeyAuthHeaders(auth, request, envVars, showKeyIfSecret)
        : []
    case `oauth-2`:
      return generateOAuth2AuthHeaders(auth, request, envVars, showKeyIfSecret)
    case `digest`:
      return generateDigestAuthHeaders(auth, request, envVars, showKeyIfSecret)
    case `aws-signature`:
      return generateAwsSignatureAuthHeaders(auth, request, envVars)
    case `hawk`:
      return generateHawkAuthHeaders(auth, request, envVars, showKeyIfSecret)
    case `jwt`:
      return generateJwtAuthHeaders(auth, request, envVars, showKeyIfSecret)
    default:
      return []
  }
}