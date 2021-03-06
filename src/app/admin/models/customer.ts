import { BaseEntity } from '../models/base-entity';

export class Customer extends BaseEntity {

    dni: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    fullName: string;
    active: boolean;
}
