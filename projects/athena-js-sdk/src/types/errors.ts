export interface AthenaErrorOptions {
    message?: string;
    originalError?: any;
}

export class AthenaError extends Error {
    originalError: any;

    constructor(options?: AthenaErrorOptions) {
        if (options?.message) {
            super(options.message);
        }
        else {
            super();
        }

        this.originalError = options?.originalError || null;
    }
}

// Encryption Errors
export class AthenaEncryptionError extends AthenaError {}
export class AthenaEncryptError extends AthenaEncryptionError {}
export class AthenaDecryptError extends AthenaEncryptionError {}

// API Client Errors
export class AthenaAPIClientError extends AthenaError {}
export class AthenaNoEncryptionKeyError extends AthenaAPIClientError {}
export class AthenaRequestError extends AthenaAPIClientError {}

export class AthenaNoRefreshTokenError extends AthenaAPIClientError {}
export class AthenaNoAccessTokenError extends AthenaAPIClientError {}

export class AthenaTokenLoadError extends AthenaAPIClientError {}
export class AthenaTokenSaveError extends AthenaAPIClientError {}
export class AthenaTokenDeleteError extends AthenaAPIClientError {}
