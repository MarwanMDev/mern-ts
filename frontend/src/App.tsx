import React, { useEffect, useState } from 'react';
import './App.css';
import AddNoteModal from './components/AddNoteModal';
import Note from './components/Note/index ';
import { Note as NoteModel } from './models/note';
import * as NotesAPI from './network/notes_api';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const notes = await NotesAPI.fetchNotes();
      setNotes(notes);
    } catch (error) {
      console.error(error);
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

  return (
    <div className="App p-10">
      <div className="py-10">
        <AddNoteModal
          onNoteSaved={(nNote) => {
            setNotes([...notes, nNote]);
          }}
        />
      </div>
      <div className="flex flex-row flex-wrap justify-between items-center space-y-5">
        {notes.map((note) => (
          <Note
            key={note._id}
            note={note}
            onDeleteNoteClicked={deleteNote}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
