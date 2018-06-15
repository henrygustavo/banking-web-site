import { Route, RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';

const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AdminGuard]
    }
];

export const adminRoutes: ModuleWithProviders = RouterModule.forChild(routes);

