import { v4 as uuidv4 } from 'uuid';
export const v4 = () => uuidv4();
export const validateUUID = (value) => {
    return typeof value === 'string' && /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(value);
};
