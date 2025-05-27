import { Checkbox } from '@heroui/react';

import { CategoryNode } from '../action/categoryBuilder';

type CategoryItemProps = {
  node: CategoryNode;
};

export const CategoryItem = ({ node }: CategoryItemProps) => {
  const hasChildren = node.children.length > 0;

  return (
    <div>
      {hasChildren ? (
        <span>{node.name}</span>
      ) : (
        <Checkbox>
          <span>{node.name}</span>
        </Checkbox>
      )}

      {hasChildren && (
        <ul className="ml-4 border-l pl-2">
          {node.children.map((child) => (
            <CategoryItem key={child.id} node={child} />
          ))}
        </ul>
      )}
    </div>
  );
};
