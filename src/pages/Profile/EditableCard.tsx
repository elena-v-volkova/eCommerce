import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';

interface EditableCardProps {
  onestate?: boolean;
  editmode?: boolean;
  title: string;
  headerChildren?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onEdit?: () => void;
  onSave?: () => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function EditableCard({
  onestate = false,
  editmode = false,
  title,
  headerChildren = null,
  children,
  className = '',
  onEdit,
  onSave,
  onCancel,
  isLoading = false,
}: EditableCardProps): JSX.Element {
  const [mode, setMode] = useState(editmode);

  const handleEdit = () => {
    if (!onestate) setMode(true);
    onEdit?.();
  };

  const handleSave = () => {
    onSave?.();
    if (!onestate) setMode(false);
  };

  const handleCancel = () => {
    if (!onestate) setMode(false);
    onCancel?.();
  };

  return (
    <form onReset={onCancel} onSubmit={onSave}>
      <Card className={`${className}`}>
        <CardHeader className="flex h-8 flex-row justify-between">
          <h4 className="text-large font-medium text-teal-600">{title}</h4>
          {headerChildren !== null && headerChildren}
        </CardHeader>

        <CardBody className="overflow-visible p-0">{children}</CardBody>

        <CardFooter className="relative top-[10px] justify-start gap-x-4 border-t-1 border-zinc-100/50 bg-white/30 dark:bg-black/30">
          {!mode && (
            <Button
              className="text-tiny"
              color="primary"
              radius="full"
              size="sm"
              type="button"
              onClick={handleEdit}
            >
              Edit
            </Button>
          )}

          {mode && (
            <div className="flex gap-2">
              <Button
                className="text-tiny"
                color="warning"
                isDisabled={isLoading}
                isLoading={isLoading}
                radius="full"
                size="sm"
                type="submit"
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                className="text-tiny"
                color="default"
                isDisabled={isLoading}
                radius="full"
                size="sm"
                type="reset"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
