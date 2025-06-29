import { useEffect, useState } from "react";
import "./App.css";
import { format } from "timeago.js";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all notes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  // Add a new note
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const newNote = await res.json();
    setNotes([...notes, newNote]); // update UI
    setTitle(""); // clear form
    setContent("");
    setSuccessMsg("Note added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  //delete a note
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "DELETE",
    });
    setNotes(notes.filter((note) => note._id !== id));
    setDeleteMsg("Note deleted successfully!");
    setTimeout(() => setDeleteMsg(""), 3000);
    setNoteToDelete(null);
  };

  //Edit a note
  const handleUpdate = async (id) => {
    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    const updatedNote = await res.json();

    setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));

    setNoteToEdit(null); // close the popup
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {successMsg && <div className="success-msg">{successMsg}</div>}
      {deleteMsg && <div className="delete-msg">{deleteMsg}</div>}

      {noteToDelete && (
        <div className="popup">
          <div className="popup-inner">
            <p>Are you sure you want to delete this note?</p>
            <button onClick={() => handleDelete(noteToDelete)}>
              Yes, Delete
            </button>
            <button onClick={() => setNoteToDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
      {noteToEdit && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Edit Note</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Content"
            ></textarea>
            <br />
            <button onClick={() => handleUpdate(noteToEdit)}>Update</button>
            <button onClick={() => setNoteToEdit(null)}>Cancel</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit">Add Note</button>
      </form>

      <hr />
      <h2>All Notes</h2>
      <ul>
        {notes
          .filter(
            (note) =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((note) => (
            <div key={note._id} className="note">
              <strong>{note.title}</strong>
              <p>{note.content}</p>

              <p className="timestamp">Created: {format(note.createdAt)}</p>

              {note.updatedAt !== note.createdAt && (
                <p className="timestamp">Updated: {format(note.updatedAt)}</p>
              )}

              <button onClick={() => setNoteToDelete(note._id)}>Delete</button>
              <button
                onClick={() => {
                  setNoteToEdit(note._id);
                  setEditTitle(note.title);
                  setEditContent(note.content);
                }}
              >
                Edit
              </button>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default App;
