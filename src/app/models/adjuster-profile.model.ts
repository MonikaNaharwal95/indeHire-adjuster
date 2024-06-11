export interface Employment {
    city: string;
    countryID: string;
    employerName: string;
    fromDate: string;
    jobtitle: string;
    notes: string;
    provinceID: string;
    toDate: string;
    employmentID?: number;
}

export interface DeleteEmployment {
    city: string;
    countryID: string;
    employerName: string;
    employmentExperince: string;
    employmentID: number;
    fromDate: string;
    jobTitle: string;
    notes: string;
    provinceID: string;
    toDate: string;
}

export interface Education {
    city: string;
    countryID: string;
    degreeTypeID: string;
    endDate: string;
    notes: string;
    provinceID: string;
    schoolName: string;
    specialization: string;
    startDate: string;
    educationID?: number;
}

export interface Certification {
    certificateNumber: string;
    certificationDate: string ;
    childCertificationID: string | string[];
    documentID: number;
    expirationDate: string;
    parentCertificationID: string;
    certificationID?: number;
}

export interface DeleteAlert {
    obj: DeleteCertification;
    type: number;
}

export interface DeleteCertification {
    certificateNumber: string;
    certificationDate: string;
    certificationID: number;
    certificationTypeID: string | string[];
    description: string;
    documentFileName: string;
    documentID: string;
    // documentPath: string;
    documentTypeID: string;
    expirationDate: string;
    hasChild: boolean;
    isParent: boolean;
    parentCertificationID: string;
}

export interface PostInsurance {
    files: FormData;
    insurerName: string;
    coverageAmount: number;
    startDate: Date;
    endDate: Date;
}

export interface UpdateInsurance {
    files: FormData;
    insurerName: string;
    coverageAmount: string;
    effectiveDate: Date;
    expirationDate: Date;
    insuranceDetailID: string;
}

export interface PutSsn {
    ssn: number;
}

export interface PostSummary {
    profileDescription: string;
    profileTitle: string;
}

export interface Software {
    softwareKnowledges: SubSoftware[];
}
export interface SubSoftware {
    optionNotes: string;
    softwareKnowledgeExperienceTypeID: string;
    softwareKnowledgeID: number;
    softwareKnowledgeTypeID: string;
}

export interface Insurance {
    insuranceDesignationTypeID: string;
}

export interface Equipments {
    equipmentsView: Equip[];
}

export interface Equip {
    equipmentTypeID: string;
    optionNotes: string;
}

export interface Travel {
    travelDistance: number;
    isWillingRelocate: boolean;
    relocateState: string;
}

export interface Losstype {
    lossTypeExpertiseID: string;
}

export interface Language {
    languages: Lang[];
}

export interface Lang {
    isSpeak: boolean;
    languageTypeID: string;
}


export interface WorkExp {
    experiences: Exp[];
    speciallities: Spec[];
}

export interface Exp {
    experienceID: number;
    experienceTypeID: string;
    experienceYearTypeID: string;
}
export interface Spec {
    speciallitiesSubTypeID: string;
    speciallitiesTypeID: string;
}

export interface ProfileVisibility {
    isProfilePublic: boolean;
    isAdminAction: boolean;
    adminID: number;
}

export interface PostPerf {
    availabilityTypeID: string;
    availablityDate: string;
    hourlyRate: number;
    hourlyRateTypeID: string;
    jobPreference: string;
    perClaimBasisRateTypeID: string;
    perClaimCommission: number;
    perClaimRate: number;
}


export interface SoftwareValueChange {
    optionNotes: string;
    softwareKnowledgeExperienceTypeID: string;
    softwareKnowledgeID: number;
    softwareKnowledgeTypeID: string;
}

export interface DocumentResponse {
    documentID: number;
    documentTypeID: number;
    documentFileName: string;
    miMTypeID: number;
    documentDescription: string;
    documentPath: string;
    contractorID: number;
    moduleType: number;
    isProfileImage: boolean;
    isItForFountain?: boolean;
}
