import Home from "./components/home";
import Notes from "./components/notes";
import Todo from "./components/todo";
import "./global-styles/global.css";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/nav";
import UserProvider from "./contexts/UserProvider";
import LoginScreenProvider from "./contexts/LoginScreenProvider";
import RegisterScreenProvider from "./contexts/RegisterScreenProvider";
import TodosProvider from "./contexts/TodosProvider";
import NotesProvider from "./contexts/NotesProvider";

function App() {
  return (
    <div className="app">
      <UserProvider>
        <LoginScreenProvider>
          <RegisterScreenProvider>
            <TodosProvider>
              <NotesProvider>
                <Nav />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/todo" element={<Todo />} />
                  <Route path="/notes" element={<Notes />} />
                </Routes>
              </NotesProvider>
            </TodosProvider>
          </RegisterScreenProvider>
        </LoginScreenProvider>
      </UserProvider>
    </div>
  );
}

export default App;
