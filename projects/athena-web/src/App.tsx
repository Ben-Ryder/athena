import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/tailwind.css';

import { HomePage } from './pages/home';
import { NewNotePage } from './pages/notes/new-note';
import { EditNotePage } from './pages/notes/edit-note';
import { NotesPage } from './pages/notes/notes';
import { EnterEncryptionKeyPage } from "./pages/user/enter-encryption-key";
import {AthenaRestrictedRoute} from "./helpers/athena-restricted-route";
import {PageNotFound} from "./pages/page-not-found";
import {LogoutPage} from "./pages/user/logout";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/user/enter-encryption-key" element={<EnterEncryptionKeyPage />} />
                <Route path="/user/logout" element={<LogoutPage />}/>
                <Route element={<AthenaRestrictedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/notes/new" element={<NewNotePage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/notes/:noteId" element={<EditNotePage />} />
                </Route>
                <Route path="*" element={<PageNotFound />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
