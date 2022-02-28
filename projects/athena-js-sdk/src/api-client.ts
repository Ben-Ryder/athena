import axios from 'axios';

import { INewNote, INote } from './types/note';
import { AthenaEncryption } from './encryption';


export class AthenaAPIClient {
    apiEndpoint: string;
    encryptionKey: string;

    constructor(apiEndpoint: string, encryptionKey: string) {
        this.apiEndpoint = apiEndpoint;
        this.encryptionKey = encryptionKey;
    }

    async getEncryptedNotes(): Promise<INote[]> {
        return axios.get(`${this.apiEndpoint}/v1/notes`);
    }

    async getNotes(): Promise<INote[]> {
        const encryptedNotes = await this.getEncryptedNotes();

        let notes: INote[] = [];
        for (let note of encryptedNotes) {
            notes.push(
              AthenaEncryption.decryptNote(this.encryptionKey, note)
            )
        }

        return notes;
    }

    async addNote(newNote: INewNote) {
        const encryptedNote = AthenaEncryption.encryptNewNote(this.encryptionKey, newNote);
        return axios.post(`${this.apiEndpoint}/v1/notes`, encryptedNote);
    }
}
