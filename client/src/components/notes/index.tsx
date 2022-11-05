import { useContext, useReducer, useState, useEffect, useRef } from "react";
import Axios from "axios";
import { UserContext } from "../../contexts/UserProvider";
import { LoginScreenContext } from "../../contexts/LoginScreenProvider";
import { NotesContext } from "../../contexts/NotesProvider";
import { RegisterScreenContext } from "../../contexts/RegisterScreenProvider";
import xIcon from "../../assets/images/icons/x.svg";
import binIcon from "../../assets/images/icons/bin.svg";

import "./style.css";
import Note from "./components/Note";

type NoteStatus = {
  title: string;
  text: string;
};

type Actions =
  | { type: "title"; payload: string }
  | { type: "text"; payload: string };

const Notes = () => {
  const { user, setUser } = useContext(UserContext);
  const { allNotes, setAllNotes } = useContext(NotesContext);

  const removeNoteRef = useRef<HTMLDivElement>(null);

  const [showWrongFormScreen, setShowWrongFormScreen] = useState(false);
  const [noteToRemove, setNoteToRemove] = useState(null);

  const { showLoginScreen, setShowLoginScreen } = useContext(LoginScreenContext);
  const { showRegisterScreen } = useContext(RegisterScreenContext);

  const notesStatusReducer = (state: NoteStatus, action: Actions) => {
    switch (action.type) {
      case "title":
        return { ...state, title: action.payload };
      case "text":
        return { ...state, text: action.payload };
      default:
        return state;
    }
  };

  const [noteStatus, noteStatusDispatch] = useReducer(notesStatusReducer, {
    title: "",
    text: "",
  });

  const getNotes = () => {
    Axios.get("http://localhost:3001/notes", {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    }).then((res) => {
      if (res.data.data) {
        setAllNotes(res.data.data);
        noteStatus.title = "";
        noteStatus.text = "";
      } else {
        setAllNotes([]);
      }
    });
  };

  const addNote = () => {
    if (noteStatus.title === "" || noteStatus.text === "" || !user) {
      setShowWrongFormScreen(true);
      return;
    }

    Axios.post(
      "http://localhost:3001/addNote",
      {
        title: noteStatus.title,
        text: noteStatus.text,
        position: allNotes.length,
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
        getNotes();
      }
    });
  };

  useEffect(() => {
    getNotes();
  }, [user]);

  const onDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (removeNoteRef.current) {
      removeNoteRef.current.style.background =
        "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1))";
    }
  };

  const onDragLeave = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (removeNoteRef.current) {
      removeNoteRef.current.style.background = "";
    }
  };

  const onDrop = () => {
    if (removeNoteRef.current) {
      removeNoteRef.current.style.background = "";
    }
    Axios.delete("http://localhost:3001/deleteNote", {
      headers: {
        authorization: localStorage.getItem("token"),
        id: noteToRemove,
      },
    }).then((res) => {
      if (res.data.deleted) getNotes();
    });
  };

  return (
    <div
      style={
        showLoginScreen || showRegisterScreen || showWrongFormScreen
          ? { height: "84vh", overflow: "hidden" }
          : {}
      }
      className="notes"
    >
      <div className="add-note-container">
        <div className="note-wrapper-add">
          <div className="note-title-add-container">
            <input
              value={noteStatus.title}
              onChange={(e) =>
                noteStatusDispatch({ type: "title", payload: e.target.value })
              }
              type="text"
              placeholder="title"
              className="note-title-add"
            />
          </div>
          <textarea
            value={noteStatus.text}
            onChange={(e) =>
              noteStatusDispatch({ type: "text", payload: e.target.value })
            }
            placeholder="text of your note..."
            className="note-text-add"
          />
        </div>
        <button className="add-note-btn" onClick={addNote}>
          add note
        </button>
      </div>
      <div onDragOver={onDragLeave} className="notes-wrapper">
        {user &&
          allNotes &&
          allNotes.map((note: any) => {
            return (
              <Note
                key={note.id}
                setNoteToRemove={setNoteToRemove}
                getNotes={getNotes}
                note={note}
              />
            );
          })}
      </div>
      <div
        ref={removeNoteRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="remove-notes"
      >
        <img
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="bin-icon"
          src={binIcon}
          alt="bin icon"
        />
      </div>
      <div
        style={showWrongFormScreen ? {} : { display: "none" }}
        className="wrong-form-fulfilled-screen-wrapper"
      >
        <div className="wrong-form-fulfilled-screen">
          <p className="wrong-form-fulfilled-screen-message">
            {!user
              ? "YOU DONT HAVE ACCESS TO THIS SINCE YOU ARE NOT LOGGED IN"
              : "FORM IS NOT FULFILLED CORRECTLY"}
          </p>
          <img
            onClick={() => setShowWrongFormScreen(false)}
            src={xIcon}
            className="cancel-login-btn"
            alt="cancel login"
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
