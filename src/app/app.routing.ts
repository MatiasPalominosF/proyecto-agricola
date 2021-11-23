import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './_layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './_layout/private-layout/private-layout.component';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register';
import { LoginComponent } from './login';
import { ChangelogComponent } from './changelog/changelog.component';

const appRoutes: Routes = [
  // Public layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: '', component: LoginComponent }
    ]
  },
  // Private layout
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('../app/content/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'harvest', loadChildren: () => import('../app/content/harvest/harvest.module').then(m => m.HarvestModule) },
      { path: 'category', loadChildren: () => import('../app/content/category/category.module').then(m => m.CategoryModule) },
      { path: 'logout', component: LoginComponent },
      { path: 'changelog', component: ChangelogComponent },
      { path: '', component: LoginComponent }
    ],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'changelog' }
];

export const routing = RouterModule.forRoot(appRoutes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' });
