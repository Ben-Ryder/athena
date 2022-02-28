import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/tailwind.css';

import { HomePage } from './pages/home';
import { AddNotePage } from './pages/add-note';
import { NotesPage } from './pages/notes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-notes" element={<AddNotePage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
