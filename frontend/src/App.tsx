import { useEffect, useState } from 'react';
import './App.css';
import AddEditNoteModal from './components/AddEditNoteModal';
import LoginModal from './components/LoginModal';
import Navbar from './components/Navbar';
import Note from './components/Note/index ';
import SignUpModal from './components/SignUpModal';
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

  const [showAddEditNoteModal, setShowAddEditNoteModal] =
    useState('close');
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
    <div className="px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">
      {notes.map((note) => (
        <Note
          key={note._id}
          note={note}
          onDeleteNoteClicked={deleteNote}
          onNoteClicked={(note) => {
            setNoteToEdit(note);
            setShowAddEditNoteModal('open');
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="App">
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-10">
        <AddEditNoteModal
          show={showAddEditNoteModal}
          noteToEdit={noteToEdit}
          onNoteSaved={(nNote) => {
            setNotes([...notes, nNote]);
          }}
        />
      </div>
      {/* Notes Are here */}
      {notesLoading && (
        <div className="flex items-center justify-center">
          <p>Loading Notes ...</p>
        </div>
      )}
      {showNotesLoadingError && (
        <div className="flex items-center justify-center">
          <p>Something went wrong.</p>
        </div>
      )}

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

      <SignUpModal
        show="close"
        onDismiss={() => {}}
        onSignUpSuccess={() => {}}
      />

      <LoginModal
        show="close"
        onDismiss={() => {}}
        onLoginSuccess={() => {}}
      />
    </div>
  );
}

export default App;
