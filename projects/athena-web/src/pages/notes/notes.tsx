import React, { useEffect } from 'react';
import { AthenaAPIClient, INote } from '@ben-ryder/athena-js-sdk';

import { Page } from '../../patterns/layout/page';


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
      <div>
        <h1>Notes</h1>
        <div>
          {notes &&
              <ul>
                {notes.map(note =>
                  <li key={ note.id }><a href={`/notes/${note.id}`}>{ note.title }</a></li>
                )}
              </ul>
          }
        </div>
      </div>
    </Page>
  );
}

