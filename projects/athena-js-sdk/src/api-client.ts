import axios from 'axios';

import {INote, INoteContent, INoteDecryptionResult} from './types/note';
import { AthenaEncryption } from './encryption';


export class AthenaAPIClient {
    apiEndpoint: string;
    encryptionKey: string;

    constructor(apiEndpoint: string, encryptionKey: string) {
        this.apiEndpoint = apiEndpoint;
        this.encryptionKey = encryptionKey;
    }

    async getEncryptedNotes(): Promise<INote[]> {
        return axios.get(`${this.apiEndpoint}/v1/notes`).then(res => {return res.data});
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
        return axios.post(`${this.apiEndpoint}/v1/notes`, encryptedNote).then(res => {return res.data});
    }

    async getEncryptedNote(noteId: string): Promise<INote> {
        return axios.get(`${this.apiEndpoint}/v1/notes/${noteId}`).then(res => {return res.data});
    }

    async getNote(noteId: string): Promise<INote> {
        const encryptedNote = await this.getEncryptedNote(noteId);
        return AthenaEncryption.decryptNote(this.encryptionKey, encryptedNote);
    }

    async updateNote(noteId: string, note: INoteContent) {
        const encryptedNoteUpdate = await AthenaEncryption.encryptNoteContent(this.encryptionKey, note);
        return axios.patch(`${this.apiEndpoint}/v1/notes/${noteId}`, encryptedNoteUpdate).then(res => {return res.data});
    }

    async deleteNote(noteId: string) {
        return axios.delete(`${this.apiEndpoint}/v1/notes/${noteId}`).then(res => {return res.data});
    }
}
