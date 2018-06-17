import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/observable';
import { MenuItem } from '../models/menu-item';

@Injectable()
export class MenuService {

    private subject = new Subject<any>();

    public getListMenuItems(): MenuItem[] {

        return [

            new MenuItem('fa-home', 'dashboard', 'dashboard', 'DashBoard'),
            new MenuItem('fa-edit', 'customers', 'customers', 'Customers'),
            new MenuItem('fa-edit', 'bank-accounts', 'bank-accounts', 'Bank Accounts'),
            new MenuItem('fa-credit-card', 'transfers', 'transfers', 'Payment/Transfers')
        ];
    }

    public selectMenuItem(selectedMenuItem: string) {
        this.subject.next({ text: selectedMenuItem });
    }

    public getSelectedMenuItem(): Observable<any> {
        return this.subject.asObservable();
    }
}
