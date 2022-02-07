import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './_layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './_layout/private-layout/private-layout.component';
import { AuthGuard } from './_guards/auth.guard';
import { RoleGuard } from './_guards/role.guard';
import { RegisterComponent } from './register';
import { LoginComponent } from './login';
import { ChangelogComponent } from './changelog/changelog.component';
import { ForgotPasswordComponent } from './forgot-password';

const appRoutes: Routes = [
  // Public layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: '', component: LoginComponent },
    ]
  },
  // Private layout
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard', loadChildren: () => import('../app/content/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [RoleGuard],
        data: { expectedRole1: 'admin', expectedRole2: 'company', expectedRole3: 'superadmin', expectedRole4: 'planner' }
      },
      {
        path: 'user', loadChildren: () => import('../app/content/user/user.module').then(m => m.UserModule), canActivate: [RoleGuard],
        data: { expectedRole1: 'admin', expectedRole2: 'company', expectedRole3: 'superadmin' }
      },
      {
        path: 'harvest', loadChildren: () => import('../app/content/harvest/harvest.module').then(m => m.HarvestModule), canActivate: [RoleGuard],
        data: { expectedRole1: 'admin', expectedRole2: 'company', expectedRole3: 'worker', expectedRole4: 'planner' }
      },
      {
        path: 'category', loadChildren: () => import('../app/content/category/category.module').then(m => m.CategoryModule), canActivate: [RoleGuard],
        data: { expectedRole1: 'admin', expectedRole2: 'company', expectedRole3: '', expectedRole4: 'planner' }
      },
      { path: 'logout', component: LoginComponent },
      { path: 'changelog', component: ChangelogComponent },
      { path: '', component: LoginComponent }
    ],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'changelog' }
];

export const routing = RouterModule.forRoot(appRoutes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' });
