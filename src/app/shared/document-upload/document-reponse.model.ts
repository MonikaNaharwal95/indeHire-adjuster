export interface DocumentResponse {
    documentID: string;
    documentTypeID: number;
    documentFileName: string;
    miMTypeID: number;
    documentDescription: string;
    // documentPath: string;
    contractorID: number;
    moduleType: number;
    isProfileImage: boolean;
    isItForFountain?: boolean;
}
