import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {Customer} from '../models/customer';
import {BaseResourceService} from '../services/base-resource.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomerService extends BaseResourceService <Customer> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'customers');
    }

    public getByDni(dni: string): Observable<Customer> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/dni/${dni}`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
}
