import React from 'react';
import { useNavigate } from "react-router-dom";

import { INoteContent } from "@ben-ryder/athena-js-lib";

import { Page } from "../../patterns/layout/page";
import { NoteForm } from "../../patterns/components/note-form";
import { useAthena } from "../../helpers/use-athena";


export function NewNotePage() {
  const navigate = useNavigate();
  let { apiClient } = useAthena();

  return (
    <Page>
      <NoteForm
        initialValues={{
          title: "",
          body: ""
        }}
        onSubmit={async (values: INoteContent, { setSubmitting }) => {
          await apiClient.addNote(values);
          setSubmitting(false);
          await navigate("/notes")
        }}
      />
    </Page>
  );
}
