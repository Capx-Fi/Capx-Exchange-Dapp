import Web3 from "web3";
import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Lottie from "lottie-react";
import WithdrawingAnimation from "../../../assets/Sell/Selling.json";
import WithdrawSuccess from "../../../assets/Sell/Sell-success.json";
import WithdrawFailed from "../../../assets/Sell/Sell-failed.json";
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
      width: "300px",
      borderRadius: "16px",
    },
  },
}));
function SellModal({ open, setOpen, sellModalStatus }) {
  const [viewNFTID, setviewNFTID] = React.useState("");
  const [viewNFTDet, setviewNFTDet] = React.useState("");
  const classes = useStyles();
  const sellMessage = [
    <p>Almost there...creating the order!<br/>
    <span className="text-caption-2 phone:text-10px tablet:text-caption-3 breakpoint:text-caption-3 desktop:text-caption-2" style={{color: "#CCCCCC"}}>Please do not reload or refresh the page...</span></p>,
  ]

  const errorMessage = [
    <p>Oops! We have encountered an error.<br/>
    <span className="text-caption-2 phone:text-10px tablet:text-caption-3 breakpoint:text-caption-2" style={{color: "#CCCCCC"}}> Please try again!</span></p>,
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
          <div className="flex flex-col justify-center mx-auto items-center laptop:h-72 pb-8">
            <Lottie
              className="w-24 tablet:w-32 breakpoint:w-36 desktop:w-48"
              loop={true}
              animationData={
                sellModalStatus === "success"
                  ? WithdrawSuccess
                  : sellModalStatus === "failure"
                  ? WithdrawFailed
                  : WithdrawingAnimation
              }
            />
            <div className="text-white text-center leading-paragraph-2 phone:text-caption-2 tablet:text-caption-1 tablet:leading-heading-1 desktop:text-paragraph-1 tablet:text-center breakpoint:text-paragraph-2 font-semibold w-8/12 laptop:w-6/12 desktop:w-8/12">
              {sellModalStatus === "success"
                ? "Successfully created the order on exchange"
                : sellModalStatus === "failure"
                ? errorMessage
                : sellMessage}
            </div>
          </div>
          <hr className="border-dark-200 mt-2 mb-4 h-2"></hr>
        </div>
      </Fade>
    </Modal>
  );
}

export default SellModal;
