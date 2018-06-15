import { Route, RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { ClientListComponent } from './client/client-list/client-list.component';

const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'clients',
        component: ClientListComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'clients/edit/:id',
        component: ClientEditComponent,
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

