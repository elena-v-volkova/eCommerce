import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { ReactNode, useState } from 'react';

interface ConfirmPopoverProps {
  triggerButton: ReactNode;
  action: () => Promise<void>;
  isLoading?: boolean;
}

export const PopoverCart = ({
  triggerButton,
  action,
  isLoading = false,
}: ConfirmPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await action();
    setIsOpen(false);
  };

  return (
    <Popover
      backdrop="opaque"
      isOpen={isOpen}
      placement="top"
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger>{triggerButton}</PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">
            <p className="my-1">Are you sure?</p>
          </div>
          <Button
            isIconOnly
            className="mx-1 text-small font-bold"
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            Yes
          </Button>
          <Button
            isIconOnly
            className="mx-1 text-small font-bold"
            onClick={() => setIsOpen(false)}
          >
            No
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
