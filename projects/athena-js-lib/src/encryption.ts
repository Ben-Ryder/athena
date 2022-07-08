import aes from "crypto-js/aes";
import utf8 from "crypto-js/enc-utf8";

import { AthenaDecryptError, AthenaEncryptError } from "./errors";
import { NoteDto } from "./spec/notes/dtos/note.dto-interface";
import { NoteContentDto } from "./spec/notes/dtos/note-content.dto-interface";


export class AthenaEncryption {
    static encryptText(key: string, text: string): string {
        try {
            return aes.encrypt(text, key).toString();
        }
        catch (e) {
            throw new AthenaEncryptError();
        }
    }

    static decryptText(key: string, cipherText: string): string {
        try {
            return aes.decrypt(cipherText, key).toString(utf8);
        }
        catch (e) {
            throw new AthenaDecryptError();
        }
    }

    static encryptData<Type>(key: string, data: Type): string {
        try {
            return aes.encrypt(JSON.stringify(data), key).toString();
        }
        catch (e) {
            throw new AthenaEncryptError();
        }
    }

    static decryptData<Type>(key: string, cipherText: string): Type {
        try {
            return JSON.parse(
                aes.decrypt(cipherText, key).toString(utf8)
            );
        }
        catch (e) {
            throw new AthenaDecryptError();
        }
    }

    static encryptNote(key: string, note: NoteDto): NoteDto {
        return {
            ...note,
            title: AthenaEncryption.encryptText(key, note.title),
            body: AthenaEncryption.encryptText(key, note.body)
        }
    }

    static decryptNote(key: string, note: NoteDto): NoteDto {
        const decryptedNoteContent = {
            title: AthenaEncryption.decryptText(key, note.title),
            body: AthenaEncryption.decryptText(key, note.body)
        };

        // If the title or body are empty then the encryption key must be wrong.
        if (decryptedNoteContent.title === '' || decryptedNoteContent.body === "") {
            throw new AthenaDecryptError();
        }

        return {
            ...note,
            ...decryptedNoteContent
        };
    }

    static encryptNoteContent(key: string, note: NoteContentDto): NoteContentDto {
        return {
            title: AthenaEncryption.encryptText(key, note.title),
            body: AthenaEncryption.encryptText(key, note.body)
        }
    }

    static decryptNoteContent(key: string, note: NoteContentDto): NoteContentDto {
        const decryptedNoteContent = {
            title: AthenaEncryption.decryptText(key, note.title),
            body: AthenaEncryption.decryptText(key, note.body)
        }

        // If the title or body are empty then the encryption key must be wrong.
        if (decryptedNoteContent.title === '' && decryptedNoteContent.body === "") {
            throw new AthenaDecryptError();
        }

        return decryptedNoteContent;
    }
}
