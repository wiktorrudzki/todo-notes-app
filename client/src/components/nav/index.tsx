import { useEffect, useState, useReducer } from "react";
import userIcon from "../../assets/images/icons/user.svg";
import barsIcon from "../../assets/images/icons/bars.svg";
import logoIcon from "../../assets/images/icons/logo.svg";
import xIcon from "../../assets/images/icons/x.svg";
import Axios from "axios";

import "./style.css";
import { Link } from "react-router-dom";

type Actions =
  | { type: "password"; payload: string }
  | { type: "username"; payload: string };

type LoginStatus = {
  username: string;
  password: string;
};

const Nav = () => {
  const reducer = (state: LoginStatus, action: Actions) => {
    switch (action.type) {
      case "password": {
        return { ...state, password: action.payload };
      }
      case "username": {
        return { ...state, username: action.payload };
      }
      default:
        return state;
    }
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [loginStatus, dispatch] = useReducer(reducer, {
    username: "",
    password: "",
  });

  const toggleMenu = () => {
    if (windowSize.innerWidth < 786) {
      setShowMenu((prev) => !prev);
    }
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      if (getWindowSize().innerWidth > 786) setShowMenu(true);
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    if (windowSize.innerWidth < 786) setShowMenu(false);
    else setShowMenu(true);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const submitLogin = () => {
    console.log(loginStatus);
    Axios.post("http://localhost:3001/login", {
      username: loginStatus.username,
      password: loginStatus.password,
    }).then((res) => console.log(res.data.message));
  };

  return (
    <>
      <nav className="navigation">
        <section className="header-wrapper">
          <div
            className={
              showMenu ? "logo-wrapper-on-menu logo-wrapper" : "logo-wrapper"
            }
          >
            <Link className="link" to="/">
              <img className="icon" src={logoIcon} alt="logo" />
              <div className="circle"></div>
              <header className="nav-title">app</header>
            </Link>
          </div>
          <img
            style={windowSize.innerWidth < 786 ? { cursor: "pointer" } : {}}
            onClick={toggleMenu}
            className="icon bars-icon"
            src={barsIcon}
            alt="menu icon"
          />
          <h3 className={showMenu ? "menu-title" : "menu-title-hidden"}>
            <Link className="link" to="/todo">
              todo
            </Link>
          </h3>
          <h3 className={showMenu ? "menu-title" : "menu-title-hidden"}>
            <Link className="link" to="/notes">
              notes
            </Link>
          </h3>
        </section>
        <section className="login-wrapper">
          <p className="login-text">gość</p>
          <img
            style={showLoginScreen ? {} : { cursor: "pointer" }}
            onClick={() => setShowLoginScreen((prev) => !prev)}
            className="icon"
            src={userIcon}
            alt="login"
          />
        </section>
      </nav>
      <section
        style={showLoginScreen ? {} : { display: "none" }}
        className="login-screen"
      >
        <div className="login-screen-wrapper">
          <label className="login-label">Nazwa użytkownika</label>
          <input
            onChange={(e) =>
              dispatch({ type: "username", payload: e.target.value })
            }
            className="login-input"
            required
            name="username"
            type="text"
            placeholder="wpisz nazwę użytkownika"
          />
          <label className="login-label">Hasło</label>
          <input
            onChange={(e) =>
              dispatch({ type: "password", payload: e.target.value })
            }
            className="login-input"
            required
            name="password"
            type="password"
            placeholder="wpisz swoje hasło"
          />
          <button onClick={submitLogin} className="login-submit-btn">
            Zaloguj się
          </button>
          <p className="register-btn">
            Nie posiadasz konta?{" "}
            <span style={{ color: "var(--primary)", cursor: "pointer" }}>
              Zarejestruj się
            </span>
          </p>
          <img
            onClick={() => setShowLoginScreen((prev) => !prev)}
            src={xIcon}
            className="cancel-login-btn"
            alt="cancel login"
          />
        </div>
      </section>
    </>
  );
};

export default Nav;
