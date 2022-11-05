import React, { useState } from "react";

export const RegisterScreenContext = React.createContext();

const RegisterScreenProvider = ({ children }) => {
  const [showRegisterScreen, setShowRegisterScreen] = useState(false);

  const value = {
    showRegisterScreen: showRegisterScreen,
    setShowRegisterScreen: setShowRegisterScreen,
  };

  return (
    <RegisterScreenContext.Provider value={value}>
      {children}
    </RegisterScreenContext.Provider>
  );
};

export default RegisterScreenProvider;
