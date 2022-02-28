import React, { useEffect } from 'react';
import { AthenaAPIClient, INote } from '@ben-ryder/athena-js-sdk';

export function NotesPage() {
  let [notes, setNotes] = React.useState<INote[]>();

  useEffect(() => {
    async function getNotes() {
      const apiClient = new AthenaAPIClient(process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/api", process.env.REACT_APP_ENCRYPTION_KEY || "TODO");
      const decryptedNotes = await apiClient.getNotes();
      setNotes(decryptedNotes);
    }
    getNotes();
  })

  return (
    <div>
      <h1>Notes</h1>
      <div>
        {notes &&
          <ul>
            {notes.map(note =>
              <li key={ note.id }><a href={`/note/${note.id}`}>{ note.title }</a></li>
            )}
          </ul>
        }
      </div>
    </div>
  );
}

