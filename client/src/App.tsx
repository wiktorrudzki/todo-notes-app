import Home from "./components/home";
import Notes from "./components/notes";
import Todo from "./components/todo";
import "./global-styles/global.css";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/home/components/nav";

function App() {
  return (
    <div className="app">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </div>
  );
}

export default App;
