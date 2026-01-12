// @ts-nocheck
  const fetchCredentials = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/auth/oauth/credentials?provider=${effectiveProviderId}`)
      if (response.ok) {
        const data = await response.json()
        setCredentials(data.credentials)
        if (selectedId && !data.credentials.some((cred: Credential) => cred.id === selectedId)) {
          setSelectedId('')
          if (!isPreview) {
            setStoreValue('')
          }
        }
        if (
          (!selectedId || !data.credentials.some((cred: Credential) => cred.id === selectedId)) &&
          data.credentials.length > 0
        ) {
          const defaultCred = data.credentials.find((cred: Credential) => cred.isDefault)
          if (defaultCred) {
            setSelectedId(defaultCred.id)
            if (!isPreview) {
              setStoreValue(defaultCred.id)
            }
          } else if (data.credentials.length === 1) {
            setSelectedId(data.credentials[0].id)
            if (!isPreview) {
              setStoreValue(data.credentials[0].id)
            }
          }
        }
      }
    } catch (error) {
      logger.error('Error fetching credentials:', { error })
    } finally {
      setIsLoading(false)
    }
  }, [effectiveProviderId, selectedId, isPreview, setStoreValue])