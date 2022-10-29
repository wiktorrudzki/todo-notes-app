import userIcon from "../../../../assets/images/icons/user.svg";
import barsIcon from "../../../../assets/images/icons/bars.svg";
import logoIcon from "../../../../assets/images/icons/logo.svg";
import "./style.css";

const Nav = () => {
  return (
    <nav className="navigation">
      <section className="header-wrapper">
        <div className="logo-wrapper">
          <img className="icon" src={logoIcon} alt="logo" />
          <div className="circle"></div>
          <header className="nav-title">app</header>
        </div>
        <img className="icon" src={barsIcon} alt="menu" />
        <h3 className="menu-title">todo</h3>
        <h3 className="menu-title">notes</h3>
      </section>
      <section className="login-wrapper">
        <p className="login-text">gość</p>
        <img className="icon" src={userIcon} alt="login" />
      </section>
    </nav>
  );
};

export default Nav;
