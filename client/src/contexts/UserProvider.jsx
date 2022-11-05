import React, { useState } from "react";

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = {
    user: user,
    setUser: setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
