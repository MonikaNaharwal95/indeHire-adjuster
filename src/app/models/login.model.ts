export interface LoginResponse {
    accessToken: AccessToken;
    refreshToken: string;
}

export interface AccessToken {
    token: string;
    expiresIn: number;
    prelimStatusID: number;
    profileImageID: string;
    id: number;
    firstName: string;
    lastName: string;
    contractorType: string;
}
