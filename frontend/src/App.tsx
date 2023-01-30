import { useEffect, useState } from 'react';
import './App.css';
import AddEditNoteModal from './components/AddEditNoteModal';
import Note from './components/Note/index ';
import { Note as NoteModel } from './models/note';
import * as NotesAPI from './network/notes_api';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(
    null
  );
  const [notesLoading, setNotesLoading] = useState(false);
  const [showNotesLoadingError, setShowNotesLoadingError] =
    useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setShowNotesLoadingError(false);
      setNotesLoading(true);
      const notes = await NotesAPI.fetchNotes();
      setNotes(notes);
    } catch (error) {
      console.error(error);
      setShowNotesLoadingError(true);
    } finally {
      setNotesLoading(false);
    }
  }

  async function deleteNote(note: NoteModel) {
    try {
      await NotesAPI.deleteNote(note._id);
      setNotes(
        notes.filter((existingNote) => existingNote._id !== note._id)
      );
    } catch (error) {
      console.error(error);
    }
  }

  const notesGrid = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Note
          key={note._id}
          note={note}
          onDeleteNoteClicked={deleteNote}
          onNoteClicked={setNoteToEdit}
        />
      ))}
    </div>
  );

  return (
    <div className="App p-10">
      <div className="py-10">
        <AddEditNoteModal
          onNoteSaved={(nNote) => {
            setNotes([...notes, nNote]);
          }}
        />
      </div>
      {/* Notes Are here */}
      {notesLoading && <p>Loading Notes ...</p>}
      {showNotesLoadingError && <p>Something went wrong.</p>}

      {!notesLoading && !showNotesLoadingError && (
        <>
          {notes.length > 0 ? (
            notesGrid
          ) : (
            <p>You don't have any notes yet.</p>
          )}
        </>
      )}
      {/* {noteToEdit && (
        <AddEditNoteModal
          noteToEdit={noteToEdit}
          onNoteSaved={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id
                  ? updatedNote
                  : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )} */}
    </div>
  );
}

export default App;
