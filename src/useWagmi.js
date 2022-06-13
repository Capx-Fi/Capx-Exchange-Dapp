import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  WagmiConfig,
} from "wagmi";

function useWagmi() {
  const wagmiConnect = useConnect();
  const wagmiDisconnect = useDisconnect();
  const wagmiAccount = useAccount();
  const wagmiNetwork = useNetwork();

  const active = wagmiConnect.isConnected;
  const account = wagmiAccount.data?.address;
  const chainId = wagmiNetwork.activeChain?.id;
  const error = wagmiNetwork.error;
  const connectors = wagmiConnect.connectors;
  const connector = wagmiConnect.data?.connector;
  const deactivate = wagmiDisconnect.disconnect;
  const connect = wagmiConnect.connect;
  const switchNetwork = wagmiNetwork.switchNetwork;

  return {
    active,
    account,
    connector,
    deactivate,
    chainId,
    connectors,
    error,
    connect,
    switchNetwork,
  };
}

export default useWagmi;
