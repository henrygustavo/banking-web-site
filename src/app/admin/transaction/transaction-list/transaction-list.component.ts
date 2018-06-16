import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  constructor(private _menuService: MenuService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('transactions');
  }

}
