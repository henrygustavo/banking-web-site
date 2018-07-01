import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { BankAccountService } from '../../services/bank-account.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Pagination } from '../../models/pagination';
import { Subscription } from 'rxjs/Subscription';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { PaginationResult } from '../../models/pagination-result';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.css']
})
export class BankAccountListComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;

  pagination: Pagination = new Pagination();
  subscription: Subscription = new Subscription();

  rows = new Array<any>();
  columns: Array<any> = [];

  constructor( private _menuService: MenuService, private _bankAccountService: BankAccountService,
              private _messageAlertHandleService: MessageAlertHandleService ) { }

  ngOnInit() {

    this._menuService.selectMenuItem('bank-accounts');

    this.initializePagination();
    this.setPage({ offset: 0 });
  }

  ngOnDestroy(): void {

      this.subscription.unsubscribe();
  }

  initializePagination (): void {

  this. columns = [
      { prop: 'id' , name: 'id' },
      { prop: 'number' , name: 'Number' },
      { prop: 'customerFullName' , name: 'Customer Full Name'  },
      { prop: 'isLocked' , name: 'Locked'  },
      { prop: '', name: '', cellTemplate: this.editTmplRow}];

      this.pagination.currentPage = 1;
      this.pagination.pageSize = 10;
      this.pagination.totalRecords = 0;
  }

  loadData(): void {

      this.blockUI.start();

      let userGetAllSubscription = this._bankAccountService.getAll(this.pagination).subscribe(
          (response: PaginationResult) => {

                      this.pagination.totalRecords = response.totalRecords;
                      this.pagination.totalPages = response.totalPages;

                      this.rows = response.content;

                      this.blockUI.stop();
          },
          (error: any) => {
                      this._messageAlertHandleService.handleError(error);

                      this.blockUI.stop();
          }
      );

      this.subscription.add(userGetAllSubscription);
  }

  setPage(pageInfo: any) {

      this.pagination.currentPage = pageInfo.offset + 1;

      this.loadData();
  }
}
