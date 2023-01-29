import React, { useEffect, useState } from 'react';
import './App.css';
import { Note } from './models/note';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await fetch('/api/notes', {
        method: 'GET',
      });
      const notes = await response.json();
      console.log(notes);
      setNotes(notes);
    } catch (error) {
      console.error(error);
    }
  }

  return <div className="App">{JSON.stringify(notes)}</div>;
}

export default App;
