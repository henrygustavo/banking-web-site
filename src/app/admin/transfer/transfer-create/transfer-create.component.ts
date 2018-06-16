import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-transfer-create',
  templateUrl: './transfer-create.component.html',
  styleUrls: ['./transfer-create.component.css']
})
export class TransferCreateComponent implements OnInit {

  constructor(private _menuService: MenuService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('transfers');
  }

}
