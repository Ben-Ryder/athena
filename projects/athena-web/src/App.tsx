import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/tailwind.css';

import { HomePage } from './pages/home';
import { NewNotePage } from './pages/notes/new-note';
import { EditNotePage } from './pages/notes/edit-note';
import { NotesPage } from './pages/notes/notes';
import {AthenaRestrictedRoute} from "./helpers/athena-restricted-route";
import {PageNotFound} from "./pages/page-not-found";
import {LogoutPage} from "./pages/user/logout";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {LoginPage} from "./pages/user/login";
import {MainPage} from "./pages/main/main";


function App() {
  return (
    <HelmetProvider>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Athena</title>
    </Helmet>
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/main" element={<MainPage />}/>

        {/* User Routes */}
        <Route path="/user/logout" element={<LogoutPage />}/>
        <Route path="/user/login" element={<LoginPage />}/>

        {/* Restricted Routes (requiring encryption and user login) */}
        <Route element={<AthenaRestrictedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes/new" element={<NewNotePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:noteId" element={<EditNotePage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
