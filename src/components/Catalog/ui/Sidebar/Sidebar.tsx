import { Card } from '@heroui/react';

import useCategoryList from '../../module/useCategoryList';
import { SkeletonSidebar } from '../SkeletonSidebar';
import { CategoryItem } from '../CategoryItem';

export const Sidebar = () => {
  const { categoryList, isLoading, error } = useCategoryList();

  if (error) {
    return <p>Category list not available.</p>;
  }

  if (isLoading) {
    return <SkeletonSidebar />;
  }

  if (!categoryList) {
    return <p>No categories found.</p>;
  }

  return (
    <Card className="rounded-2xl border p-4">
      <ul>
        {categoryList[0]?.children.map((node) => (
          <CategoryItem key={node.id} node={node} />
        ))}
      </ul>
    </Card>
  );
};
