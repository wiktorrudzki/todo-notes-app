import xIcon from "../../../../assets/images/icons/x.svg";
import LoginWrapper from "./LoginWrapper";

export default function LoginAndRegisterScreen({
  showLoginScreen,
  dispatch,
  loginStatus,
  submitLogin,
  setShowLoginScreen,
  setShowRegisterScreen,
  clearLoginStatus,
  showRegisterScreen,
  submitRegister,
}: any) {
  return (
    <>
      <LoginWrapper showScreen={showLoginScreen}>
        <label className="login-label">Nazwa użytkownika</label>
        <input
          onChange={(e) =>
            dispatch({ type: "username", payload: e.target.value })
          }
          value={loginStatus.username}
          className="login-input"
          required
          name="username"
          type="text"
          placeholder="wpisz nazwę użytkownika"
        />
        <label className="login-label">Hasło</label>
        <input
          onChange={(e) =>
            dispatch({ type: "loginPassword", payload: e.target.value })
          }
          value={loginStatus.password}
          className="login-input"
          required
          name="password"
          type="password"
          placeholder="wpisz swoje hasło"
          autoComplete="on"
        />
        {loginStatus.error ? (
          <span style={{ color: "red", textAlign: "center" }} className="err">
            {loginStatus.errorMessage}
          </span>
        ) : (
          <span></span>
        )}
        <button onClick={(e) => submitLogin(e)} className="login-submit-btn">
          Zaloguj się
        </button>
        <p className="register-btn">
          Nie posiadasz konta?{" "}
          <span
            onClick={() => {
              setShowLoginScreen(false);
              clearLoginStatus();
              setShowRegisterScreen(true);
            }}
            style={{ color: "var(--primary)", cursor: "pointer" }}
          >
            Zarejestruj się
          </span>
        </p>
        <img
          onClick={() => {
            setShowLoginScreen(false);
            clearLoginStatus();
          }}
          src={xIcon}
          className="cancel-login-btn"
          alt="cancel login"
        />
      </LoginWrapper>

      {/* REGISTER SCREEN */}

      <LoginWrapper showScreen={showRegisterScreen}>
        <label className="login-label">Nazwa użytkownika</label>
        <input
          onChange={(e) =>
            dispatch({ type: "username", payload: e.target.value })
          }
          value={loginStatus.username}
          className="login-input"
          required
          name="username"
          type="text"
          placeholder="wpisz nazwę użytkownika"
        />
        <label className="login-label">Hasło</label>
        <input
          onChange={(e) => {
            dispatch({ type: "registerPassword", payload: e.target.value });
          }}
          value={loginStatus.password}
          className="login-input"
          required
          name="password"
          type="password"
          placeholder="wpisz swoje hasło"
          autoComplete="on"
        />
        <label className="login-label">Potwierdź hasło</label>
        <input
          onChange={(e) => {
            dispatch({ type: "confirmPassword", payload: e.target.value });
          }}
          value={loginStatus.confirmPassword}
          className="login-input"
          required
          name="password"
          type="password"
          placeholder="wpisz swoje hasło"
          autoComplete="on"
        />
        {loginStatus.error ? (
          <span style={{ color: "red", textAlign: "center" }} className="err">
            {loginStatus.errorMessage}
          </span>
        ) : (
          <span></span>
        )}
        <button onClick={(e) => submitRegister(e)} className="login-submit-btn">
          Zarejestruj się
        </button>
        <p className="register-btn">
          Masz juz konto?{" "}
          <span
            onClick={() => {
              setShowLoginScreen(true);
              clearLoginStatus();
              setShowRegisterScreen(false);
            }}
            style={{ color: "var(--primary)", cursor: "pointer" }}
          >
            Zaloguj się
          </span>
        </p>
        <img
          onClick={() => {
            setShowRegisterScreen(false);
            clearLoginStatus();
          }}
          src={xIcon}
          className="cancel-login-btn"
          alt="cancel login"
        />
      </LoginWrapper>
    </>
  );
}
