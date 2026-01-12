// @ts-nocheck
transferSubscriptionToOrganization: async (orgId: string) => {
  const { hasTeamPlan, hasEnterprisePlan } = get()
  try {
    const userSubResponse = await client.subscription.list()
    let teamSubscription: Subscription | null =
      (userSubResponse.data?.find(
        (sub) => (sub.plan === 'team' || sub.plan === 'enterprise') && sub.status === 'active'
      ) as Subscription | undefined) || null
    if (!teamSubscription && hasEnterprisePlan) {
      const billingResponse = await fetch('/api/billing?context=user')
      if (billingResponse.ok) {
        const billingData = await billingResponse.json()
        if (billingData.success && billingData.data.isEnterprise && billingData.data.status) {
          teamSubscription = {
            id: `subscription_${Date.now()}`,
            plan: billingData.data.plan,
            status: billingData.data.status,
            seats: billingData.data.seats,
            referenceId: billingData.data.organizationId || 'unknown',
          }
        }
      }
    }
    if (teamSubscription) {
      const transferResponse = await fetch(
        `/api/users/me/subscription/${teamSubscription.id}/transfer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: orgId,
          }),
        }
      )
      if (!transferResponse.ok) {
        const errorText = await transferResponse.text()
        let errorMessage = 'Failed to transfer subscription'

        try {
          if (errorText?.trim().startsWith('{')) {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.error || errorMessage
          }
        } catch (_e) {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }
    }
  } catch (error) {
    logger.error('Subscription transfer failed', { error })
    throw error
  }
}