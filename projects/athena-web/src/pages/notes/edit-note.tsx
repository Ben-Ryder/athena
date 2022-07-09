import React, {useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NoteDto, NoteContentDto } from "@ben-ryder/athena-js-lib";

import { Page } from "../../patterns/layout/page";
import { NoteForm } from "../../patterns/components/note-form";
import { Button } from "@ben-ryder/jigsaw";
import {useAthena} from "../../helpers/use-athena";


type PageURLParams = {
    noteId: string,
}

export function EditNotePage() {
    let { noteId } = useParams<PageURLParams>() as { noteId: string };
    const [note, setNote] = React.useState<NoteDto>();
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
                onSubmit={async (values: NoteContentDto) => {
                    await apiClient.updateNote(noteId, {
                        ...note,
                        ...values
                    });
                }}
                leftContent={
                    <Button
                        styling="destructive"
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

