import { Component, OnInit, AfterViewInit, ViewChildren,
        ElementRef, OnDestroy } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { BankAccountService } from '../../services/bank-account.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControlName, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BankAccount } from '../../models/bank-account';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import {CustomValidators} from 'ng2-validation';

@Component({
  selector: 'app-bank-account-edit',
  templateUrl: './bank-account-edit.component.html',
  styleUrls: ['./bank-account-edit.component.css']
})
export class BankAccountEditComponent implements  OnInit, AfterViewInit, OnDestroy  {

  @BlockUI()blockUI: NgBlockUI;
  @ViewChildren(FormControlName, {read: ElementRef})
  formInputElements: ElementRef[] = [];
  displayMessage: {[key: string]: string} = {};
  validationMessages: {[key: string]: {[key: string]: string}};
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;
  bankAccount: BankAccount = new  BankAccount();

  constructor(private _menuService: MenuService,
              private _bankAccountService: BankAccountService,
              private _messageAlertHandleService: MessageAlertHandleService,
              private _route: ActivatedRoute,
              private _router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this._menuService.selectMenuItem('bank-accounts');

    this.setUpValidationMessages();

    this.setUpFormControls();

  }

  ngAfterViewInit(): void {

    const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const controlSubscription = Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });

    this.subscription.add(controlSubscription);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(customerId: number): void {

    this.bankAccount.customerId = customerId;
  }

  setUpValidationMessages(): void {

    this.validationMessages = {

      number: {
               required: 'Bank Account Number is required.',
               digits: 'Please enter a valid number.',
               rangeLength: 'Bank Account Number must have 18 numbers.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    const formSubscription = this._route.params.subscribe(

        (params): void => {

            const id: number = Number(params['id']);
            this.bankAccount.id = id;
            this.mainForm = this.formBuilder.group({
                id: id,
                number: new FormControl( '' , [Validators.required, CustomValidators.digits,
                                               CustomValidators.rangeLength([18, 18])]),
                isLocked: new FormControl(false)
            });

            this.getModel(id);
        });

        this.subscription.add(formSubscription);
  }

  hasCustomerId(): boolean {

     return (this.bankAccount.customerId !== undefined
            && this.bankAccount.customerId !== 0 );
  }

  generateNumber(): void {

    this.blockUI.start();

    let searchSubscription = this._bankAccountService.generateNumber().subscribe(
      (response: any) => {

        this.mainForm.controls['number'].setValue(response.accountNumber);

        this.blockUI.stop();
      },
      (error: any) => {
        this._messageAlertHandleService.handleError(error);

        this.blockUI.stop();
      }
    );

    this.subscription.add(searchSubscription);
  }

  save(): void {

    if (this.mainForm.valid) {
        const model = Object.assign({}, this.bankAccount, this.mainForm.value);

        this.blockUI.start();

         let saveSubscription =  this._bankAccountService.save(model, Number(model.id)).subscribe(
            () => {
                    this._messageAlertHandleService.handleSuccess('Saved successfully');
                    this.mainForm.reset();
                    this.blockUI.stop();
                    this._router.navigate(['/bank-accounts']);
             },
            error => {
                this._messageAlertHandleService.handleError(error);
                this.blockUI.stop();
            }
         );

        this.subscription.add(saveSubscription);
    }
  }

  getModel(id: number): void {

    if (id === 0) { return; }

    this.blockUI.start();

    let modelSubscription = this._bankAccountService.get(id).subscribe(
      (response: BankAccount) => {

        this.bankAccount = response;
        this.mainForm.patchValue(
          {
            id: response.id,
            number: response.number,
            isLocked: response.isLocked
          });

        this.blockUI.stop();
      },
      (error: any) => {

        this._messageAlertHandleService.handleError(error);
        this.blockUI.stop();
      }
    );

    this.subscription.add(modelSubscription);
  }

  disabled(): boolean {

    return this.bankAccount.id !== 0;
  }
}
