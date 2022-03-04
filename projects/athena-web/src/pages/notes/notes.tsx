import React, { useEffect } from 'react';
import { AthenaAPIClient, INote } from '@ben-ryder/athena-js-sdk';

import { Page } from '../../patterns/layout/page';
import {ButtonLink} from "../../patterns/elements/button/button-link";


export function NotesPage() {
  let [notes, setNotes] = React.useState<INote[]>();

  useEffect(() => {
    async function getNotes() {
      const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO");
      const allNotes = await apiClient.getNotes();
      setNotes(allNotes.notes);
    }
    getNotes();
  }, [])

  return (
    <Page>
      <div className="max-w-2xl mx-auto mt-2 md:mt-8 px-2">
        <div className="flex justify-between items-end border-b py-2">
          <h1 className="text-2xl font-bold">All Notes</h1>
          <ButtonLink href="/notes/new">New Note</ButtonLink>
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

