import BigNumber from 'bignumber.js';
BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 36],
});
export const approveSellTokens = async (
  vestingTokenContract,
  account,
  tokens,
  tokenDecimal,
  EXCHANGE_CONTRACT_ADDRESS,
  setApproveModalStatus,
  setTokenApproval,
  setApproveModalOpen,
) => {
  let totalAmount = new BigNumber(tokens).multipliedBy(
    Math.pow(10, tokenDecimal)
  );

  setApproveModalOpen(true);
  let sendAmount = totalAmount.toString(10);
  let approveResult = null;
  let approvedAmount = null;

  try {
    approvedAmount = await vestingTokenContract.methods
      .allowance(account, EXCHANGE_CONTRACT_ADDRESS)
      .call();
  } catch (err) {
    setApproveModalStatus('failure');
    // enqueueSnackbar("Token Approval Failed!", { variant: "error" });
    console.log(err);
  }
  if (approvedAmount) {
    approvedAmount = new BigNumber(approvedAmount);
    if (
      approvedAmount.dividedBy(Math.pow(10, tokenDecimal)).toString(10) === "0"
    ) {
      try {
        approveResult = await vestingTokenContract.methods
          .approve(EXCHANGE_CONTRACT_ADDRESS, sendAmount)
          .send({ from: account });
      } catch (err) {
        setApproveModalStatus("failure");
        // enqueueSnackbar("Token Approval Failed!", { variant: "error" });
        console.log(err);
      }
      if (approveResult) {
        setApproveModalStatus("success");
        // enqueueSnackbar(
        //   "Approval Successful! Please proceed to transfer the tokens.",
        //   { variant: "success" }
        // );
        setTokenApproval(true);
      }
    } else {
      let approve0Result = null;
      try {
        approve0Result = await vestingTokenContract.methods
          .approve(
            EXCHANGE_CONTRACT_ADDRESS,
            new BigNumber(0)
              .multipliedBy(Math.pow(10, tokenDecimal))
              .toString(10)
          )
          .send({ from: account });
      } catch (err) {
        setApproveModalStatus("failure");
        // enqueueSnackbar("Token Approval Failed!", { variant: "error" });
        console.log(err);
      }
      if (approve0Result) {
        try {
          approveResult = await vestingTokenContract.methods
            .approve(EXCHANGE_CONTRACT_ADDRESS, sendAmount)
            .send({ from: account });
        } catch (err) {
          setApproveModalStatus("failure");
          //   enqueueSnackbar("Token Approval Failed!", { variant: "error" });
          console.log(err);
        }
        if (approveResult) {
          setApproveModalStatus("success");
          //   enqueueSnackbar(
          //     "Approval Successful! please proceed to transfer the tokens.",
          //     {
          //       variant: "success",
          //     }
          //   );
          setTokenApproval(true);
        }
      }
    }
  }
  setTimeout(() => {
    setApproveModalOpen(false);
    setApproveModalStatus('');
  }, 2500);
};
