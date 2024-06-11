import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { IndehireAuthGuard } from './auth/auth.guard';
import { UnverifiedUserActionComponent } from './unverified-user-action/unverified-user-action.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CrossOriginFallbackComponent } from './cross-origin-fallback/cross-origin-fallback.component';

const routes: Routes = [
  { path: 'callback', component: AuthCallbackComponent, pathMatch: 'full' },
  { path: `update-password/:id`, component: ResetPasswordComponent },
  { path: 'unverifieduser-fallback', component: UnverifiedUserActionComponent },
  // { path: 'cross-origin-fallback', component: CrossOriginFallbackComponent},
  {
    path: 'auth',
    canLoad: [IndehireAuthGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
