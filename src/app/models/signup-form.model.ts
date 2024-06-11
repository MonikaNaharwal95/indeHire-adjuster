export interface SignupFormModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    terms: boolean;
    phone: string;
    city: string;
    state: string;
    zip: string;
}

export interface RegistrationContactInfo {
    phoneNumber: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
}
