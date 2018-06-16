import {BaseEntity} from '../models/base-entity';

export class BankAccount extends BaseEntity {

    private number: String;
    private balance: number;
    private isLocked: boolean;
    private customerName: String;
}
