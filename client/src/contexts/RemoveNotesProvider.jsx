import React, { useState } from "react";

export const RemoveNotesContext = React.createContext();

const RemoveNotesProvider = ({ children }) => {
  const [markedNotes, setMarkedNotes] = useState([]);

  const value = {
    markedNotes: markedNotes,
    setMarkedNotes: setMarkedNotes,
  };

  return (
    <RemoveNotesContext.Provider value={value}>
      {children}
    </RemoveNotesContext.Provider>
  );
};

export default RemoveNotesProvider;
