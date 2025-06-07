import { useNavigate } from 'react-router-dom';
import { Listbox, ListboxItem } from '@heroui/react';
import React from 'react';

export function Selectors() {
  const navigate = useNavigate();

  const setPath = (key: React.Key) => {
    const location = key.anchorKey;
    const newPath = `/profile/${location}`;

    navigate(newPath);
  };

  return (
    <div className=" h-fit max-w-[180px] rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100">
      <Listbox
        disallowEmptySelection
        aria-label="Profile sections menu"
        selectionMode="single"
        variant="flat"
        onSelectionChange={setPath}
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
