import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/tailwind.css';

import { HomePage } from './pages/home';
import { NewNotePage } from './pages/notes/new-note';
import { EditNotePage } from './pages/notes/edit-note';
import { NotesPage } from './pages/notes/notes';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notes/new" element={<NewNotePage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/notes/:noteId" element={<EditNotePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
