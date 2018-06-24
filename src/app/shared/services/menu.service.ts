import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MenuItem } from '../models/menu-item';

@Injectable()
export class MenuService {

    private subject = new Subject<any>();

    public getListMenuItems(): MenuItem[] {

        return [

            new MenuItem('fa-home', 'dashboard', 'dashboard', 'DashBoard', ['ADMIN', 'MEMBER']),
            new MenuItem('fa-edit', 'customers', 'customers', 'Customers', ['ADMIN']),
            new MenuItem('fa-edit', 'bank-accounts', 'bank-accounts', 'Bank Accounts', ['ADMIN']),
            new MenuItem('fa-credit-card', 'transfers', 'transfers', 'Payment/Transfers', ['MEMBER'])
        ];
    }

    public selectMenuItem(selectedMenuItem: string) {
        this.subject.next({ text: selectedMenuItem });
    }

    public getSelectedMenuItem(): any {
        return this.subject.asObservable();
    }
}
