import { createContext, useContext } from "react";
import { AthenaAPIClient } from "@ben-ryder/athena-js-sdk";

export interface IAthenaContext {
    apiClient: AthenaAPIClient,
    setEncryptionKey: (encryptionKey: string) => Promise<void>
}

const apiClient = new AthenaAPIClient({
    apiEndpoint: process.env.REACT_APP_API_ENDPOINT as string,
    encryptionKey: localStorage.getItem('encryptionKey')
})

export const AthenaContext = createContext<IAthenaContext>({
    apiClient: apiClient,
    setEncryptionKey: async (encryptionKey) => {
        apiClient.setEncryptionKey(encryptionKey);
        localStorage.setItem('encryptionKey', encryptionKey);
    }
})

export const useAthena = () => useContext(AthenaContext);
