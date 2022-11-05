import { useContext } from "react";
import Axios from "axios";
import { TodosContext } from "../../../contexts/TodosProvider";

function Todo({ todo }: any) {
  const { allTodos, setAllTodos } = useContext(TodosContext);

  const changeProgress = (id: number, value: string, position: number) => {
    if (value === "TODO") {
      const newValue = "PENDING";
      Axios.post(
        "http://localhost:3001/changeProgress",
        {
          id: id,
          value: newValue,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      ).then((res) => {
        if (res.data.changed) {
          Axios.get("http://localhost:3001/todos", {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }).then((res) => {
            setAllTodos(
              res.data.data.sort((a: any, b: any) => {
                return a.todo_position - b.todo_position;
              })
            );
          });
        }
      });
    } else if (value === "PENDING") {
      const newValue = "DONE";
      Axios.post(
        "http://localhost:3001/changeProgress",
        {
          id: id,
          value: newValue,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      ).then((res) => {
        if (res.data.changed) {
          Axios.get("http://localhost:3001/todos", {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }).then((res) => {
            setAllTodos(
              res.data.data.sort((a: any, b: any) => {
                return a.todo_position - b.todo_position;
              })
            );
          });
        }
      });
    } else {
      Axios.delete("http://localhost:3001/deleteTodo", {
        headers: {
          authorization: localStorage.getItem("token"),
          id: id,
          position: position,
        },
      }).then((res) => {
        if (res.data.deleted) {
          Axios.get("http://localhost:3001/todos", {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }).then((res) => {
            if (allTodos.length === 1) setAllTodos([]);
            else
              setAllTodos(
                res.data.data.sort((a: any, b: any) => {
                  return a.todo_position - b.todo_position;
                })
              );
          });
        }
      });
    }
  };

  return (
    <div className="todo-wrapper" key={todo.id}>
      <h3 className="todo-category">{todo.todo_category}</h3>
      <p className="todo-text">{todo.todo_text}</p>
      <button
        style={
          todo.todo_progress === "TODO"
            ? { background: "#fe994a" }
            : todo.todo_progress === "PENDING"
            ? { background: "rgba(56, 78, 220, 0.43)" }
            : { background: "#00c04b" }
        }
        onClick={() =>
          changeProgress(todo.id, todo.todo_progress, todo.todo_position)
        }
        className="todo-btn"
      >
        {todo.todo_progress}
      </button>
      <p className="todo-date">{todo.todo_date.slice(0, 10)}</p>
    </div>
  );
}

export default Todo;
