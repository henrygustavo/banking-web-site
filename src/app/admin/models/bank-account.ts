import {BaseEntity} from '../models/base-entity';

export class BankAccount extends BaseEntity {

     number: String;
     balance: number;
     isLocked: boolean;
     customerName: String;
     customerId: number;
}
