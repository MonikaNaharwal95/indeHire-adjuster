export interface PaymentAndTaxModel {
    isUSCitizen: boolean;
    isUSResident: boolean;
    serviceTypeID: string;
    ssn?: string;
    ein: string;
    legalName: string;
    accountTypeID: string;
    routingNumber: string;
    confirmRoutingNumber?: string;
    accountNumber: string;
    confirmAccountNumber?: string;
    terms?: boolean;
    isNewUser: boolean;
}
