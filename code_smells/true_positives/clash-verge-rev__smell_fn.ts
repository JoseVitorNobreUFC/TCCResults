// @ts-nocheck
  const onSave = useLockFn(async () => {
    try {
      let config: Record<string, any>;
      if (visualization) {
        config = {};
        const dnsConfig = generateDnsConfig();
        if (Object.keys(dnsConfig).length > 0) {
          config.dns = dnsConfig;
        }
        const hosts = parseHosts(values.hosts);
        if (Object.keys(hosts).length > 0) {
          config.hosts = hosts;
        }
      } else {
        const parsedConfig = yaml.load(yamlContent);
        if (typeof parsedConfig !== 'object' || parsedConfig === null) {
          throw new Error(t('settings.modals.dns.errors.invalid'));
        }
        config = parsedConfig as Record<string, any>;
      }
      await invoke('save_dns_config', { dnsConfig: config });
      const [isValid, errorMsg] = await invoke<[boolean, string]>(
        'validate_dns_config',
        {},
      );
      if (!isValid) {
        let cleanErrorMsg = errorMsg;
        if (errorMsg.includes('level=error')) {
          const errorLines = errorMsg
            .split('\n')
            .filter(
              (line) =>
                line.includes('level=error') ||
                line.includes('level=fatal') ||
                line.includes('failed'),
            );
          if (errorLines.length > 0) {
            cleanErrorMsg = errorLines
              .map((line) => {
                const msgMatch = line.match(/msg='([^']+)'/);
                return msgMatch ? msgMatch[1] : line;
              })
              .join(', ');
          }
        }
        showNotice.error(
          'settings.modals.dns.messages.configError',
          cleanErrorMsg,
        );
        return;
      }
      if (clash?.dns?.enable) {
        await invoke('apply_dns_config', { apply: true });
        mutateClash();
      }
      setOpen(false);
      showNotice.success('settings.modals.dns.messages.saved');
    } catch (err) {
      showNotice.error(err);
    }
  });