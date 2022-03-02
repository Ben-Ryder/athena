import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/tailwind.css';

import { HomePage } from './pages/home';
import { AddNotePage } from './pages/notes/add-note';
import { NotesPage } from './pages/notes/notes';
import { NotePage } from './pages/notes/note';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes/new" element={<AddNotePage />} />
        <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:noteId" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
