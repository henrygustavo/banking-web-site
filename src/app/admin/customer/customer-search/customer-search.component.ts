import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormControlName, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { Subscription } from 'rxjs/Subscription';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import { CustomValidators } from 'ng2-validation';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSearch: EventEmitter<number> = new EventEmitter<number>();

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })

  customerId: number;
  customerName: string;
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  searchForm: FormGroup;

  constructor(private _customerService: CustomerService,
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
      dni: new FormControl('', [Validators.required, CustomValidators.rangeLength([8, 8]), CustomValidators.digits])
    });

  }

  search(dni: string): void {

    this.blockUI.start();

    let searchSubscription = this._customerService.getByDni(dni).subscribe(
      (response: Customer) => {
        this.customerName = response.fullName;
        this.customerId = response.id;
        this.onSearch.emit(this.customerId);

        this.blockUI.stop();
      },
      (error: any) => {
        this._messageAlertHandleService.handleError(error);

        this.blockUI.stop();
      }
    );

    this.subscription.add(searchSubscription);

  }
}
