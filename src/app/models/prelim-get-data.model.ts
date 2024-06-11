export interface PrelimData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    countryID: string;
    state: string;
    city: string;
    postalCode: string;
    address1: string;
    address2: string;
    signupReferenceTypeID: string;
    signupReferenceInfo: string;
    contractorTypeID: string;
    industryTypeID: string;
    preferredJobTypeView: PreferredJobTypeView[];
    preferredRateTypeView: PreferredRateTypeView[];
    experiencesView: ExperiencesView[];
    specialitiesView: SpecialitiesView[];
    languagesView: LanguageTypeView[];
    insuranceDesignationTypeID: string;
    lossTypeExpertiseID: string;
    equipmentTypeID?: string;
    equipmentsView: EquipmentsView[];
    softwareKnowledgesView: SoftwareKnowledgeView[];
    travelDistance: number;
    isWillingRelocate: string;
    relocateState: string;
    isCrawfordEmployee: string;
}

export interface EquipmentsView {
    equipmentTypeID: string;
    optionNotes: string;
}
export interface PreferredJobTypeView {
    workEnvironmentTypeID: string;
    preferredRateTypeView: PreferredRateTypeView;
}
export interface PreferredRateTypeView {
    rateTypeID: string;
    rateAmount: string;
    ratePercentage: string;
}
export interface ExperiencesView {
        experienceTypeID: string;
        experienceYearTypeID: string;
}
export interface SpecialitiesView {
    specialitiesTypeID: string;
    specialitiesSubTypeID: string;
    // exp_Specialities_RelationID: string;
}
export interface LanguageTypeView {
    languageTypeID: string;
    isSpeak: string;
}
export interface SoftwareKnowledgeView {
    softwareKnowledgeTypeID: string;
    softwareKnowledgeExpTypeID: string;
    optionNotes: string;
}

// Prelim ProfessionalInfo2
export interface PostProfessional2 {
    insuranceDesignationTypeID: string;
    lossTypeExpertiseID: string;
    softwareKnowledges: SoftwareKnowledgeView[];
    languages: LanguageTypeView[];
}

export interface PostProfessional1 {
    experiences: ExperiencesView[];
    speciallities: SpecialitiesView[];
}


export interface PostPrelimModel {
    preliminaryStepID: number;
    contractorType: string;
    ssnNumber?: string;
    industryType: string;
    isFinalSubmit: boolean;
    jsonData: string;
}
