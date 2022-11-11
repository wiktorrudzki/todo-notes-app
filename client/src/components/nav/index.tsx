import React, { useEffect, useState, useReducer, useContext } from "react";
import userIcon from "../../assets/images/icons/user.svg";
import barsIcon from "../../assets/images/icons/bars.svg";
import logoIcon from "../../assets/images/icons/logo.svg";
import logoutIcon from "../../assets/images/icons/logout.svg";
import Axios from "axios";
import { UserContext } from "../../contexts/UserProvider";

import "./style.css";
import { Link } from "react-router-dom";
import { LoginScreenContext } from "../../contexts/LoginScreenProvider";
import { RegisterScreenContext } from "../../contexts/RegisterScreenProvider";
import LoginAndRegisterScreen from "./components/LoginAndRegisterScreen";
import { reducer } from "./components/loginStatusReducer";
import LogoutScreen from "./components/LogoutScreen";

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [logoutScreen, setLogoutScreen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { showLoginScreen, setShowLoginScreen } =
    useContext(LoginScreenContext);
  const { showRegisterScreen, setShowRegisterScreen } = useContext(
    RegisterScreenContext
  );

  const [loginStatus, dispatch] = useReducer(reducer, {
    username: "",
    password: "",
    confirmPassword: "",
    error: false,
    errorMessage: null,
  });

  const toggleMenu = () => {
    if (windowSize.innerWidth < 786) {
      setShowMenu((prev) => !prev);
    }
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API}/user/remember`, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    }).then((res) => {
      console.log(res.data.message);
      if (res.data.auth) {
        setUser(res.data.username);
      }
    });

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

  const submitLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (
      loginStatus.error ||
      loginStatus.password === "" ||
      loginStatus.username === ""
    ) {
      dispatch({ type: "error", payload: true, errorMessage: "error in form" });
      return;
    }

    Axios.post(`${process.env.REACT_APP_API}/user/login`, {
      username: loginStatus.username,
      password: loginStatus.password,
    }).then((res) => {
      if (res.data.auth) {
        localStorage.setItem("token", "Bearer " + res.data.token);
        localStorage.setItem("user", res.data.id);
        setUser(res.data.username);
        clearLoginStatus();
        setShowLoginScreen(false);
      } else {
        dispatch({
          type: "error",
          payload: true,
          errorMessage: res.data.message,
        });
      }
    });
  };

  const submitRegister = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      loginStatus.password === "" ||
      loginStatus.confirmPassword === "" ||
      loginStatus.username === ""
    ) {
      dispatch({ type: "error", payload: true, errorMessage: "error in form" });
      return;
    }

    if (loginStatus.error) {
      dispatch({
        type: "error",
        payload: true,
        errorMessage: loginStatus.errorMessage,
      });
    }

    Axios.post(`${process.env.REACT_APP_API}/user/register`, {
      username: loginStatus.username,
      password: loginStatus.password,
      confirmPassword: loginStatus.confirmPassword,
    }).then((res) => {
      if (res.data.created) {
        clearLoginStatus();
        setShowRegisterScreen(false);
      } else {
        dispatch({
          type: "error",
          payload: true,
          errorMessage: res.data.message,
        });
      }
    });
  };

  const clearLoginStatus = () => {
    dispatch({ type: "loginPassword", payload: "" });
    dispatch({ type: "confirmPassword", payload: "" });
    dispatch({ type: "username", payload: "" });
    dispatch({ type: "error", payload: false, errorMessage: null });
  };

  const logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    localStorage.clear();
    setUser(null);
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
          <p className="login-text">{user ? user : "gość"}</p>
          <img
            style={showLoginScreen ? {} : { cursor: "pointer" }}
            onClick={() => setShowLoginScreen((prev: boolean) => !prev)}
            className="icon"
            src={userIcon}
            alt="login"
          />
          <img
            onClick={() => setLogoutScreen(true)}
            src={logoutIcon}
            alt="logout"
            className="icon"
            style={showLoginScreen ? {} : { cursor: "pointer" }}
          />
        </section>
      </nav>
      <LogoutScreen
        logoutScreen={logoutScreen}
        setLogoutScreen={setLogoutScreen}
        logout={logout}
      />
      <LoginAndRegisterScreen
        showLoginScreen={showLoginScreen}
        dispatch={dispatch}
        loginStatus={loginStatus}
        submitLogin={submitLogin}
        setShowLoginScreen={setShowLoginScreen}
        setShowRegisterScreen={setShowRegisterScreen}
        clearLoginStatus={clearLoginStatus}
        showRegisterScreen={showRegisterScreen}
        submitRegister={submitRegister}
      />
    </>
  );
};

export default Nav;
