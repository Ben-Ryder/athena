import React from 'react';

import {
  Formik,
  Form,
  Field,
} from 'formik';

import { AthenaAPIClient } from "@ben-ryder/athena-js-sdk";
import {useNavigate} from "react-router-dom";

interface AddNoteFormValues {
  title: string,
  body: string,
}


export function AddNotePage() {
  const initialValues: AddNoteFormValues = {title: "", body: ""};
  const navigate = useNavigate();

  return (
    <div>
      <h1>Add Note</h1>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values: AddNoteFormValues, { setSubmitting }) => {
              const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO")
              await apiClient.addNote(values);
              setSubmitting(false);
              await navigate("/notes")
          }}
        >
          {({values, handleChange}) => (
            <Form>
              <div>
                <label htmlFor="note-title">Title</label>
                <Field id="note-title" name="title" type="text" value={values.title} onChange={handleChange} />
              </div>

              <div>
                <label htmlFor="note-body">Body</label>
                <Field as="textarea" id="note-body" name="body" type="text" value={values.body} onChange={handleChange} />
              </div>

              <div>
                <button type="submit">Add Note</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

