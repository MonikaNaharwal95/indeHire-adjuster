export interface Culture {
    description: string;
    id: number;
    isDefault: boolean;
    name: string;
    dateFormat: string;
}
export interface Country {
    cultures: Culture[];
    countryIcon: string;
    description: string;
    id: number;
    isDefault: boolean;
    name: string;
}