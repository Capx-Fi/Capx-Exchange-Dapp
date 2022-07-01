import {
	useAccount,
	useConnect,
	useDisconnect,
	useNetwork,
	useSwitchNetwork,
} from "wagmi";

function useWagmi() {
	const wagmiConnect = useConnect();
	const wagmiDisconnect = useDisconnect();
	const wagmiAccount = useAccount();
	const wagmiNetwork = useNetwork();
	const wagmiSwitch = useSwitchNetwork();

	const active = wagmiAccount.isConnected;
	const account = wagmiAccount.address;
	const chainId = wagmiNetwork.chain?.id;
	const error = wagmiNetwork.error;
	const connectors = wagmiConnect.connectors;
	const connector = wagmiConnect.data?.connector;
	const deactivate = wagmiDisconnect.disconnect;
	const connect = wagmiConnect.connect;
	const switchNetwork = wagmiSwitch.switchNetwork;
	const provider = wagmiAccount.connector?.getProvider().then((res) => {
		return res;
	});

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
		provider,
	};
}

export default useWagmi;
