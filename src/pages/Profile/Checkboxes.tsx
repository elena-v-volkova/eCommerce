import { useState } from 'react';
import { Checkbox } from '@heroui/react';

export function CheckBoxes() {
  const [selected, setSelected] = useState<string[]>([]);
  const [defaultSelected, setDefaultSelected] = useState<string[]>([]);

  const handleMainCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setSelected((prev) => [...prev, value]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== value));
      setDefaultSelected((prev) =>
        prev.filter((item) => item !== `default-${value}`),
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
        >
          Shipping
        </Checkbox>
        {selected.includes('shipping') && (
          <Checkbox
            color="warning"
            isSelected={defaultSelected.includes('default-shipping')}
            onValueChange={(isChecked) =>
              handleDefaultCheckboxChange('default-shipping', isChecked)
            }
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
        >
          Billing
        </Checkbox>
        {selected.includes('billing') && (
          <Checkbox
            color="warning"
            isSelected={defaultSelected.includes('default-billing')}
            onValueChange={(isChecked) =>
              handleDefaultCheckboxChange('default-billing', isChecked)
            }
          >
            Default
          </Checkbox>
        )}
      </div>
    </div>
  );
}
