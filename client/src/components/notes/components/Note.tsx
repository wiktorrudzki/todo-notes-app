import { useState, useContext } from "react";
import Axios from "axios";
import { allColors } from "./noteColors";
import { RemoveNotesContext } from "../../../contexts/RemoveNotesProvider";

const Note = ({ note, getNotes, setNoteToRemove }: any) => {
  const { setMarkedNotes } = useContext(RemoveNotesContext);

  const handleColorChange = (e: any) => {
    if (e.target.type && e.target.type === "checkbox") {
      return;
    }
    const index =
      note.note_colors_index === allColors.length - 1
        ? 0
        : ++note.note_colors_index;

    Axios.patch(
      `${process.env.REACT_APP_API}/notes/changeColor`,
      {
        index: index,
        color: allColors[index].color,
        background: allColors[index].background,
        id: note.id,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    ).then((res) => {
      if (!res.data.changed) {
        console.log("error");
      } else {
        getNotes();
      }
    });
  };

  const onDragStart = () => {
    setNoteToRemove(note.id);
  };

  //eslint-disable-next-line
  const [isMarked, setIsMarked] = useState(false);

  const toggleMarked = () => {
    setIsMarked((prev: any) => {
      if (prev) {
        setMarkedNotes((prevNotes: any) =>
          prevNotes.filter((prevNote: any) => prevNote !== note.id)
        );
        return false;
      } else {
        setMarkedNotes((prevNotes: any) => [...prevNotes, note.id]);
        return true;
      }
    });
  };

  return (
    <div
      draggable="true"
      onDragStart={onDragStart}
      onClick={handleColorChange}
      style={{ background: note.note_color }}
      className="note-wrapper"
    >
      <div className="note-title-container">
        <h3 className="note-title">{note.note_title}</h3>
      </div>
      <div style={{ background: note.note_background }} className="note-text">
        {note.note_text}
      </div>
      <input
        onChange={toggleMarked}
        className="note-checkbox"
        type="checkbox"
      />
    </div>
  );
};

export default Note;
