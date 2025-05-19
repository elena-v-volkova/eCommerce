import { Breadcrumbs, BreadcrumbItem, Divider } from '@heroui/react';
import { useState } from 'react';

import { useWindowWidth } from '@/shared/utils/utils';
import { RegisterForm } from '@/components/RegisterForm/ui/RegisterForm';

type registerStep = 'user' | 'shipping' | 'billing';

function Register() {
  const width = useWindowWidth();
  const isNarrow = width <= 734;

  const [currentStep, setCurrentStep] = useState<registerStep>('user');
  const [onSameChecked, setOnSameChecked] = useState(true);

  return (
    <>
      {isNarrow && (
        <NavFields
          currentStep={currentStep}
          sameAsDelivery={onSameChecked}
          onStepChange={setCurrentStep}
        />
      )}
      <RegisterForm
        step={isNarrow ? currentStep : null}
        onDeliveryChange={setOnSameChecked}
      />
    </>
  );
}

export function NavFields({
  currentStep,
  onStepChange,
  sameAsDelivery,
}: {
  currentStep: string;
  onStepChange: (key: registerStep) => void;
  sameAsDelivery: boolean;
}) {
  return (
    <>
      <Breadcrumbs
        color={'primary'}
        size={'lg'}
        underline={'hover'}
        onAction={(key) => onStepChange(key as registerStep)}
      >
        <BreadcrumbItem key="user" isCurrent={currentStep === 'user'}>
          User Data
        </BreadcrumbItem>
        <BreadcrumbItem key="shipping" isCurrent={currentStep === 'shipping'}>
          Shipping Address
        </BreadcrumbItem>
        {!sameAsDelivery && (
          <BreadcrumbItem key="billing" isCurrent={currentStep === 'billing'}>
            Billing Address
          </BreadcrumbItem>
        )}
      </Breadcrumbs>
      <Divider className="my-4" />
    </>
  );
}

export default Register;
