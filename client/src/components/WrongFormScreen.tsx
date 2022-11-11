import xIcon from "../assets/images/icons/x.svg";

function WrongFormScreen({
  showWrongFormScreen,
  user,
  setShowWrongFormScreen,
  message,
}: any) {
  return (
    <div
      style={showWrongFormScreen ? {} : { display: "none" }}
      className="wrong-form-fulfilled-screen-wrapper"
    >
      <div className="wrong-form-fulfilled-screen">
        <p className="wrong-form-fulfilled-screen-message">
          {!user
            ? "YOU DONT HAVE ACCESS TO THIS SINCE YOU ARE NOT LOGGED IN"
            : message}
        </p>
        <img
          onClick={() => setShowWrongFormScreen(false)}
          src={xIcon}
          className="cancel-login-btn"
          alt="cancel login"
        />
      </div>
    </div>
  );
}

export default WrongFormScreen;
