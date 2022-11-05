import LoginWrapper from "./LoginAndRegisterScreen/LoginWrapper";
import xIcon from "../../../assets/images/icons/x.svg";

function LogoutScreen({ logoutScreen, setLogoutScreen, logout }: any) {
  return (
    <LoginWrapper showScreen={logoutScreen}>
      <h4 className="logout-title">Czy na pewno chcesz się wylogować?</h4>
      <button
        onClick={(e) => {
          setLogoutScreen(false);
          logout(e);
        }}
        className="logout-btn"
      >
        tak
      </button>
      <img
        onClick={() => {
          setLogoutScreen(false);
        }}
        src={xIcon}
        className="cancel-login-btn"
        alt="cancel login"
      />
    </LoginWrapper>
  );
}

export default LogoutScreen;
