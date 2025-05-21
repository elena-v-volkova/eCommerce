export type MyCustomerDraft = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: BaseAddress[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
};
export type BaseAddress = {
  firstName: string;
  lastName: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
};

export interface ResponseError {
  message: string;
  statusCode?: number;
}
