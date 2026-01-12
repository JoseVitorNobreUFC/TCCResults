// @ts-nocheck
async function addListenerWithLimitations(identifier: string): Promise<ProgressResp> {
  const waitCount = 10;
  let count = 0;
  return new Promise((resolve, reject) => {
    const handleResponse = (response: string) => {
      const parsedResponse = JSON.parse(response);
      if (parsedResponse.identifier === identifier) {
        clearTimeout(timeoutId);
        window.desktopApi.removeListener('plugin-manager', handleResponse);
        resolve(parsedResponse);
      } else if (++count >= waitCount) {
        clearTimeout(timeoutId);
        window.desktopApi.removeListener('plugin-manager', handleResponse);
        reject(new Error('Message limit exceeded without a matching response'));
      }
    };
    window.desktopApi.receive('plugin-manager', handleResponse);
    const timeoutId = setTimeout(() => {
      window.desktopApi.removeListener('plugin-manager', handleResponse);
      reject(new Error('Timeout exceeded without a matching response'));
    }, 10000);
  });
}