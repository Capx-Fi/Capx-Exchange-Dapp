import { useAccount, useConnect, useDisconnect, WagmiConfig } from "wagmi";

function useWagmi() {
  const wagmiConnect = useConnect();
  const wagmiDisconnect = useDisconnect();
  const wagmiAccount = useAccount();

  console.log("useWagmi", wagmiConnect, wagmiDisconnect, wagmiAccount);
  const active = wagmiConnect.isConnected;
  const account = wagmiAccount.data?.address;
  const chainId = wagmiConnect.data?.chain?.id;
  const connectors = wagmiConnect.connectors;
  const connector = wagmiConnect.data?.connector;
  const deactivate = wagmiDisconnect.disconnect;
  const connect = wagmiConnect.connect;

  return {
    active,
    account,
    connector,
    deactivate,
    chainId,
    connectors,
    connect,
  };
}

export default useWagmi;
