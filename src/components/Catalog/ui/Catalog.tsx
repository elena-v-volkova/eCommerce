import { ProductList } from './ProductList/ProductList';
import { Sidebar } from './Sidebar/Sidebar';

export const Catalog = () => {
  return (
    <div className="flex">
      <div className="col-span-2 h-full">
        <Sidebar />
      </div>

      <ProductList />
    </div>
  );
};
