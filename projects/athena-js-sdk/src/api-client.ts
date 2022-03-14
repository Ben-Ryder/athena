import axios from 'axios';

import {INote, INoteContent, INoteDecryptionResult} from './types/note';
import { AthenaEncryption } from './encryption';
import {
    AthenaNoAccessTokenError,
    AthenaNoEncryptionKeyError,
    AthenaNoRefreshTokenError,
    AthenaRequestError,
    AthenaTokenLoadError,
    AthenaTokenSaveError,
    AthenaTokenDeleteError
} from "./types/errors";
import {LoginResponse, RefreshResponse} from "./types/auth";

export interface QueryOptions {
    url: string,
    method: 'GET'|'POST'|'PATCH'|'DELETE',
    data?: object,
    params?: object,
    noAuthRequired?: boolean,
    requiresEncryptionKey?: boolean
}

export type TokenLoader = () => Promise<string|null>;
export type TokenSaver = (token: string) => Promise<void>;
export type TokenDeleter = () => Promise<void>;

export interface AthenaAPIClientOptions {
    apiEndpoint: string;
    encryptionKey?: string | null;

    loadAccessToken: TokenLoader;
    saveAccessToken: TokenSaver;
    deleteAccessToken: TokenDeleter;

    loadRefreshToken: TokenLoader;
    saveRefreshToken: TokenSaver;
    deleteRefreshToken: TokenDeleter;
}

export class AthenaAPIClient {
    private readonly options: AthenaAPIClientOptions;
    private accessToken?: string;
    private refreshToken?: string;

    constructor(options: AthenaAPIClientOptions) {
        this.options = options;
    }

    setEncryptionKey(encryptionKey: string | null) {
        this.options.encryptionKey = encryptionKey;
    }

    getEncryptionKey() {
        return this.options.encryptionKey;
    }

    private async query<ResponseType>(options: QueryOptions, repeat = false): Promise<ResponseType> {
        if (!options.noAuthRequired && !this.accessToken) {
            const accessToken = await AthenaAPIClient.loadToken(this.options.loadAccessToken);
            const refreshToken = await AthenaAPIClient.loadToken(this.options.loadRefreshToken);
            if (refreshToken) {
                this.refreshToken = refreshToken;
            }
            else {
                throw new AthenaNoRefreshTokenError();
            }

            if (accessToken) {
                this.accessToken = accessToken;
            }
            else if (!repeat) {
                return this.refreshAuthAndRetry(options);
            }
            else {
                throw new AthenaNoAccessTokenError();
            }
        }


        let response: any = null;
        try {
            response = await axios({
                ...options,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
        }
        catch (e) {
            if (response?.status === 401 && !repeat) {
                return this.refreshAuthAndRetry<ResponseType>(options);
            }

            throw new AthenaRequestError(
                {
                    message: `There was an error with the request '${options.url} [${options.method}]'`,
                    originalError: e
                }
            );
        }

        return response.data;
    }

    private async refreshAuthAndRetry<ResponseType>(options: QueryOptions): Promise<ResponseType> {
        await this.refresh();
        return this.query(options, true);
    }

    private checkEncryptionKey() {
        if (!this.options.encryptionKey) {
            throw new AthenaNoEncryptionKeyError();
        }
    }

    // Auth
    private static async loadToken(loader: TokenLoader) {
        try {
            return await loader();
        }
        catch (e) {
            throw new AthenaTokenLoadError({originalError: e});
        }
    }

    private static async saveToken(saver: TokenSaver, token: string) {
        try {
            return await saver(token);
        }
        catch (e) {
            throw new AthenaTokenSaveError({originalError: e});
        }
    }

    private static async deleteToken(deleter: TokenDeleter) {
        try {
            return await deleter();
        }
        catch (e) {
            throw new AthenaTokenDeleteError({originalError: e});
        }
    }

    public async login(username: string, password: string) {
        const tokens = await this.query<LoginResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/user`,
            data: {
                username,
                password
            },
            noAuthRequired: true
        });

        await AthenaAPIClient.saveToken(this.options.saveRefreshToken, tokens.refreshToken);
        this.refreshToken = tokens.refreshToken;
        await AthenaAPIClient.saveToken(this.options.saveAccessToken, tokens.accessToken);
        this.accessToken = tokens.accessToken;
    }

    public async logout() {
        // todo: loading from external if not found?
        let tokens: any = {};
        if (this.accessToken) {
            tokens.accessToken = this.accessToken;
        }
        if (this.refreshToken) {
            tokens.refreshToken = this.refreshToken;
        }

        await this.query({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/auth/revoke`,
            noAuthRequired: true,
            data: tokens
        });

        await AthenaAPIClient.deleteToken(this.options.deleteRefreshToken);
        delete this.refreshToken;
        await AthenaAPIClient.deleteToken(this.options.deleteAccessToken);
        delete this.accessToken;
    }

    private async refresh() {
        if (!this.refreshToken) {
            throw new AthenaNoRefreshTokenError();
        }

        const tokens = await this.query<RefreshResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/auth/refresh`,
            noAuthRequired: true
        });

        await AthenaAPIClient.saveToken(this.options.saveRefreshToken, tokens.refreshToken);
        this.refreshToken = tokens.refreshToken;
        await AthenaAPIClient.saveToken(this.options.saveAccessToken, tokens.accessToken);
        this.accessToken = tokens.accessToken;
    }

    // Notes
    private async getEncryptedNotes(): Promise<INote[]> {
        return this.query<INote[]>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/notes`
        });
    }

    async getNotes(): Promise<INoteDecryptionResult> {
        const encryptedNotes = await this.getEncryptedNotes();
        let notes: INote[] = [];
        let invalidNotes: INote[] = [];
        for (let note of encryptedNotes) {
            try {
                notes.push(
                    AthenaEncryption.decryptNote(<string> this.options.encryptionKey, note)
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

        const encryptedNote = AthenaEncryption.encryptNoteContent(<string> this.options.encryptionKey, newNote);
        return this.query<INoteContent>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/notes`,
            data: encryptedNote
        })
    }

    private async getEncryptedNote(noteId: string): Promise<INote> {
        return this.query<INote>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/notes/${noteId}`
        })
    }

    async getNote(noteId: string): Promise<INote> {
        const encryptedNote = await this.getEncryptedNote(noteId);
        return AthenaEncryption.decryptNote(<string> this.options.encryptionKey, encryptedNote);
    }

    async updateNote(noteId: string, note: INoteContent) {
        const encryptedNoteUpdate = await AthenaEncryption.encryptNoteContent(<string> this.options.encryptionKey, note);
        return this.query<INote>({
            method: 'PATCH',
            url: `${this.options.apiEndpoint}/v1/notes/${noteId}`,
            data: encryptedNoteUpdate
        })
    }

    async deleteNote(noteId: string) {
        return this.query<INote>({
            method: 'DELETE',
            url: `${this.options.apiEndpoint}/v1/notes/${noteId}`
        })
    }
}
