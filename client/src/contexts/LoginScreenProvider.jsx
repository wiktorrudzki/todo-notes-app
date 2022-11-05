import React, { useState } from "react";

export const LoginScreenContext = React.createContext();

const LoginScreenProvider = ({ children }) => {
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  const value = {
    showLoginScreen: showLoginScreen,
    setShowLoginScreen: setShowLoginScreen,
  };

  return (
    <LoginScreenContext.Provider value={value}>
      {children}
    </LoginScreenContext.Provider>
  );
};

export default LoginScreenProvider;
