import "./Footer.scss";

function Footer({ vesting }) {
  return (
    <footer className={`${vesting ? "footerVesting" : "footer"}`}>
      <div className="footer_text">© 2023 CapX All rights reserved.</div>
    </footer>
  );
}

export default Footer;
