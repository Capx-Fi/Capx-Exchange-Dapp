import Web3 from "web3";
import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Lottie from "lottie-react";
import ApproveToChain from "../../../assets/Approve/Approve-to-Chain.json";
import ApproveToChainSuccess from "../../../assets/Approve/Approve-successful.json";
import ApproveToChainFailure from "../../../assets/Approve/Approve-failed.json";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    zIndex: "9999",
    color: "#F1FAF2",
  },
  paper: {
    background: "linear-gradient(215.24deg, #263232 3.85%, #1a1f23 89.73%)",
    borderRadius: "35px",
    padding: theme.spacing(2, 0, 3),
    outline: "none",
    width: "800px",
    "@media (max-width:1023px)": {
      width: "500px",
      borderRadius: "24px",
    },
    "@media (max-width:640px)": {
      width: "400px",
      borderRadius: "24px",
    },

    "@media (max-width:420px)": {
      width: "280px",
      borderRadius: "16px",
    },
  },
}));
function ApproveModal({
  imageData,
  buyMode,
  openAdUrl,
  handleBuy,
  showModal,
  open,
  setOpen,
  approveModalStatus,
}) {
  const [viewNFTID, setviewNFTID] = React.useState("");
  const [viewNFTDet, setviewNFTDet] = React.useState("");
  const classes = useStyles();

  const handleOpen = (index, items) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Variable for styling do not refresh message under a span
  const approveMessage = [
    <p>The tokens are being approved!<br/>
    <span className="text-caption-2" style={{color: "#CCCCCC"}}>Please do not reload or refresh the page...</span></p>,
  ]

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <div className="flex flex-col laptop:flex-row breakpoint:flex-col justify-center mx-auto items-center laptop:h-72 pb-8 mt-8">
            <Lottie
              className="w-24 tablet:w-32 laptop:w-56 desktop:w-36 "
              loop={true}
              animationData={
                approveModalStatus === "success"
                  ? ApproveToChainSuccess
                  : approveModalStatus === "failure"
                  ? ApproveToChainFailure
                  : ApproveToChain
              }
            />
            <div className="text-white text-center font-bold tablet:font-semibold laptop:text-left text-paragraph-2 leading-paragraph-2 tablet:text-heading-2 tablet:leading-heading-2 laptop:text-heading-1 laptop:leading-heading-1 desktop:text-heading-3 desktop:text-center w-8/12 laptop:w-6/12">
              {approveModalStatus === "success"
                ? "Approval successful! You can now swap your tokens."
                : approveModalStatus === "failure"
                ? "Oops! We have encountered an error. Please try again!"
                : approveMessage}
            </div>
          </div>
          <hr className="border-dark-200 mt-2 h-2"></hr>
        </div>
      </Fade>
    </Modal>
  );
}

export default ApproveModal;
