// NoteState.jsx
import { useReducer } from "react";
import NoteContext from "./NoteContext";

// Initial state
const initialState = {
  notes: [],
  loading: false,
  error: null,
};

// Reducer function
const noteReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_NOTES_START":
    case "ADD_NOTE_START":
    case "DELETE_NOTE_START":
    case "EDIT_NOTE_START":
    case "SEARCH_NOTES_START":
      return { ...state, loading: true, error: null };

    case "FETCH_NOTES_SUCCESS":
    case "SEARCH_NOTES_SUCCESS":
      return { ...state, loading: false, notes: action.payload };

    case "ADD_NOTE_SUCCESS":
      return { ...state, loading: false, notes: [...state.notes, action.payload] };

    case "DELETE_NOTE_SUCCESS":
      return { ...state, loading: false, notes: state.notes.filter(note => note._id !== action.payload) };

    case "EDIT_NOTE_SUCCESS":
      return {
        ...state,
        loading: false,
        notes: state.notes.map(note =>
          note._id === action.payload.id
            ? { ...note, title: action.payload.title, description: action.payload.description, tag: action.payload.tag }
            : note
        ),
      };

    case "OPERATION_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const NoteState = (props) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // ✅ Host from environment variable (works local + Vercel)
  const host = import.meta.env.VITE_API_BASE_URL;

  // ✅ Auth token from localStorage (do NOT hardcode)
  const authToken = localStorage.getItem("token");

  // Get all notes
  const getNotes = async () => {
    dispatch({ type: "FETCH_NOTES_START" });
    try {
      const response = await fetch(`${host}/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      const json = await response.json();
      dispatch({ type: "FETCH_NOTES_SUCCESS", payload: json });
    } catch (error) {
      dispatch({ type: "OPERATION_FAILURE", payload: error.message });
    }
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    dispatch({ type: "ADD_NOTE_START" });
    try {
      const response = await fetch(`${host}/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const note = await response.json();
      dispatch({ type: "ADD_NOTE_SUCCESS", payload: note });
    } catch (error) {
      dispatch({ type: "OPERATION_FAILURE", payload: error.message });
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    dispatch({ type: "DELETE_NOTE_START" });
    try {
      await fetch(`${host}/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      dispatch({ type: "DELETE_NOTE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "OPERATION_FAILURE", payload: error.message });
    }
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    dispatch({ type: "EDIT_NOTE_START" });
    try {
      await fetch(`${host}/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      dispatch({ type: "EDIT_NOTE_SUCCESS", payload: { id, title, description, tag } });
    } catch (error) {
      dispatch({ type: "OPERATION_FAILURE", payload: error.message });
    }
  };

  // Search notes
  const searchNotes = async (query) => {
    if (!query || query.trim() === "") {
      getNotes();
      return;
    }
    dispatch({ type: "SEARCH_NOTES_START" });
    try {
      const response = await fetch(`${host}/notes/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      const json = await response.json();
      dispatch({ type: "SEARCH_NOTES_SUCCESS", payload: json });
    } catch (error) {
      dispatch({ type: "OPERATION_FAILURE", payload: error.message });
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes: state.notes,
        loading: state.loading,
        error: state.error,
        getNotes,
        addNote,
        deleteNote,
        editNote,
        searchNotes,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;