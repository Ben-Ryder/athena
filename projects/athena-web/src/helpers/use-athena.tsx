import { createContext, useContext } from "react";
import { AthenaAPIClient } from "@ben-ryder/athena-js-sdk";

export interface IAthenaContext {
    apiClient: AthenaAPIClient,
    setEncryptionKey: (encryptionKey: string) => Promise<void>
    checkEncryptionKey: () => boolean
    deleteEncryptionKey: () => void
}

const apiClient = new AthenaAPIClient({
    apiEndpoint: process.env.REACT_APP_API_ENDPOINT as string
})

const ENCRYPTION_KEY_STORAGE_KEY='encryptionKey';

export const AthenaContext = createContext<IAthenaContext>({
    apiClient: apiClient,
    setEncryptionKey: async (encryptionKey) => {
        apiClient.setEncryptionKey(encryptionKey);
        localStorage.setItem(ENCRYPTION_KEY_STORAGE_KEY, encryptionKey);
    },
    checkEncryptionKey: () => {
        if (typeof apiClient.getEncryptionKey() === 'string') {
            return true;
        }

        const savedEncryptionKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);
        if (savedEncryptionKey) {
            apiClient.setEncryptionKey(savedEncryptionKey);
            return true;
        }

        return false;
    },
    deleteEncryptionKey: () => {
        apiClient.setEncryptionKey(null);
        localStorage.removeItem(ENCRYPTION_KEY_STORAGE_KEY);
    }
})

export const useAthena = () => useContext(AthenaContext);
