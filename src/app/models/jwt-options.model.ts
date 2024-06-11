export interface IndehireJwtOptions {
    enabled: boolean;
    token: string;
    whitelistedDomains: string[];
    blacklistedRoutes: string[];
}