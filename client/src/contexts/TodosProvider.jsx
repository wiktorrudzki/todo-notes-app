import React, { useState } from "react";

export const TodosContext = React.createContext();

const TodosProvider = ({ children }) => {
  const [allTodos, setAllTodos] = useState([]);

  const value = {
    allTodos: allTodos,
    setAllTodos: setAllTodos,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export default TodosProvider;
