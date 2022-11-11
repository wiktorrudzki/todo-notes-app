import React, { useEffect, useContext, useReducer, useState } from "react";
import { UserContext } from "../../contexts/UserProvider";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Axios from "axios";

import "./style.css";
import { RegisterScreenContext } from "../../contexts/RegisterScreenProvider";
import { LoginScreenContext } from "../../contexts/LoginScreenProvider";
import { TodosContext } from "../../contexts/TodosProvider";
import Todo from "./components/Todo";
import { todoStatusReducer } from "./components/todoStatusReducer";
import WrongFormScreen from "../WrongFormScreen";

const TodoPage = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const { allTodos, setAllTodos } = useContext(TodosContext);
  const [showWrongFormScreen, setShowWrongFormScreen] = useState(false);

  const [todoStatus, todoStatusDispatch] = useReducer(todoStatusReducer, {
    category: "",
    text: "",
    progress: "TODO",
    date: "",
  });

  const { showLoginScreen, setShowLoginScreen } =
    useContext(LoginScreenContext);
  const { showRegisterScreen } = useContext(RegisterScreenContext);

  // REQUESTS

  const getTodos = () => {
    Axios.get(`${process.env.REACT_APP_API}/todos/`, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    }).then((res) => {
      if (res.data.data) {
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
        todoStatus.category = "";
        todoStatus.text = "";
        todoStatus.date = "";
      } else {
        setAllTodos([]);
      }
    });
  };

  const addTodo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (
      todoStatus.category === "" ||
      todoStatus.text === "" ||
      todoStatus.date === "" ||
      !user
    ) {
      setShowWrongFormScreen(true);
      return;
    }

    Axios.post(
      `${process.env.REACT_APP_API}/todos/add`,
      {
        position: allTodos ? allTodos.length : 0,
        category: todoStatus.category,
        date: todoStatus.date,
        progress: todoStatus.progress,
        text: todoStatus.text,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    ).then((res) => {
      if (!res.data.added) {
        if (res.data.message === "failed to authenticate") {
          setUser(null);
          setShowLoginScreen(true);
        } else {
          setErrorMessage(res.data.message);
          setShowWrongFormScreen(true);
        }
        return;
      } else {
        setErrorMessage(null);
        getTodos();
      }
    });
  };

  //GETTING TODOS ONLOAD AND WHENEVER THE USER CHANGES

  useEffect(() => {
    getTodos();
  }, [user]);

  const handleOnDragEnd = (result: any) => {
    if (result.destination == null) return;
    const items = Array.from(allTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAllTodos(items);
    Axios.patch(
      `${process.env.REACT_APP_API}/todos/updateIndex`,
      {
        id: result.draggableId,
        indexStart: result.source.index,
        indexEnd: result.destination.index,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    ).then((res) => {
      if (res.data.changed) {
        getTodos();
      }
    });
  };

  return (
    <div
      style={
        showLoginScreen || showRegisterScreen || showWrongFormScreen
          ? { height: "84vh", overflow: "hidden" }
          : {}
      }
    >
      <form className="todo-add">
        <div className="todo-add-container">
          <h4 className="todo-add-container-cell todo-add-container-cell-title">
            category
          </h4>
          <p className="todo-add-container-cell todo-add-container-cell-title">
            text
          </p>
          <h4 className="todo-add-container-cell todo-add-container-cell-title">
            progress
          </h4>
          <h5 className="todo-add-container-cell todo-add-container-cell-title">
            date
          </h5>
          <input
            value={todoStatus.category}
            className="todo-add-category todo-add-container-cell"
            required
            type="text"
            onChange={(e) =>
              todoStatusDispatch({ type: "category", payload: e.target.value })
            }
          />
          <textarea
            value={todoStatus.text}
            required
            onChange={(e) =>
              todoStatusDispatch({ type: "text", payload: e.target.value })
            }
            className="todo-add-text todo-add-container-cell"
          />
          <button
            disabled
            className="todo-add-progress todo-add-container-cell"
          >
            TODO
          </button>
          <input
            value={todoStatus.date}
            required
            className="todo-add-date todo-add-container-cell"
            type="date"
            onChange={(e) =>
              todoStatusDispatch({ type: "date", payload: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          onClick={(e) => addTodo(e)}
          className="add-todo-btn"
        >
          ADD TODO
        </button>
      </form>
      {user && <h2 className="todos-title">{user}'s all todos</h2>}
      {user && allTodos && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {allTodos.map((todo: any) => (
                  <Draggable
                    draggableId={todo.id.toString()}
                    index={todo.todo_position}
                    key={todo.id}
                  >
                    {(provided) => {
                      return (
                        <div
                          className="todo-draggable"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Todo todo={todo} />
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <WrongFormScreen
        showWrongFormScreen={showWrongFormScreen}
        user={user}
        setShowWrongFormScreen={setShowWrongFormScreen}
        message={
          errorMessage === null
            ? "FORM IS NOT FULFILLED CORRECTLY"
            : errorMessage
        }
      />
    </div>
  );
};

export default TodoPage;
