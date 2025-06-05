import { useState } from 'react';
import { Checkbox } from '@heroui/react';
import { UseFormRegister } from 'react-hook-form';

type CheckBoxes = {
  shipping: boolean;
  billing: boolean;
  defaultShipping: boolean;
  defaultBilling: boolean;
};

interface CheckBoxesProps {
  register: UseFormRegister<CheckBoxes>;
}

export function CheckBoxes({ register }: CheckBoxesProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [defaultSelected, setDefaultSelected] = useState<string[]>([]);

  // const shippingValue = watch?.('selected');
  // const billingValue = watch?.('defaultSelected');

  const handleMainCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setSelected((prev) => [...prev, value]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== value));
      setDefaultSelected((prev) =>
        prev.filter((item) => item !== `default${value}`),
      );
    }
  };

  const handleDefaultCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setDefaultSelected((prev) => [...prev, value]);
    } else {
      setDefaultSelected((prev) => prev.filter((item) => item !== value));
    }
  };

  return (
    <div className="relative top-2 flex w-[200px] flex-col gap-3 uppercase">
      <div className="inline-flex w-full justify-between">
        <Checkbox
          color="success"
          isSelected={selected.includes('shipping')}
          radius="full"
          onValueChange={(isChecked) =>
            handleMainCheckboxChange('shipping', isChecked)
          }
          {...register(`shipping`)}
        >
          Shipping
        </Checkbox>
        {selected.includes('shipping') && (
          <Checkbox
            color="warning"
            isSelected={defaultSelected.includes('defaultShipping')}
            onValueChange={(isChecked) =>
              handleDefaultCheckboxChange('defaultShipping', isChecked)
            }
            {...register(`defaultShipping`)}
          >
            Default
          </Checkbox>
        )}
      </div>
      <div className="inline-flex w-full justify-between">
        <Checkbox
          color="success"
          isSelected={selected.includes('billing')}
          radius="full"
          onValueChange={(isChecked) =>
            handleMainCheckboxChange('billing', isChecked)
          }
          {...register(`billing`)}
        >
          Billing
        </Checkbox>
        {selected.includes('billing') && (
          <Checkbox
            color="warning"
            isSelected={defaultSelected.includes('defaultBilling')}
            onValueChange={(isChecked) =>
              handleDefaultCheckboxChange('defaultBilling', isChecked)
            }
            {...register(`defaultBilling`)}
          >
            Default
          </Checkbox>
        )}
      </div>
    </div>
  );
}
