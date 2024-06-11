export interface StorageKeysModel {
    accessToken: string;
    idToken: string;
    expiresAt: string;
    scopes: string;
}

export interface IntStorageKeysModel {
    apiToken: string;
    apiExpiresAt: string;
    refreshToken: string;
    contractorType: string;
}
