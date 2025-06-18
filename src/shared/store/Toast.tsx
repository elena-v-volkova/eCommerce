import { addToast, cn } from '@heroui/react';
import { X } from 'lucide-react';

export function notifyToast(msg: string, timeout = 5000) {
  addToast({
    title: msg,
    // description: msg,
    timeout: timeout,
    classNames: {
      base: cn([
        'bg-default-50 dark:bg-background shadow-sm',
        'border  rounded-md ',
        'flex flex-col items-start',
        'border-primary-200 dark:border-primary-100 ',
      ]),
      icon: 'w-6 h-6 fill-current',
      closeButton: 'opacity-100 absolute right-4 top-1/2 -translate-y-1/2',
    },
    color: 'success',
    closeIcon: <X size={20} strokeWidth={3} />,
  });
}
