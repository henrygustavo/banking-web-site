import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import { Observable } from 'rxjs/Observable';
import { Transfer } from '../models/transfer';
import { environment } from '../../../environments/environment';
import { RequestOptions, Headers } from '@angular/http';

@Injectable()
export class TransferService {

    _url: string;

    constructor(private _jwHttp: JwtHttp) {
        this._url = 'bankTransfers';
    }

    public getAll(): Observable<Transfer[]> {

        let entity$ = this._jwHttp
            .get(`${environment.apiUrl}${this._url}`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }

    public getAccountNumber(id: number): Observable<any> {

        let entity$ = this._jwHttp
            .get(`${environment.apiUrl}${this._url}/${id}`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
    public transfer(transfer: Transfer):  Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._jwHttp
            .post(`${environment.apiUrl}${this._url}`, transfer, options)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
