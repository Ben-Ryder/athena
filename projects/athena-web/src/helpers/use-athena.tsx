import { createContext, useContext } from "react";
import { AthenaAPIClient } from "@ben-ryder/athena-js-lib";

export interface IAthenaContext {
    apiClient: AthenaAPIClient,
    setEncryptionPhrase: (encryptionPhrase: string) => Promise<void>
    checkEncryptionPhrase: () => Promise<boolean>
    deleteEncryptionPhrase: () => Promise<void>
}

class AthenaWrapper {
    static ENCRYPTION_PHRASE_STORAGE_KEY = 'encryptionKey';
    static ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
    static REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

    static apiClient = new AthenaAPIClient({
        apiEndpoint: process.env.REACT_APP_API_ENDPOINT as string,
        saveAccessToken: AthenaWrapper.saveAccessToken,
        loadAccessToken: AthenaWrapper.loadAccessToken,
        deleteAccessToken: AthenaWrapper.deleteAccessToken,
        saveRefreshToken: AthenaWrapper.saveAccessToken,
        loadRefreshToken: AthenaWrapper.loadAccessToken,
        deleteRefreshToken: AthenaWrapper.deleteAccessToken
    });

    static async setEncryptionPhrase(encryptionPhrase: string) {
        await AthenaWrapper.apiClient.setEncryptionPhrase(encryptionPhrase);
        localStorage.setItem(AthenaWrapper.ENCRYPTION_PHRASE_STORAGE_KEY, encryptionPhrase);
    }

    static async checkEncryptionPhrase() {
        if (typeof AthenaWrapper.apiClient.getEncryptionPhrase() === 'string') {
            return true;
        }

        const savedEncryptionKey = localStorage.getItem(AthenaWrapper.ENCRYPTION_PHRASE_STORAGE_KEY);
        if (savedEncryptionKey) {
            await AthenaWrapper.apiClient.setEncryptionPhrase(savedEncryptionKey);
            return true;
        }

        return false;
    }

    static async deleteEncryptionPhrase() {
        await AthenaWrapper.apiClient.setEncryptionPhrase(null);
        localStorage.removeItem(AthenaWrapper.ENCRYPTION_PHRASE_STORAGE_KEY);
    }

    static async loadAccessToken(): Promise<string|null> {
        return localStorage.getItem(AthenaWrapper.ACCESS_TOKEN_STORAGE_KEY);
    }
    static async saveAccessToken(accessToken: string) {
        localStorage.setItem(AthenaWrapper.ACCESS_TOKEN_STORAGE_KEY, accessToken);
    }
    static async deleteAccessToken() {
        return localStorage.removeItem(AthenaWrapper.ACCESS_TOKEN_STORAGE_KEY);
    }
    static async loadRefreshToken(): Promise<string|null> {
        return localStorage.getItem(AthenaWrapper.REFRESH_TOKEN_STORAGE_KEY);
    }
    static async saveRefreshToken(refreshToken: string) {
        localStorage.setItem(AthenaWrapper.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
    static async deleteRefreshToken() {
        return localStorage.removeItem(AthenaWrapper.REFRESH_TOKEN_STORAGE_KEY);
    }
}


export const AthenaContext = createContext<IAthenaContext>({
    apiClient: AthenaWrapper.apiClient,
    setEncryptionPhrase: AthenaWrapper.setEncryptionPhrase,
    checkEncryptionPhrase: AthenaWrapper.checkEncryptionPhrase,
    deleteEncryptionPhrase: AthenaWrapper.deleteEncryptionPhrase
})

export const useAthena = () => useContext(AthenaContext);
