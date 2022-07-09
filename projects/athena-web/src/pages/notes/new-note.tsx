import React from 'react';
import { useNavigate } from "react-router-dom";

import { NoteContentDto } from "@ben-ryder/athena-js-lib";

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
        onSubmit={async (values: NoteContentDto) => {
          try {
            await apiClient.createNote({
              ...values,
              tags: []
            });
          }
          catch (e: any) {
            console.log(e);
          }
          await navigate("/notes")
        }}
      />
    </Page>
  );
}
