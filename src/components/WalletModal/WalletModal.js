import MetamaskModal from "../Modals/MetamaskModal/MetamaskModal";
import ChooseWalletModal from "../Modals/ChooseWalletModal/ChooseWalletModal";

const WalletModal = ({ modalMode, setModalMode }) => {
	if (modalMode === 0) {
		return <MetamaskModal setModalMode={setModalMode} />;
	} else {
		return <ChooseWalletModal setModalMode={setModalMode} />;
	}
};

export default WalletModal;
