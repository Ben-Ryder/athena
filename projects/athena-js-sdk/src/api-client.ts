import axios from 'axios';

import {INote, INoteContent, INoteDecryptionResult} from './types/note';
import { AthenaEncryption } from './encryption';

export interface QueryOptions {
    url: string,
    method: 'GET'|'POST'|'PATCH'|'DELETE',
    data?: object,
    params?: object
}

export class AthenaRequestError extends Error {
    originalError: any;

    constructor(message: string, originalError?: any) {
        super(message);
        this.originalError = originalError;
    }
}


export class AthenaAPIClient {
    apiEndpoint: string;
    encryptionKey: string;

    constructor(apiEndpoint: string, encryptionKey: string) {
        this.apiEndpoint = apiEndpoint;
        this.encryptionKey = encryptionKey;
    }

    private static async query<ResponseType>(options: QueryOptions): Promise<ResponseType> {
        let data: ResponseType;

        try {
            data = <ResponseType> await axios(options).then(response => {return response.data});
        }
        catch (e) {
            throw new AthenaRequestError(
                `There was an error with the request '${options.url} [${options.method}]'`, e
            );
        }

        return data;
    }

    async getEncryptedNotes(): Promise<INote[]> {
        return AthenaAPIClient.query<INote[]>({
            method: 'GET',
            url: `${this.apiEndpoint}/v1/notes`,
        });
    }

    async getNotes(): Promise<INoteDecryptionResult> {
        const encryptedNotes = await this.getEncryptedNotes();
        let notes: INote[] = [];
        let invalidNotes: INote[] = [];
        for (let note of encryptedNotes) {
            try {
                notes.push(
                    AthenaEncryption.decryptNote(this.encryptionKey, note)
                )
            }
            catch (e) {
                invalidNotes.push(note);
            }
        }

        return {
            notes,
            invalidNotes
        };
    }

    async addNote(newNote: INoteContent) {
        const encryptedNote = AthenaEncryption.encryptNoteContent(this.encryptionKey, newNote);
        return AthenaAPIClient.query<INoteContent>({
            method: 'POST',
            url: `${this.apiEndpoint}/v1/notes`,
            data: encryptedNote
        })
    }

    async getEncryptedNote(noteId: string): Promise<INote> {
        return AthenaAPIClient.query<INote>({
            method: 'GET',
            url: `${this.apiEndpoint}/v1/notes/${noteId}`,
        })
    }

    async getNote(noteId: string): Promise<INote> {
        const encryptedNote = await this.getEncryptedNote(noteId);
        return AthenaEncryption.decryptNote(this.encryptionKey, encryptedNote);
    }

    async updateNote(noteId: string, note: INoteContent) {
        const encryptedNoteUpdate = await AthenaEncryption.encryptNoteContent(this.encryptionKey, note);
        return AthenaAPIClient.query<INote>({
            method: 'PATCH',
            url: `${this.apiEndpoint}/v1/notes/${noteId}`,
            data: encryptedNoteUpdate
        })
    }

    async deleteNote(noteId: string) {
        return AthenaAPIClient.query<INote>({
            method: 'DELETE',
            url: `${this.apiEndpoint}/v1/notes/${noteId}`,
        })
    }
}
