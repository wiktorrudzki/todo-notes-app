import Axios from "axios";
import { allColors } from "./noteColors";

const Note = ({ note, getNotes, setNoteToRemove }: any) => {
  const handleColorChange = () => {
    const index =
      note.note_colors_index === allColors.length - 1
        ? 0
        : ++note.note_colors_index;

    Axios.post(
      "http://localhost:3001/changeNoteColor",
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
    </div>
  );
};

export default Note;
