import { v4 as uuidv4 } from 'uuid';

export type UUID = string & { __uuid: never };

export const v4 = (): UUID => uuidv4() as UUID;

export const validateUUID = (value: unknown): value is UUID => {
    return typeof value === 'string' && /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(value);
};