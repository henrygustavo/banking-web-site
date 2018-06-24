import { Route, RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { BankAccountListComponent } from './bank-account/bank-account-list/bank-account-list.component';
import { BankAccountEditComponent } from './bank-account/bank-account-edit/bank-account-edit.component';
import { TransferListComponent } from './transfer/transfer-list/transfer-list.component';
import { TransferCreateComponent } from './transfer/transfer-create/transfer-create.component';

import {NgxPermissionsGuard} from 'ngx-permissions';

const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'MEMBER']}}
    },
    {
        path: 'customers',
        component: CustomerListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN']}}
    },
    {
        path: 'customers/edit/:id',
        component: CustomerEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN']}}
    },
    {
        path: 'bank-accounts',
        component: BankAccountListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN']}}
    },
    {
        path: 'bank-accounts/edit/:id',
        component: BankAccountEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN']}}
    },
    {
        path: 'transfers',
        component: TransferListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['MEMBER']}}
    },
    {
        path: 'transfers/create/:id',
        component: TransferCreateComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['MEMBER']}}
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'MEMBER']}}
    }
];

export const adminRoutes: ModuleWithProviders = RouterModule.forChild(routes);

