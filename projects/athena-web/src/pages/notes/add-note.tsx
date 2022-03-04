import React from 'react';

import {
  Formik,
  Form,
  Field,
} from 'formik';

import { AthenaAPIClient } from "@ben-ryder/athena-js-sdk";
import {useNavigate} from "react-router-dom";
import {Page} from "../../patterns/layout/page";
import {Button} from "../../patterns/elements/button/button";

interface AddNoteFormValues {
  title: string,
  body: string,
}


export function AddNotePage() {
  const initialValues: AddNoteFormValues = {title: "", body: ""};
  const navigate = useNavigate();

  return (
    <Page>
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
            <Form className="absolute h-full w-full flex flex-col">
                <div className="border-b">
                    <label htmlFor="note-title" className="sr-only">Title</label>
                    <Field
                        id="note-title" name="title" type="text" placeholder="enter title..."
                        className="block w-full px-4 min-h-[40px] text-center"
                        value={values.title} onChange={handleChange}
                    />
                </div>

                <div className="h-full">
                    <label htmlFor="note-body" className="sr-only">Body</label>
                    <Field
                        as="textarea" id="note-body" name="body" type="text" placeholder="an awesome note..."
                        className="block w-full p-4 resize-none min-h-full"
                        value={values.body} onChange={handleChange}
                    />
                </div>

                <div className="absolute right-0 bottom-0 p-4">
                    <Button type="submit">Save</Button>
                </div>
            </Form>
          )}
        </Formik>
    </Page>
  );
}

