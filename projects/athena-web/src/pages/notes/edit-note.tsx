import React, {useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { INote, INoteContent } from "@ben-ryder/athena-js-sdk";

import { Page } from "../../patterns/layout/page";
import { NoteForm } from "../../patterns/components/note-form";
import { Button } from "../../patterns/elements/button/button";
import {useAthena} from "../../helpers/use-athena";


type PageURLParams = {
    noteId: string,
}

export function EditNotePage() {
    let { noteId } = useParams<PageURLParams>() as { noteId: string };
    const [note, setNote] = React.useState<INote>();
    const navigate = useNavigate();
    let { apiClient } = useAthena();

    async function deleteNote(noteId: string) {
        await apiClient.deleteNote(noteId);
    }

    useEffect(() => {
        async function getNote(noteId: string|undefined) {
            if (typeof noteId === 'string') {
                const note = await apiClient.getNote(noteId);
                setNote(note);
            }
        }
        getNote(noteId);
    }, [noteId, apiClient])

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

