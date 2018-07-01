import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../../shared/services/menu.service';
import { CustomerService } from '../../services/customer.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControlName, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Customer } from '../../models/customer';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertHandleService } from '../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { CustomValidators } from 'ng2-validation';

@Component({ selector: 'app-customer-edit', templateUrl: './customer-edit.component.html', styleUrls: ['./customer-edit.component.css'] })
export class CustomerEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;

  constructor(private _menuService: MenuService,
    private _customerService: CustomerService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder) { }

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

  setUpValidationMessages(): void {

    this.validationMessages = {

      dni: {
        required: 'DNI is required.',
        rangeLength: 'DNI must have 8 numbers.',
        digits: 'Please enter a valid number.'
      },
      firstName: {
        required: 'Fist Name is required.',
        minlength: 'Fist Name must be at least 2 characters.'
      },
      lastName: {
        required: 'Last Name is required.',
        minlength: 'Last Name must be at least 2 characters.'
      },
      userName: {
        required: 'User Name is required.',
        minlength: 'User Name must be at least 4 characters.'
      },
      email: {
        required: 'Email is required.',
        minlength: 'Email must be at least 4 characters.',
        email: 'Please enter a valid email address.'
      },
      password: {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters.'
      },
      confirmPassword: {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters.',
        equalTo: 'ConfirmPassword does not match with Password'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    const formSubscription = this._route.params.subscribe(

      (params): void => {

        const id: number = Number(params['id']);
        let isAddingNewCustomer: boolean = id !== 0;

        let password = new FormControl({ value: '', disabled: isAddingNewCustomer }, [Validators.required, Validators.minLength(6)]);
        let confirmPassword = new FormControl({ value: '', disabled: isAddingNewCustomer },
          [Validators.required, Validators.minLength(6),
          CustomValidators.equalTo(password)]);

        this.mainForm = this.formBuilder.group({
          id: id,
          dni: new FormControl({ value: '', disabled: isAddingNewCustomer },
                                 [Validators.required, CustomValidators.rangeLength([8, 8]),
          CustomValidators.digits]),
          firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
          lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
          userName: new FormControl({ value: '', disabled: isAddingNewCustomer },
                    [Validators.required, Validators.minLength(4)]),
          email: new FormControl({ value: '', disabled: isAddingNewCustomer },
                [Validators.required, Validators.minLength(4), CustomValidators.email]),
          password: password,
          confirmPassword: confirmPassword,
          active: new FormControl(true)
        });

        this.getModel(id);
      });

    this.subscription.add(formSubscription);
  }

  save(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {

      let model =  this.mainForm.value;

      this.blockUI.start();
      let saveSubscription = this._customerService.save(model, Number(model.id)).subscribe(
        () => {
          this._messageAlertHandleService.handleSuccess('Saved successfully');
          this.mainForm.reset();
          this.blockUI.stop();
          this._router.navigate(['/customers']);
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

    let modelSubscription = this._customerService.get(id).subscribe(
      (response: Customer) => {

        this.mainForm.patchValue(
          {
            id: response.id,
            dni: response.dni,
            firstName: response.firstName,
            lastName: response.lastName,
            userName: response.userName,
            email: response.email,
            password: 'xxxxxx-xxxxx',
            confirmPassword: 'xxxxxx-xxxxx',
            active : response.active
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
}
