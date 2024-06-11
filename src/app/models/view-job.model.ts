export interface JobFiltermodel {
    specialties: string;
    distance: number;
    location: number;
    relevance: string;
}

export interface JobActionModel {
    jobID: number;
    isSave: boolean;
    isDisLike: boolean;
}

export interface CustomFieldsModel {
    requirementTypeID: string;
    requirementTypeValue?: string;
    propertyTypeID: string;
    propertyTypeValue?: string;
}
