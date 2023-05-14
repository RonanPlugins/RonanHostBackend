export class StripeEventDto {
  id: string;
  type: string;
  data: {
    object: any;
  };
}
