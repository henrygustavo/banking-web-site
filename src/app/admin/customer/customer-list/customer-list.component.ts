import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { CustomerService } from '../../services/customer.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;
  rows = new Array<any>();
  columns: Array<any> = [];


  constructor( private _menuService: MenuService, private _customerService: CustomerService) { }

  ngOnInit() {

    this._menuService.selectMenuItem('customers');

    this. columns = [
      { prop: 'id' , name: 'id' },
      { prop: 'firstName' , name: 'First Name' },
      { prop: 'lastName' , name: 'Last Name'  },
      { prop: '', name: '', cellTemplate: this.editTmplRow}];
  
    this. rows = [
                { id: '1', firstName: 'Henry', lastName: 'Fuentes' },
                { id: '2', firstName: 'Boris', lastName: 'Vera' },
                { id: '3', firstName: 'Frank', lastName: 'Jonislla' },
                { id: '4', firstName: 'Felipe', lastName: 'Llancachagua' } ];

     }

}
