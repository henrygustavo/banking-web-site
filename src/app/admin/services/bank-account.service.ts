import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { BankAccount } from '../models/bank-account';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BankAccountService extends BaseResourceService <BankAccount> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'bank-accounts');
    }

    public generateAccountNumber(): Observable<any> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/new-account`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }

}
