export interface LookupModel {
    key: string;
    value: string;
    isChecked?: boolean;
    isHidden?: boolean;
    isMandatory?: boolean;
    userGroupTypeID?: string;
}

export interface ContractorLookupModel {
    key: string;
    value: string;
    industryCode: number;
}

export interface ChildCertficateLookup {
    key: string;
    value: string;
    parentCertificateCode: string;
}

export interface CertficateLookup {
    key: string;
    value: string;
    status: boolean;
}
