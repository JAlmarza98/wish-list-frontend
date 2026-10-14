import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { AuthService } from '@auth/auth.service';
import { credentialsInterceptor } from '@auth/credentials.interceptor';

function initAuth(auth: AuthService) {
  return () => firstValueFrom(auth.loadCurrentUser());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [AuthService], multi: true },
  ]
};
