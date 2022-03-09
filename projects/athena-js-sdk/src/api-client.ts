import axios from 'axios';

import {INote, INoteContent, INoteDecryptionResult} from './types/note';
import { AthenaEncryption } from './encryption';
import {AthenaNoEncryptionKeyError, AthenaRequestError} from "./types/errors";

export interface QueryOptions {
    url: string,
    method: 'GET'|'POST'|'PATCH'|'DELETE',
    data?: object,
    params?: object
}

export interface AthenaAPIClientOptions {
    apiEndpoint: string;
    encryptionKey?: string | null;
}

export class AthenaAPIClient {
    private readonly apiEndpoint: string;
    private encryptionKey?: string | null;

    constructor(options: AthenaAPIClientOptions) {
        this.apiEndpoint = options.apiEndpoint;
        this.encryptionKey = options.encryptionKey || null;
    }

    setEncryptionKey(encryptionKey: string | null) {
        this.encryptionKey = encryptionKey;
    }

    getEncryptionKey() {
        return this.encryptionKey;
    }

    private static async query<ResponseType>(options: QueryOptions): Promise<ResponseType> {
        let data: ResponseType;

        try {
            data = <ResponseType> await axios(options).then(response => {return response.data});
        }
        catch (e) {
            throw new AthenaRequestError(
                {
                    message: `There was an error with the request '${options.url} [${options.method}]'`,
                    originalError: e
                }
            );
        }

        return data;
    }

    private checkEncryptionKey() {
        if (!this.encryptionKey) {
            throw new AthenaNoEncryptionKeyError();
        }
    }

    async getEncryptedNotes(): Promise<INote[]> {
        return AthenaAPIClient.query<INote[]>({
            method: 'GET',
            url: `${this.apiEndpoint}/v1/notes`,
        });
    }

    async getNotes(): Promise<INoteDecryptionResult> {
        this.checkEncryptionKey();
        const encryptedNotes = await this.getEncryptedNotes();
        let notes: INote[] = [];
        let invalidNotes: INote[] = [];
        for (let note of encryptedNotes) {
            try {
                notes.push(
                    AthenaEncryption.decryptNote(<string> this.encryptionKey, note)
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
        this.checkEncryptionKey();

        const encryptedNote = AthenaEncryption.encryptNoteContent(<string> this.encryptionKey, newNote);
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
        this.checkEncryptionKey();

        const encryptedNote = await this.getEncryptedNote(noteId);
        return AthenaEncryption.decryptNote(<string> this.encryptionKey, encryptedNote);
    }

    async updateNote(noteId: string, note: INoteContent) {
        this.checkEncryptionKey();

        const encryptedNoteUpdate = await AthenaEncryption.encryptNoteContent(<string> this.encryptionKey, note);
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
