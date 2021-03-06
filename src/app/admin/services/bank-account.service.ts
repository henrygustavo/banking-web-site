import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { BankAccount } from '../models/bank-account';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BankAccountService extends BaseResourceService <BankAccount> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'bankAccounts');
    }

    public generateNumber(): Observable<any> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/newNumber`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }

}
