import {BaseEntity} from '../models/base-entity';

export class BankAccount extends BaseEntity {

     number: string;
     balance: number;
     isLocked: boolean;
     customerFullName: string;
     customerId: number;
     customerDni: string;
}
