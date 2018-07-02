import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControlName, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { CustomValidators } from 'ng2-validation';
import { TransferService } from '../../services/transfer.service';
import { Transfer } from '../../models/transfer';

@Component({
  selector: 'app-transfer-create',
  templateUrl: './transfer-create.component.html',
  styleUrls: ['./transfer-create.component.css']
})
export class TransferCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;

  constructor(private _menuService: MenuService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _transferService: TransferService) { }

  ngOnInit() {
    this._menuService.selectMenuItem('transfers');
    this.setUpValidationMessages();
    this.setUpFormControls();
    this.getSourceAccountNumber();
  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    let controlSubscription = Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });

    this.subscription.add(controlSubscription);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setUpValidationMessages(): void {

    this.validationMessages = {

      fromAccountNumber: {
        required: 'Source Account Number is required.',
        number: 'Please enter a valid account number.',
        rangeLength: 'Source Account Number must have 18 numbers.'
      },
      toAccountNumber: {
        required: 'Destiny Account Number is required.',
        number: 'Please enter a valid account number.',
        rangeLength: 'Destiny Account Number must have 18 numbers.'
      },
      amount: {
        required: 'Amount is required.',
        number: 'Please enter a valid amount.',
        gt: 'Amount must be greater than 0.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    this.mainForm = this.formBuilder.group({
      fromAccountNumber: new FormControl('', [Validators.required, CustomValidators.number,
      CustomValidators.rangeLength([18, 18])]),
      toAccountNumber: new FormControl('', [Validators.required, CustomValidators.number,
      CustomValidators.rangeLength([18, 18])]),
      amount: new FormControl('', [Validators.required, CustomValidators.number,
      CustomValidators.gt(0)])
    });
  }

  getSourceAccountNumber(): void {

    this._route.params.subscribe(

      (params): void => {
        const id: number = Number(params['id']);
        this.setUpSourceAccountNumber(id);
      });

  }
  setUpSourceAccountNumber(id: number): void {

    this.blockUI.start();
    let fromAccountNumberSubscription = this._transferService.getAccountNumber(id).subscribe(
      (response: any) => {

        this.mainForm.patchValue( { fromAccountNumber: response.accountNumber });
        this.blockUI.stop();
      },
      error => {
        this._messageAlertHandleService.handleError(error);
        this.blockUI.stop();
      }
    );

    this.subscription.add(fromAccountNumberSubscription);
  }

  transfer(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {
      let model =  this.mainForm.value;
      this.blockUI.start();
      let transferSubscription = this._transferService.transfer(model).subscribe(
        () => {
          this._messageAlertHandleService.handleSuccess('Saved successfully');
          this.mainForm.reset();
          this.blockUI.stop();
          this._router.navigate(['/transfers']);
        },
        error => {
          this._messageAlertHandleService.handleError(error);
          this.blockUI.stop();
        }
      );

      this.subscription.add(transferSubscription);
    }
  }
}
