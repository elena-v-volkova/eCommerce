import { useState } from 'react';
import { Pagination } from '@heroui/react';

import CardItem from '../../Card/Card';
import { SkeletonSidebar } from '../SkeletonSidebar';
import { useProducts } from '../../module/useProductList';

export const ProductList = () => {
  const { products, isLoading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil((products?.length || 0) / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <SkeletonSidebar />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        {currentProducts?.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.key} className="mb-4">
              <CardItem product={product} />
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
      {(products?.length || 0) > productsPerPage && (
        <div className="mt-4 flex justify-center">
          <Pagination
            showControls
            showShadow
            color="primary"
            initialPage={1}
            page={currentPage}
            size="lg"
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};
