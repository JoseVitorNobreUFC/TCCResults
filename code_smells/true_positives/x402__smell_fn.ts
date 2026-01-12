// @ts-nocheck
export async function createPaymentHeader(
  client: Signer | MultiNetworkSigner,
  x402Version: number,
  paymentRequirements: PaymentRequirements,
  config?: X402Config,
): Promise<string> {
  if (paymentRequirements.scheme === `exact`) {
    if (SupportedEVMNetworks.includes(paymentRequirements.network)) {
      const evmClient = isMultiNetworkSigner(client) ? client.evm : client;
      if (!isEvmSignerWallet(evmClient)) {
        throw new Error(`Invalid evm wallet client provided`);
      }
      return await createPaymentHeaderExactEVM(
        evmClient,
        x402Version,
        paymentRequirements,
      );
    }
    if (SupportedSVMNetworks.includes(paymentRequirements.network)) {
      const svmClient = isMultiNetworkSigner(client) ? client.svm : client;
      if (!isSvmSignerWallet(svmClient)) {
        throw new Error(`Invalid svm wallet client provided`);
      }
      return await createPaymentHeaderExactSVM(
        svmClient,
        x402Version,
        paymentRequirements,
        config,
      );
    }
    throw new Error(`Unsupported network`);
  }
  throw new Error(`Unsupported scheme`);
}