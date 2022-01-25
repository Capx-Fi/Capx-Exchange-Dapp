import BigNumber from "bignumber.js";
export const approveSellTokens = async (
  vestingTokenContract,
  account,
  tokens,
  tokenDecimal,
  EXCHANGE_CONTRACT_ADDRESS,
  setApproveModalStatus,
  setTokenApproval
) => {
  let totalAmount = new BigNumber(tokens).multipliedBy(
    Math.pow(10, tokenDecimal)
  );
  console.log("account", account);
    console.log("totalAmount", totalAmount);
    console.log("vestingTokenContract", vestingTokenContract);
    console.log("EXCHANGE_CONTRACT_ADDRESS", EXCHANGE_CONTRACT_ADDRESS);
    
  let sendAmount = totalAmount.toString(10);
  let approveResult = null;
  let approvedAmount = null;

  try {
    approvedAmount = await vestingTokenContract.methods
      .allowance(account, EXCHANGE_CONTRACT_ADDRESS)
      .call();
  } catch (err) {
    setApproveModalStatus("failure");
    // enqueueSnackbar("Token Approval Failed!", { variant: "error" });
    console.log(err);
  }
  if (approvedAmount) {
    approvedAmount = new BigNumber(approvedAmount);
    if (approvedAmount.dividedBy(Math.pow(10, 6)).toString(10) === "0") {
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
            new BigNumber(0).multipliedBy(Math.pow(10, 6)).toString(10)
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
    setApproveModalStatus("");
  }, 2500);
};