function LoginWrapper({ children, showScreen }: any) {
  return (
    <section
      style={showScreen ? {} : { display: "none" }}
      className="login-screen"
    >
      <form className="login-screen-wrapper">{children}</form>
    </section>
  );
}

export default LoginWrapper;
