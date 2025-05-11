import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Form,
} from '@heroui/react';

import styles from './Register.module.scss';

import { COUNTRIES } from '@/shared/store/countries';

export const RegisterForm = () => {
  return (
    <div className={styles.register}>
      <Form
        className="grid grid-cols-2 grid-rows-2 justify-items-center gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="col-start-2 row-start-1 flex flex-col justify-end">
          <h4>New user</h4>
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            type="email"
          />
          <Input
            isRequired
            label="Password"
            labelPlacement="outside"
            name="password"
            type="password"
          />
          <Input
            isRequired
            label="First name"
            labelPlacement="outside"
            name="firstName"
          />
          <Input
            isRequired
            label="Last name"
            labelPlacement="outside"
            name="lastName"
          />
          <DatePicker
            isRequired
            showMonthAndYearPickers
            label="Date of birth"
            labelPlacement="outside"
            name="birth"
          />
        </div>

        <div className=" col-start-1 row-start-1 flex flex-col justify-end">
          <h4 className="mb-2.5">Shipping address</h4>
          <Select isRequired className="py-0" label="Select Country">
            {COUNTRIES.map((country) => (
              <SelectItem key={country}>{country}</SelectItem>
            ))}
          </Select>
          <Input
            isRequired
            label="Enter street"
            labelPlacement="outside"
            name="street"
          />
          <Input
            isRequired
            label="Enter city"
            labelPlacement="outside"
            name="city"
          />
          <Input
            isRequired
            label="Postal code"
            labelPlacement="outside"
            name="postalCode"
          />
          <Input
            isRequired
            label="Country"
            labelPlacement="outside"
            name="country"
          />
        </div>

        <Button
          className="col-span-2 col-start-1 row-start-2"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};
