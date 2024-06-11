export interface AuthConfig {
    enabled: boolean;
    clientID: string;
    domain: string;
    responseType: string;
    redirectUri: string;
    silentCallbackURL: string;
    scope: string;
    audience: string;
    prompt: string;
    database: string;
    whitelistedDomains: string[];
    blacklistedRoutes: string[];
}
