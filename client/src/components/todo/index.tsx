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
import WrongFormScreen from "./components/WrongFormScreen";

const TodoPage = () => {
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
    Axios.get("http://localhost:3001/todos", {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    }).then((res) => {
      if (res.data.data) {
        setAllTodos(
          res.data.data.sort((a: any, b: any) => {
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
      todoStatus.progress === "" ||
      todoStatus.text === "" ||
      !user
    ) {
      setShowWrongFormScreen(true);
      return;
    }

    Axios.post(
      "http://localhost:3001/addTodo",
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
        setUser(null);
        setShowLoginScreen(true);
        return;
      } else {
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
    Axios.post(
      "http://localhost:3001/updateIndex",
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
          <button className="todo-add-progress todo-add-container-cell">
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
      />
    </div>
  );
};

export default TodoPage;
