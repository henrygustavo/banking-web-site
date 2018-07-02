import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TransferService } from '../../services/transfer.service';
import { Transfer } from '../../models/transfer';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;
  rows = new Array<any>();
  columns: Array<any> = [];
  subscription: Subscription = new Subscription();

  constructor(private _menuService: MenuService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _transferService: TransferService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('transfers');
    this.setUpColumns();
    this.loadData();
  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  setUpColumns(): void {

    this.columns = [
      { prop: 'number', name: 'Account Number' },
      { prop: 'balance', name: 'Balance' },
      { prop: '', name: '', cellTemplate: this.editTmplRow }];
  }

  loadData(): void {

    this.blockUI.start();

    let dataAllSubscription = this._transferService.getAll().subscribe(
      (response: Transfer[]) => {
        this.rows = response;
        this.blockUI.stop();
      },
      (error: any) => {
        this._messageAlertHandleService.handleError(error);

        this.blockUI.stop();
      }
    );

    this.subscription.add(dataAllSubscription);
  }
}
