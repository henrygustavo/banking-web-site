import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { BankAccountService } from '../../services/bank-account.service';

@Component({
  selector: 'app-bank-account-edit',
  templateUrl: './bank-account-edit.component.html',
  styleUrls: ['./bank-account-edit.component.css']
})
export class BankAccountEditComponent implements OnInit {

  constructor(private _menuService: MenuService, private _bankAccountService: BankAccountService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('bank-accounts');
  }

}
