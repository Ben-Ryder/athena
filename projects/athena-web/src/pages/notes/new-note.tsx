import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";

import { INoteContent } from "@ben-ryder/athena-js-sdk";

import { Page } from "../../patterns/layout/page";
import { NoteForm } from "../../patterns/components/note-form";
import { useAthena } from "../../context/use-athena";


export function NewNotePage() {
  const navigate = useNavigate();
  let { apiClient, setEncryptionKey } = useAthena();

  useEffect(() => {
      setEncryptionKey(process.env.REACT_APP_ENCRYPTION_KEY as string);
  }, [setEncryptionKey])

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
