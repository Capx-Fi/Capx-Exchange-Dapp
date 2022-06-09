import { useConnect, useDisconnect, WagmiConfig } from "wagmi";

function useWagmi(currentConnector) {
  console.log(currentConnector);
  const wagmiConnect = useConnect({
    connector: currentConnector,
  });
  const wagmiDisconnect = useDisconnect();
  const active = wagmiConnect.isConnected;
  const account = wagmiConnect.data?.address;
  const chainId = wagmiConnect.data?.chain?.id;
  const connector = wagmiConnect.data?.connector;
  const deactivate = wagmiDisconnect.disconnect;

  return {
    active,
    account,
    connector,
    connect: wagmiConnect.connect,
    deactivate,
    chainId,
  };
}

export default useWagmi;
