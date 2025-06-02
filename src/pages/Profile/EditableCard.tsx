import React, { JSX, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';
import { Trash2 } from 'lucide-react';

interface EditableCardProps {
  onestate?: boolean;
  editmode?: boolean;
  title: string;
  headerClass?: string;
  headerChildren?: React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
  onEdit?: (key: any) => void;
  onSave?: (key: any) => Promise<void> | void;
  onDelete?: (key: any) => Promise<void> | void;
  onCancel?: (key: any) => void;
  isLoading?: boolean;
  noErrors: boolean;
  addressEdit: boolean;
}

export function EditableCard({
  onestate = false,
  editmode = false,
  title,
  headerClass,
  headerChildren = null,
  children,
  className = '',
  onEdit,
  onSave,
  onCancel,
  isLoading = false,
  noErrors = true,
  addressEdit,
  onDelete,
}: EditableCardProps): JSX.Element {
  const [mode, setMode] = useState(editmode);

  const handleEdit = () => {
    if (!onestate) setMode(true);
    onEdit?.(mode);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(mode);
    if (!onestate && noErrors) setMode(false);
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onestate) setMode(false);
    onCancel?.(mode);
  };
  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete?.();
    if (!onestate) setMode(false);
  };
  return (
    <form onReset={onCancel} onSubmit={onSave}>
      <Card className={`${className}`}>
        <CardHeader
          className={
            Boolean(headerClass)
              ? `flex ${headerClass} h-8 `
              : 'flex h-8 flex-row content-center justify-between'
          }
        >
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
            <div
              className={
                Boolean(addressEdit)
                  ? 'flex flex-row justify-between w-full'
                  : 'flex gap-[32px]'
              }
            >
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
              {Boolean(addressEdit) && (
                <Button
                  color="danger"
                  radius="full"
                  size="sm"
                  type="reset"
                  isDisabled={isLoading}
                  onClick={handleDelete}
                  endContent={<Trash2 color="#ffffff" absoluteStrokeWidth />}
                />
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
