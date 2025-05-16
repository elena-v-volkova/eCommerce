import { Button } from '@heroui/button';

export function RegisterButton({
  isLoading,
  className,
}: {
  isLoading: boolean;
  className?: string;
}) {
  return (
    <Button
      className={className}
      color="primary"
      isLoading={isLoading}
      type="submit"
    >
      Submit
    </Button>
  );
}
