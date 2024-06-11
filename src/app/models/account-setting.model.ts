export interface AccountSetting {
    firstName: string;
    lastName: string;
    addressID: number;
    address1: string;
    address2: string;
    city: string;
    provinceID: string;
    provinceName?: string;
    countryID: string;
    countryName?: string;
    postalCode: string;
    contractorPhoneID: number;
    phoneNumber: string;
    emailAddress: string;
    insuranceDetailID: number;
    documentID: string;
    insurerName: string;
    coverageAmount: number;
    effectiveDate: string;
    expirationDate: string;
    documentPath: string;
    xactanetID: number;
    xactanetAddress: string;
    xactanetCode: string;
    insuranceStatus: string;
    xactStatus: string;
}


// AccountSetting Personal Information Update
export interface PersonalInfoUpdate {
    firstName: string;
    lastName: string;
    contractorPhoneID: number;
    phoneNumber: string;
    addressID: number;
    address1: string;
    address2: string;
    city: string;
    provinceID: string;
    countryID: string;
    postalCode: string;
}

// AccountSetting Insurance Update
export interface InsuranceUpdate {
    insuranceDetailID: number;
    insurerName: string;
    coverageAmount: number;
    effectiveDate: string;
    expirationDate: string;
    documentID: string;
}

export interface XactnetUpdate {
    xactanetID: number;
    xactanetCode: string;
    xactanetAddress: string;
}
