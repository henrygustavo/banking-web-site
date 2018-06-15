import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {Customer} from '../models/customer';
import {BaseResourceService} from '../services/base-resource.service';

@Injectable()
export class CustomerService extends BaseResourceService <Customer> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'customers');
    }

}