import aes from "crypto-js/aes";
import utf8 from "crypto-js/enc-utf8";

import { INote, INoteContent } from './types/note';
import { AthenaDecryptError, AthenaEncryptError } from "./types/errors";


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

    static encryptNote(key: string, note: INote): INote {
        return {
            id: note.id,
            title: AthenaEncryption.encryptText(key, note.title),
            body: typeof note.body === 'string' ? AthenaEncryption.encryptText(key, note.body) : null
        }
    }

    static decryptNote(key: string, note: INote): INote {
        const decryptedNote = {
            id: note.id,
            title: AthenaEncryption.decryptText(key, note.title),
            body: typeof note.body === 'string' ? AthenaEncryption.decryptText(key, note.body) : null
        };

        // If the title or body are empty then the encryption key must be wrong.
        if (decryptedNote.title === '' || (typeof decryptedNote.body === "string" && decryptedNote.body === "")) {
            throw new AthenaDecryptError();
        }

        return decryptedNote;
    }

    static encryptNoteContent(key: string, note: INoteContent): INoteContent {
        return {
            title: AthenaEncryption.encryptText(key, note.title),
            body: typeof note.body === 'string' ? AthenaEncryption.encryptText(key, note.body) : null
        }
    }

    static decryptNoteContent(key: string, note: INoteContent): INoteContent {
        const decryptedNoteContent = {
            title: AthenaEncryption.decryptText(key, note.title),
            body: typeof note.body === 'string' ? AthenaEncryption.decryptText(key, note.body) : null
        }

        // If the title or body are empty then the encryption key must be wrong.
        if (decryptedNoteContent.title === '' || (typeof decryptedNoteContent.body === "string" && decryptedNoteContent.body === "")) {
            throw new AthenaDecryptError();
        }

        return decryptedNoteContent;
    }
}
