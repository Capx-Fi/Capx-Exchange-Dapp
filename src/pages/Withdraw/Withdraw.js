import "./Withdraw.scss";
import React, { useEffect, useState } from "react";
import { hideSideNav } from "../../redux/actions/sideNav";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import GlobalSearchBox from "../../layouts/TableLayout/GlobalSearchBox";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import WithdrawTokenTable from "./WithdrawTokenTable";
import WithdrawContainer from "./WithdrawContainer";
const format = "HH:mm";

function WithdrawScreen({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const { active, account, chainId } = useWeb3React();
  const [payAmount, setPayAmount] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState(null);
  const [assetPrice, setAssetPrice] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  return (
    <>
      {!active ? (
        <MetamaskModal />
      ) : (
        <div
          style={{
            filter: withdrawModalOpen ? "blur(10000px)" : "none",
          }}
          className="exchangeScreen"
        >
          <div className="exchangeScreen_maincontainer">
            <div className="exchangeScreen_leftcontainer">
              <div className="exchangeScreen_header">
                <div className="exchangeScreen_header_titlecontainer">
                  <p className="exchangeScreen_header_titlecontainer_title">
                    Your Portfolio
                  </p>
                  <p className="exchangeScreen_header_titlecontainer_subtitle">
                    Withdraw your tokens
                  </p>
                </div>
                <GlobalSearchBox filter={filter} setFilter={setFilter} />
              </div>
              <WithdrawTokenTable filter={filter} reftch = {refetch}/>
            </div>

            <WithdrawContainer
              withdrawModalOpen={withdrawModalOpen}
              setWithdrawModalOpen={setWithdrawModalOpen}
              refetch={refetch}
              setRefetch={setRefetch}
              ticker={match.params.ticker}
              balance={balance}
              setMaxAmount={setMaxAmount}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default WithdrawScreen;
