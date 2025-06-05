import { Skeleton } from '@heroui/react';

export const SkeletonSidebar = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-3 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-lg" />
    </div>
  );
};
