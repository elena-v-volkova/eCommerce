import { Listbox, ListboxItem } from '@heroui/react';

export function Selectors({
  onAction,
}: {
  onAction: (key: React.Key) => void;
}) {
  return (
    <div className="  w-[180px] h-fit rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100">
      <Listbox
        disallowEmptySelection
        aria-label="Profile sections menu"
        selectionMode="single"
        variant="flat"
        onAction={onAction}
      >
        <ListboxItem key="personal">Personal Info</ListboxItem>
        <ListboxItem key="addresses">Addresses</ListboxItem>
        <ListboxItem key="password" showDivider>
          Change password
        </ListboxItem>
        <ListboxItem key="logout" className="text-danger" color="warning">
          Logout
        </ListboxItem>
      </Listbox>
    </div>
  );
}
