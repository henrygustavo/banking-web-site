import {Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {MenuService} from '../../../shared/services/menu.service';
import {CustomerService} from '../../services/customer.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Dictionary} from '../../models/dictionary';
import {Subscription} from 'rxjs/Subscription';
import {FormGroup, FormControlName, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Customer} from '../../models/customer';
import {GenericValidator} from '../../../shared/validators/generic-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

@Component({selector: 'app-customer-edit', templateUrl: './customer-edit.component.html', styleUrls: ['./customer-edit.component.css']})
export class CustomerEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI()blockUI : NgBlockUI;
  @ViewChildren(FormControlName, {read: ElementRef})
  formInputElements : ElementRef[] = [];
  displayMessage : {[key : string]: string} = {};
  roles : Array < Dictionary > = [];
  validationMessages : {[key : string]: {[key : string]: string}};
  genericValidator : GenericValidator;
  subscription : Subscription = new Subscription();
  mainForm : FormGroup;
  customer : Customer;

  constructor(private _menuService : MenuService,
              private _customerService : CustomerService,
              private _messageAlertHandleService: MessageAlertHandleService,
                private _route: ActivatedRoute,
              private _router: Router,
              private fb: FormBuilder) {}

    ngOnInit() {
      this._menuService.selectMenuItem('customers');

      this.setUpValidationMessages();

      this.setUpFormControls();
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

  setUpValidationMessages() : void {

    this.validationMessages = {

      firstName: {
        required: 'Fist Name is required.',
        minlength: 'Fist Name must be at least 2 characters.'
      },
      lastName: {
        required: 'Last Name is required.',
        minlength: 'Last Name must be at least 2 characters.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    const formSubscription = this._route.params.subscribe(

        (params): void => {

            const id: number = Number(params['id']);

            this.mainForm = this.fb.group({
                id: id,
                firstName: new FormControl( '' ,[Validators.required, Validators.minLength(2)]),
                lastName: new FormControl( '' ,[Validators.required, Validators.minLength(2)])
            });
        });

        this.subscription.add(formSubscription);
  }

  save(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {
        // Copy the form values over the product object values
        let model = Object.assign({}, this.customer, this.mainForm.value);

        this.blockUI.start();
 /*        let saveSubscription =  this._customerService.save(model, Number(model.id)).subscribe(
            () => { */
                // Reset the form to clear the flags
                    this._messageAlertHandleService.handleSuccess('Saved successfully');
                    this.mainForm.reset();
                    this.blockUI.stop();
                    this._router.navigate(['/customers']);
         /*    },
            error => {
                this._messageAlertHandleService.handleError(error);
                this.blockUI.stop();
            }
         ); 

        this.subscription.add(saveSubscription);*/
    }
  }
}
