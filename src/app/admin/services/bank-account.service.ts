import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { BankAccount } from '../models/bank-account';

@Injectable()
export class BankAccountService extends BaseResourceService <BankAccount> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'bank-accounts');
    }

}