import { ConfigService } from './services/config.service';
import { AuthService } from './auth/auth.service';

export function ConfigLoader(configService: ConfigService, authService: AuthService) {
    return () => new Promise((resolve, reject) => {
        configService.load().then(() => {
            const authConfig = configService.getAuthConfig();
            authService.configure(authConfig);
            resolve(true);
        });
    });
}
