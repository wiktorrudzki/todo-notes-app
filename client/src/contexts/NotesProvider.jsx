import React, { useState } from "react";

export const NotesContext = React.createContext();

const NotesProvider = ({ children }) => {
  const [allNotes, setAllNotes] = useState([]);

  const value = {
    allNotes: allNotes,
    setAllNotes: setAllNotes,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

export default NotesProvider;
