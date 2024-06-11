export interface WorkHistoryData {
  // contractorID: number;
  // carrierID: number;
  // jobTitle: string;
  // jobDescription: string;
  // countryID: string;
  // provinceID: string;
  // city: string;
  // feedback: string;
  // rating: number;
  // startDate: string;
  // endDate: string;

  
  contractorID: number;
  requirementTypeID: string;
  address1: string;
  feedbackTypeID: string;
  feedbackTypeName: string;
  feedback: string;
  rating: number;
  scheduleDate: string;
  companyName: string;
}

export interface CarrierViewData {
  id: number;
  contractorID: number;
  contractorTypeID: string;
  firstName: string;
  lastName: string;
  profileTitle: string;
  profileDescription: string;
  completionStatusID: string;
  preliminaryStepID: number;
  profileImageID: string;
  // documentPath: string;
  stateLicenseStatus: string;
  addressViews: AddressViews[];
  contractorEmailViews: ContractorEmailViews[];
  contractorPhoneViews: ContractorPhoneViews[];
  certificationViews: CertificationViews[];
  educationViews: EducationViews[];
  employmentViews: EmploymentViews[];
  experienceViews: ExperienceViews[];
  specialityViews: SpecialityViews[];
  insuranceDesignationViews: InsuranceDesignationViews[];
  licenseViews: LicenseViews[];
  lossTypeExpertiseViews: LossTypeExpertiseViews[];
  softwareKnowledgeViews: SoftwareKnowledgeViews[];
  languageViews: LanguageViews[];
  indehireWorkExperinceViews: IndehireWorkExperienceViews[];
  equipmentViews: EquipmentViews[];
  contractorTypeMappingViews: ContractorTypeMappingViews[];
  preferredJobTypeView: PreferredJobTypeView[];
  stateLicensesViews: StateLicenseViews[];
  appointmentInformationsViews: AppointmentInformationViews[];
  contractorAvailablityID: string;
  contractorAvailablityTypeID: string;
  availablityDate: string;
  totalReviewCount: string;
  profilecompletionValue: number;
  starRating: string;
  isProfilePublic: boolean;
  applicantID: string;
  fountainStage: string;
  ssnStatus: string;
  insuranceStatus: string;
  lawsonStatus: string;
  npnStatus: string;
  xactStatus: string;
  isAdminAction: boolean;
  isApplicableIndehire: boolean;
  isCrawfordEmployee: boolean;
  rejection_Reason: string;
  // acceptAgreementDocument: string;
  acceptAgreementDocumentID: string;
  acceptAgreementSignDate: string;
  isAcceptAgreement: boolean;
  contractorNPN: string;
  travelDistance: number;
  isVerified: boolean;
  isWillingRelocate: boolean;
  relocateState: string;
  stateNames?: string;
  isPaymentAvailable: boolean;
}

export interface AddressViews {
  addressID: number;
  addressTypeID: string;
  address1: string;
  address2: string;
  countryID: string;
  provinceID: string;
  city: string;
  postalCode: string;
}
export interface ContractorEmailViews {
  contractorEmailID: number;
  contractorID: number;
  emailAddress: string;
  isPrimary: boolean;
}
export interface ContractorPhoneViews {
  contractorPhoneID: number;
  contractorID: number;
  phoneNumber: string;
}
export interface CertificationViews {
  certificationID: number;
  certificationTypeID: string ;
  certificateNumber: string;
  documentID: string;
  documentPath: string;
  documentTypeID: string;
  documentFileName: string;
  description: string;
  certificationDate: string;
  expirationDate: string;
  isParent: boolean;
  hasChild: boolean;
  parentCertificationID: string;
}
export interface EducationViews {
  educationID: number;
  degreeTypeID: string;
  schoolName: string;
  specialization: string;
  startDate: string;
  endDate: string;
  countryID: string;
  city: string;
  provinceID: string;
  notes: string;
}
export interface EmploymentViews {
  employmentID: number;
  countryID: string;
  provinceID: string;
  city: string;
  employerName: string;
  jobTitle: string;
  fromDate: string;
  toDate: string;
  notes: string;
  employmentExperince: string;
}
export interface ExperienceViews {
  experienceID: number;
  experienceTypeID: string;
  experienceYearTypeID: string;
}
export interface SpecialityViews {
  specialitiesID: string;
  specialitiesTypeID: string;
  specialitiesSubTypeID: string;
  specialitiesTypeName?: string;
}
export interface InsuranceDesignationViews {
  insuranceDesignationID: number;
  isnuranceDesignationTypeID: string;
}
export interface LicenseViews {
  licenseTypeID: number;
  licenseStatusID: number;
  licenseNumber: string;
  documentID: number;
  documentPath: string;
  documentTypeID: string;
  documentFileName: string;
  description: string;
  countryID: string;
  provinceID: string;
  issueDate: string;
  expirationDate: string;
}
export interface LossTypeExpertiseViews {
  lossTypeID: string;
  lossTypeExpertiseID: string;
}
export interface SoftwareKnowledgeViews {
  softwareKnowledgeID: number;
  softwareKnowledgeTypeID: string;
  softwareKnowledgeExperienceTypeID: string;
  optionNotes: string;
}
export interface LanguageViews {
  languageTypeID: string;
  isSpeak: boolean;
}
export interface IndehireWorkExperienceViews {
  carrierID: number;
  carrierName: string;
  jobTitle: string;
  jobDescription: string;
  countryID: string;
  provinceID: string;
  city: string;
  feedback: string;
  rating: number;
  startDate: string;
  endDate: string;
}
export interface EquipmentViews {
  equipmentID: number;
  contractorID: number;
  equipmentTypeID: string;
  optionNotes: string;
}
export interface ContractorTypeMappingViews {
  contractorTypeMappingID: number;
  industryTypeID: string;
  contractorTypeID: string;
  isActive: boolean;
}
export interface StateLicenseViews {
  stateCode: string;
  licenseNo: string;
  licenseExpiryDate: string;
  isAuto: boolean;
  isProperty: boolean;
  licenseStatus: boolean;
}
export interface AppointmentInformationViews {
  companyName: string;
  expirationDate: string;
}
export interface PreferredJobTypeView {
  contractorWorkEnvironmentID: string;
  workEnvironmentTypeID: string;
  preferredRateTypeView: {
    rateTypeID: string;
    rateAmount: string;
    ratePercentage: string;
  };
}

