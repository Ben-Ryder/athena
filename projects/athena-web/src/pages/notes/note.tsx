import React, {useEffect} from 'react';
import { Formik, Form, Field } from 'formik';

import {AthenaAPIClient, INote} from "@ben-ryder/athena-js-sdk";
import {useNavigate, useParams} from 'react-router-dom';

interface EditNoteFormValues {
  title: string,
  body: string,
}

type PageURLParams = {
    noteId: string,
}

async function deleteNote(noteId: string) {
    const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO");
    await apiClient.deleteNote(noteId);
}

export function NotePage() {
    let { noteId } = useParams<PageURLParams>() as { noteId: string };
    const [note, setNote] = React.useState<INote>();
    const navigate = useNavigate();

    useEffect(() => {
        async function getNote(noteId: string|undefined) {
            if (typeof noteId === 'string') {
                const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO");
                const note = await apiClient.getNote(noteId);
                setNote(note);
            }
        }
        getNote(noteId);
    }, [noteId])

    if (!note) {
        return (
            <p>Loading note...</p>
        )
    }

    const initialValues: EditNoteFormValues = {
        title: note.title,
        body: note.body || ""
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values: EditNoteFormValues, { setSubmitting }) => {
                    const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO")
                    await apiClient.updateNote(noteId, values);
                    setSubmitting(false);
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
                            <button onClick={async (e) => {
                                e.preventDefault();
                                await deleteNote(noteId);
                                await navigate("/notes");
                            }}>Delete Note</button>
                            <button type="submit">Save Note</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

