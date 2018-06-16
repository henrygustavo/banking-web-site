import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { BankAccountService } from '../../services/bank-account.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormControlName, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { Subscription } from 'rxjs/Subscription';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-bank-account-search',
  templateUrl: './bank-account-search.component.html',
  styleUrls: ['./bank-account-search.component.css']
})
export class BankAccountSearchComponent implements OnInit, AfterViewInit {
  @Output() onSearch: EventEmitter<number> = new EventEmitter<number>();

  @BlockUI()blockUI: NgBlockUI;
  @ViewChildren(FormControlName, {read: ElementRef})

  customerId: number;
  customerName: string;
  formInputElements: ElementRef[] = [];
  displayMessage: {[key: string]: string} = {};
  validationMessages: {[key: string]: {[key: string]: string}};
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  searchForm: FormGroup;

  constructor(private _bankAccountService: BankAccountService,
              private _messageAlertHandleService: MessageAlertHandleService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.setUpValidationMessages();

    this.setUpFormControls();

  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    let controlSubscription = Observable.merge(this.searchForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(this.searchForm);
    });

    this.subscription.add(controlSubscription);

  }

  setUpValidationMessages(): void {

    this.validationMessages = {

      dni: {
            required: 'DNI is required.',
            rangeLength: 'DNI must have 8 numbers.',
            digits: 'Please enter a valid number.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    this.searchForm = this.formBuilder.group({
      dni: new FormControl( '' , [Validators.required,  CustomValidators.rangeLength([8, 8]), CustomValidators.digits])
      });

  }

  search(): void {

    this.customerName = 'Henry Fuentes';
    this.customerId = 1;
    this.onSearch.emit(this.customerId);

  }
}
