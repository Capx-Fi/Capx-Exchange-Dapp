import "./Withdraw.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import GlobalSearchBox from "../../layouts/TableLayout/GlobalSearchBox";
import MetamaskModal from "../../components/Modals/MetamaskModal/MetamaskModal";
import WithdrawTokenTable from "./WithdrawTokenTable";

import WithdrawContainer from "./WithdrawContainer";

import crossIcon from "../../assets/close-cyan.svg";
import { setWithdrawTicker } from "../../redux/actions/withdraw";

const format = "HH:mm";

function WithdrawScreen({ match }) {
  const dispatch = useDispatch();
  const { active, account, chainId } = useWeb3React();
  const [maxAmount, setMaxAmount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  var withdrawTicker = useSelector((state) => state.withdraw.withdrawTicker);

  const isValid =
    withdrawTicker?.asset !== undefined && withdrawTicker.asset !== "";

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
          <div className="hidden breakpoint:block">
            <div className="exchangeScreen_maincontainer">
              <div className="exchangeScreen_leftcontainer">
                <div className="exchangeScreen_header">
                  <div className="exchangeScreen_header_titlecontainer">
                    <p className="exchangeScreen_header_titlecontainer_title">
                      Your Portfolio
                    </p>
                    <p className="withdrawScreen_header_titlecontainer_subtitle">
                      Withdraw your tokens
                    </p>
                  </div>
                  <GlobalSearchBox filter={filter} setFilter={setFilter} />
                </div>
                <WithdrawTokenTable filter={filter} refetch={refetch} />
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

          {/* exchange below breakpoint .i.e 1280*/}
          <div className="breakpoint:hidden">
            <div
              className={`exchangeScreen_maincontainer ${
                isValid && "border border-dark-50 rounded-2xl"
              }`}
            >
              <div className="exchangeScreen_leftcontainer">
                {isValid && (
                  <div className="h-20 relative w-full bg-dark-300 text-white py-6 font-black text-paragraph-1">
                    {isValid && withdrawTicker?.asset}
                    <img
                      src={crossIcon}
                      alt="close"
                      onClick={() => dispatch(setWithdrawTicker(null))}
                      className="absolute right-14 top-6 cursor-pointer h-6"
                    />
                  </div>
                )}
                {!isValid && (
                  <div className="exchangeScreen_header">
                    <div className="exchangeScreen_header_titlecontainer">
                      <p className="exchangeScreen_header_titlecontainer_title">
                        Your Portfolio
                      </p>
                      <p className="withdrawScreen_header_titlecontainer_subtitle">
                        Withdraw your tokens
                      </p>
                    </div>
                    <GlobalSearchBox filter={filter} setFilter={setFilter} />
                  </div>
                )}
                {isValid ? (
                  <div className="w-auto  px-14 py-7">
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
                ) : (
                  <WithdrawTokenTable filter={filter} refetch={refetch} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WithdrawScreen;
