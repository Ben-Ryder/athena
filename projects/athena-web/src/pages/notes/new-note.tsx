import React from 'react';
import { useNavigate } from "react-router-dom";

import {AthenaAPIClient, INoteContent} from "@ben-ryder/athena-js-sdk";

import { Page } from "../../patterns/layout/page";
import { NoteForm } from "../../patterns/components/note-form";


export function NewNotePage() {
  const navigate = useNavigate();

  return (
    <Page>
      <NoteForm
        initialValues={{
          title: "",
          body: ""
        }}
        onSubmit={async (values: INoteContent, { setSubmitting }) => {
          const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO")
          await apiClient.addNote(values);
          setSubmitting(false);
          await navigate("/notes")
        }}
      />
    </Page>
  );
}
