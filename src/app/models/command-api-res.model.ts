export interface CommandResponse {
    responseMessage: string;
}

export interface IdentityResponse {
    message: string;
    messageCode?: string;
    isError: boolean;
    result: any;
}

export interface IdentityResult {
    status: boolean;
}
