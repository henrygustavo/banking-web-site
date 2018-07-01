import {BaseEntity} from '../models/base-entity';

export class BankAccount extends BaseEntity {

     number: String;
     balance: number;
     isLocked: boolean;
     customerFullName: String;
     customerId: number;
     customerDni: number;
}
