import { BaseEntity } from './base-entity';

export class Transfer extends BaseEntity {

    number: string;
    balance: number;
    fromAccountNumber: string;
    toAccountNumber: string;
    amount: number;
}
