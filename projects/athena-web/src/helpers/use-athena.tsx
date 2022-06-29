import { createContext, useContext } from "react";
import { AthenaAPIClient, IUser } from "@ben-ryder/athena-js-lib";

export interface IAthenaContext {
    apiClient: AthenaAPIClient,
    loadCurrentUser: () => Promise<IUser | null>,
    setEncryptionKey: (encryptionKey: string) => Promise<void>,
    loadEncryptionKey: () => Promise<string | null>,
}

class AthenaWrapper {
    static ENCRYPTION_KEY_STORAGE_KEY = 'encryptionKey';
    static ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
    static REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
    static CURRENT_USER_STORAGE_KEY = 'currentUser';

    static apiClient = new AthenaAPIClient({
        apiEndpoint: process.env.REACT_APP_API_ENDPOINT as string,
        loadEncryptionKey: AthenaWrapper.loadEncryptionKey,
        deleteEncryptionKey: AthenaWrapper.deleteEncryptionKey,
        saveAccessToken: AthenaWrapper.saveAccessToken,
        loadAccessToken: AthenaWrapper.loadAccessToken,
        deleteAccessToken: AthenaWrapper.deleteAccessToken,
        saveRefreshToken: AthenaWrapper.saveRefreshToken,
        loadRefreshToken: AthenaWrapper.loadRefreshToken,
        deleteRefreshToken: AthenaWrapper.deleteRefreshToken,
        saveCurrentUser: AthenaWrapper.saveCurrentUser,
        loadCurrentUser: AthenaWrapper.loadCurrentUser,
        deleteCurrentUser: AthenaWrapper.deleteCurrentUser
    });

    static async loadEncryptionKey(): Promise<string|null> {
        return localStorage.getItem(AthenaWrapper.ENCRYPTION_KEY_STORAGE_KEY);
    }
    static async setEncryptionKey(encryptionKey: string) {
        // todo: look at how encryption key is handled & saved
        AthenaWrapper.apiClient.setEncryptionKey(encryptionKey);
        localStorage.setItem(AthenaWrapper.ENCRYPTION_KEY_STORAGE_KEY, encryptionKey);
    }
    static async deleteEncryptionKey() {
        return localStorage.removeItem(AthenaWrapper.ENCRYPTION_KEY_STORAGE_KEY);
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

    static async loadCurrentUser(): Promise<IUser|null> {
        const raw = localStorage.getItem(AthenaWrapper.CURRENT_USER_STORAGE_KEY);
        if (raw) {
            try {
                const loaded = JSON.parse(raw);
                return loaded as IUser;
            }
            catch (e) {
                return null;
            }
        }
        return null;
    }
    static async saveCurrentUser(currentUser: IUser) {
        localStorage.setItem(AthenaWrapper.CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    }
    static async deleteCurrentUser() {
        return localStorage.removeItem(AthenaWrapper.CURRENT_USER_STORAGE_KEY);
    }
}


export const AthenaContext = createContext<IAthenaContext>({
    apiClient: AthenaWrapper.apiClient,
    loadCurrentUser: AthenaWrapper.loadCurrentUser,
    setEncryptionKey: AthenaWrapper.setEncryptionKey,
    loadEncryptionKey: AthenaWrapper.loadEncryptionKey
})

export const useAthena = () => useContext(AthenaContext);
