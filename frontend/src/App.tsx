import React, { useEffect, useState } from 'react';
import './App.css';
import Note from './components/Note/index ';
import { Note as NoteModel } from './models/note';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await fetch('/api/notes', {
        method: 'GET',
      });
      const notes = await response.json();
      setNotes(notes);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App p-10">
      <div className="flex flex-row flex-wrap justify-around gap-5">
        {notes.map((note) => (
          <Note key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default App;
