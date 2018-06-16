import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.component.html',
  styleUrls: ['./transaction-create.component.css']
})
export class TransactionCreateComponent implements OnInit {

  constructor(private _menuService: MenuService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('transactions');
  }

}
