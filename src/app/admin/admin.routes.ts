import { Route, RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { BankAccountListComponent } from './bank-account/bank-account-list/bank-account-list.component';
import { BankAccountEditComponent } from './bank-account/bank-account-edit/bank-account-edit.component';
import { TransactionListComponent } from './transaction/transaction-list/transaction-list.component';
import { TransactionCreateComponent } from './transaction/transaction-create/transaction-create.component';

const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'customers',
        component: CustomerListComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'customers/edit/:id',
        component: CustomerEditComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'bank-accounts',
        component: BankAccountListComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'bank-accounts/edit/:id',
        component: BankAccountEditComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'transactions',
        component: TransactionListComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'transactions/create/:id',
        component: TransactionCreateComponent,
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

