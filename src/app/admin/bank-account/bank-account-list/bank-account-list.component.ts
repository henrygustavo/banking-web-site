import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { BankAccountService } from '../../services/bank-account.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.css']
})
export class BankAccountListComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;
  rows = new Array<any>();
  columns: Array<any> = [];

  constructor(private _menuService: MenuService, private _bankAccountService: BankAccountService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('bank-accounts');

    this. columns = [
      { prop: 'id' , name: 'id' },
      { prop: 'number' , name: 'Number' },
      { prop: 'customerName' , name: 'Customer Name'  },
      { prop: 'isLocked' , name: 'Locked'  },
      { prop: '', name: '', cellTemplate: this.editTmplRow}];

    this. rows = [
                { id: '1', number: '001104860195023275', customerName: ' Henry Fuentes' , isLocked: 'false'},
                { id: '2', number: '001104860195023276', customerName: ' Boris Vera' , isLocked: 'false'},
                { id: '3', number: '001104860195023277', customerName: ' Frank Jonislla' , isLocked: 'false'},
                { id: '4', number: '001104860195023278', customerName: ' Felipe Llancachagua' , isLocked: 'true'}];
  }

}
