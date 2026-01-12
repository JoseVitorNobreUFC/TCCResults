// @ts-nocheck
React.useEffect(() => {
  const clonedItem = _.cloneDeep(item);
  if (!item || Object.keys(item || {}).length === 0) {
    const defaultCode = '# Enter your YAML or JSON here';
    originalCodeRef.current = { code: defaultCode, format: 'yaml' };
    setCode({ code: defaultCode, format: 'yaml' });
    return;
  }
  if (allowToHideManagedFields && hideManagedFields) {
    if (isKubeObjectIsh(clonedItem) && clonedItem.metadata) {
      delete clonedItem.metadata.managedFields;
    }
  }
  const format = looksLikeJson(originalCodeRef.current.code) ? 'json' : 'yaml';
  const itemCode = format === 'json' ? JSON.stringify(clonedItem) : yaml.dump(clonedItem);
  if (itemCode !== originalCodeRef.current.code) {
    originalCodeRef.current = { code: itemCode, format };
    setCode({ code: itemCode, format });
  }
  if (isKubeObjectIsh(item) && item.metadata) {
    const resourceVersionsDiffer =
      (previousVersionRef.current || '') !== (item.metadata!.resourceVersion || '');
    if (resourceVersionsDiffer || codeRef.current.code === originalCodeRef.current.code) {
      if (codeRef.current.code !== itemCode) {
        setCode({ code: itemCode, format: originalCodeRef.current.format });
      }
      if (resourceVersionsDiffer && !!item.metadata!.resourceVersion) {
        previousVersionRef.current = item.metadata!.resourceVersion;
      }
    }
  }
}, [item, hideManagedFields]);