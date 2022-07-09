import React, { useEffect } from 'react';
import { NoteDto } from '@ben-ryder/athena-js-lib';

import { Page } from '../../patterns/layout/page';
import {LinkButton} from "@ben-ryder/jigsaw";
import {useAthena} from "../../helpers/use-athena";


export function NotesPage() {
  let [notes, setNotes] = React.useState<NoteDto[]>();
  let { apiClient } = useAthena();

  useEffect(() => {
    async function getNotes() {
      const notesResponse = await apiClient.getNotes();
      setNotes(notesResponse.notes);
    }
    getNotes();
  }, [apiClient])

  return (
    <Page>
      <div className="max-w-2xl mx-auto mt-2 md:mt-8 px-2">
        <div className="flex justify-between items-end border-b py-2">
          <h1 className="text-2xl font-bold">All Notes</h1>
          <LinkButton href="/notes/new">New Note</LinkButton>
        </div>
        <div>
          {notes &&
              <ul className="mt-2">
                {notes.map(note =>
                  <li key={ note.id } className="border-b">
                    <a
                        href={`/notes/${note.id}`}
                        className="inline-block w-full py-3 px-2 hover:pointer hover:bg-gray-100"
                    >{ note.title }</a>
                  </li>
                )}
              </ul>
          }
        </div>
      </div>
    </Page>
  );
}

