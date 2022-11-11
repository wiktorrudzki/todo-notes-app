import { useContext } from "react";
import Axios from "axios";
import { TodosContext } from "../../../contexts/TodosProvider";

function Todo({ todo }: any) {
  const { allTodos, setAllTodos } = useContext(TodosContext);

  const changeProgress = (id: number, value: string, position: number) => {
    if (value === "TODO") {
      const newValue = "PENDING";
      Axios.patch(
        `${process.env.REACT_APP_API}/todos/changeProgress`,
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
          Axios.get(`${process.env.REACT_APP_API}/todos/`, {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }).then((res) => {
            let data = res.data.data;

            data = data.map((todo: any) => {
              let date = new Date(todo.todo_date);
              return { ...todo, todo_date: date.toString().slice(4, 15) };
            });
            setAllTodos(
              data.sort((a: any, b: any) => {
                return a.todo_position - b.todo_position;
              })
            );
          });
        }
      });
    } else if (value === "PENDING") {
      const newValue = "DONE";
      Axios.patch(
        `${process.env.REACT_APP_API}/todos/changeProgress`,
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
          Axios.get(`${process.env.REACT_APP_API}/todos/`, {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }).then((res) => {
            let data = res.data.data;

            data = data.map((todo: any) => {
              let date = new Date(todo.todo_date);
              return { ...todo, todo_date: date.toString().slice(4, 15) };
            });
            setAllTodos(
              data.sort((a: any, b: any) => {
                return a.todo_position - b.todo_position;
              })
            );
          });
        }
      });
    } else {
      Axios.delete(`${process.env.REACT_APP_API}/todos/`, {
        headers: {
          authorization: localStorage.getItem("token"),
          id: id,
          position: position,
        },
      }).then((res) => {
        if (res.data.deleted) {
          Axios.get(`${process.env.REACT_APP_API}/todos/`, {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }).then((res) => {
            if (allTodos.length === 1) setAllTodos([]);
            else {
              let data = res.data.data;

              data = data.map((todo: any) => {
                let date = new Date(todo.todo_date);
                return { ...todo, todo_date: date.toString().slice(4, 15) };
              });
              setAllTodos(
                data.sort((a: any, b: any) => {
                  return a.todo_position - b.todo_position;
                })
              );
            }
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
      <p className="todo-date">{todo.todo_date}</p>
    </div>
  );
}

export default Todo;
