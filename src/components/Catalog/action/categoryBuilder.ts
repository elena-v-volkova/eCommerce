import { Category } from '@commercetools/platform-sdk';
export type CategoryNode = {
  id: string;
  name: string;
  parent: string | null;
  children: CategoryNode[];
};

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();

  // Шаг 1: Создаем карту категорий по id
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name['en-US'], // можно адаптировать под i18n
      parent: category.parent?.id || null,
      children: [],
    });
  });

  const tree: CategoryNode[] = [];

  // Шаг 2: Собираем дерево
  categoryMap.forEach((category) => {
    if (category.parent) {
      const parent = categoryMap.get(category.parent);

      if (parent) {
        parent.children.push(category);
      }
    } else {
      tree.push(category); // корневые категории
    }
  });

  return tree;
}
