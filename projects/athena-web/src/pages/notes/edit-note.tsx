import React, {useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AthenaAPIClient, INote, INoteContent } from "@ben-ryder/athena-js-sdk";

import { Page } from "../../patterns/layout/page";
import { NoteForm } from "../../patterns/components/note-form";
import { Button } from "../../patterns/elements/button/button";


type PageURLParams = {
    noteId: string,
}

async function deleteNote(noteId: string) {
    const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001", process.env.REACT_APP_ENCRYPTION_KEY || "TODO");
    await apiClient.deleteNote(noteId);
}

export function EditNotePage() {
    let { noteId } = useParams<PageURLParams>() as { noteId: string };
    const [note, setNote] = React.useState<INote>();
    const navigate = useNavigate();

    useEffect(() => {
        async function getNote(noteId: string|undefined) {
            if (typeof noteId === 'string') {
                const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001", process.env.REACT_APP_ENCRYPTION_KEY || "TODO");
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

    return (
        <Page>
            <NoteForm
                initialValues={{
                    title: note.title,
                    body: note.body
                }}
                onSubmit={async (values: INoteContent, { setSubmitting }) => {
                    const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO")
                    await apiClient.updateNote(noteId, values);
                    setSubmitting(false);
                }}
                leftContent={
                    <Button
                        variant="danger"
                        onClick={async (e) => {
                            e.preventDefault();
                            await deleteNote(noteId);
                            await navigate("/notes");
                        }}
                    >Delete Note</Button>
                }
            />
        </Page>
    );
}

