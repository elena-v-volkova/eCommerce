import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Car,
  Filter,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Slider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Divider,
  Pagination,
} from '@heroui/react';

import { useRetroCarCategories } from '../module/useCategory';
import { ProductsSimpleNew } from '../action/buildProduckts';
import { useProductsNew } from '../module/useProducts';

import { SkeletonSidebar } from './SkeletonSidebar';
import ProductCard from './ProductCard';

interface FiltersState {
  priceRange: [number, number];
  brands: string[];
  years: [number, number];
  transmission: string;
  condition: string;
}

const Catalog = () => {
  const { products, isLoading } = useProductsNew();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { categories, isLoading: isLoadingCategories } =
    useRetroCarCategories();

  const [filteredProducts, setFilteredProducts] = useState<
    ProductsSimpleNew[] | []
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 500000],
    brands: [],
    years: [1950, 2000],
    transmission: '',
    condition: '',
  });
  const [viewMode, setViewMode] = useState('grid');

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, filters, sortBy, sortOrder]);

  const uniqueBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand))].filter(Boolean).sort();
  }, [products]);

  const uniqueConditions = useMemo(() => {
    return [...new Set(products.map((p) => p.condition))]
      .filter(Boolean)
      .sort();
  }, [products]);

  // Применение фильтров и поиска
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);

      return;
    }

    let result = [...products];

    // Поиск
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Фильтр по категории - используем мапу ID->key для сопоставления
    if (selectedCategory) {
      result = result.filter((product) =>
        product.categories.includes(selectedCategory),
      );
    }

    // Фильтр по цене
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1],
    );

    // Фильтр по брендам
    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand),
      );
    }

    // Фильтр по годам
    result = result.filter(
      (product) =>
        product.year >= filters.years[0] && product.year <= filters.years[1],
    );

    // Фильтр по трансмиссии
    if (filters.transmission) {
      result = result.filter(
        (product) => product.transmission === filters.transmission,
      );
    }

    // Фильтр по состоянию
    if (filters.condition) {
      result = result.filter(
        (product) => product.condition === filters.condition,
      );
    }

    // Сортировка
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, filters, sortBy, sortOrder, products]);

  const handleProductClick = (product: ProductsSimpleNew) => {
    alert(
      `Переход на страницу продукта: ${product.name}\nURL: /products/${product.slug}`,
    );
  };

  const handleBrandFilter = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 500000],
      brands: [],
      years: [1950, 2000],
      transmission: '',
      condition: '',
    });
    setSelectedCategory('');
    setSearchQuery('');
  };

  // Компонент фильтров для переиспользования
  const FiltersContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-6 ">
      {/* Mobile header */}
      {onClose && (
        <div className="flex items-center justify-between border-b border-divider pb-4">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <Button isIconOnly variant="light" onPress={onClose} />
        </div>
      )}
      {/* Categories */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Categories</h3>
        <div className="space-y-1">
          <Button
            fullWidth
            className={`px-3 py-2 text-left text-foreground ${
              !selectedCategory
                ? 'bg-primary/20 font-medium text-primary'
                : 'hover:bg-default-100'
            }`}
            variant="light"
            onClick={() => setSelectedCategory('')}
          >
            All Categories
          </Button>

          <Divider className="my-2" />

          <div className="space-y-1">
            {categories
              .filter((cat) => !cat.parent)
              .map((category) => (
                <div key={category.key} className="space-y-1">
                  <Button
                    fullWidth
                    className={`px-3 py-2 text-left text-foreground ${
                      selectedCategory === category.id
                        ? 'bg-primary/20 font-medium text-primary'
                        : 'hover:bg-default-100'
                    }`}
                    variant="light"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>

                  {/* Subcategories */}
                  <div className="ml-4 space-y-1 border-l border-divider pl-2">
                    {categories
                      .filter((subcat) => subcat.parent === category.key)
                      .map((subcategory) => (
                        <Button
                          key={subcategory.key}
                          fullWidth
                          className={`px-3 py-1.5 text-left text-sm text-foreground ${
                            selectedCategory === subcategory.id
                              ? 'bg-primary/20 font-medium text-primary'
                              : 'hover:bg-default-100'
                          }`}
                          size="sm"
                          variant="light"
                          onClick={() => setSelectedCategory(subcategory.id)}
                        >
                          {subcategory.name}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      Ключевые
      {/* Price Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Price Range</h3>
        <div className="space-y-2">
          <Slider
            className="w-full"
            formatOptions={{
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }}
            maxValue={500000}
            minValue={0}
            size="sm"
            step={10000}
            value={filters.priceRange}
            onChange={(value) => {
              const priceRange = Array.isArray(value)
                ? (value as [number, number])
                : ([value, value] as [number, number]);

              setFilters((prev) => ({ ...prev, priceRange }));
            }}
          />
          <div className="flex justify-between text-sm text-foreground-500">
            <span>${filters.priceRange[0].toLocaleString()}</span>
            <span>${filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
      {/* Brand Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Brands</h3>
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {uniqueBrands.map((brand) => (
            <Checkbox
              key={brand}
              isSelected={filters.brands.includes(brand)}
              size="sm"
              onValueChange={() => handleBrandFilter(brand)}
            >
              {brand}
            </Checkbox>
          ))}
        </div>
      </div>
      {/* Condition Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Condition</h3>
        <Select
          placeholder="All Conditions"
          selectedKeys={filters.condition ? [filters.condition] : []}
          size="sm"
          onSelectionChange={(keys) => {
            const value = (Array.from(keys)[0] as string) || '';

            setFilters((prev) => ({ ...prev, condition: value }));
          }}
        >
          {uniqueConditions.map((condition) => (
            <SelectItem key={condition}>{condition}</SelectItem>
          ))}
        </Select>
      </div>
      <Button
        className="w-full"
        color="warning"
        variant="flat"
        onPress={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  if (isLoading || isLoadingCategories) {
    return <SkeletonSidebar />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-divider bg-content1 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="mb-4 text-3xl font-bold text-foreground">
            Classic Cars Catalog
          </h1>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <Input
              className="max-w-md"
              placeholder="Search cars, brands, or descriptions..."
              size="lg"
              startContent={<Search className="size-4 text-foreground-400" />}
              type="text"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />

            {/* Mobile Filter Button */}
            <Button
              className="md:hidden"
              color="primary"
              startContent={<Filter className="size-4" />}
              variant="flat"
              onPress={onOpen}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar - Filters */}
          <div className="hidden w-64 shrink-0 md:block">
            <FiltersContent />
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-divider bg-content1 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground-600">
                  {filteredProducts.length} cars found
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-600">Sort by:</span>
                  <Select
                    className="w-32"
                    selectedKeys={[sortBy]}
                    size="sm"
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];

                      if (typeof selectedKey === 'string') {
                        setSortBy(selectedKey);
                      }
                    }}
                  >
                    <SelectItem key="name">Name</SelectItem>
                    <SelectItem key="price">Price</SelectItem>
                    <SelectItem key="year">Year</SelectItem>
                  </Select>

                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() =>
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="size-4" />
                    ) : (
                      <SortDesc className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  variant={viewMode === 'grid' ? 'solid' : 'light'}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  variant={viewMode === 'list' ? 'solid' : 'light'}
                  onPress={() => setViewMode('list')}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-divider bg-content1 p-8 text-center shadow-sm">
                <Car className="mx-auto mb-4 size-12 text-foreground-400" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  No cars found
                </h3>
                <p className="text-foreground-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      showControls
                      showShadow
                      classNames={{
                        cursor: 'bg-primary/10 text-primary',
                      }}
                      color="primary"
                      page={currentPage}
                      total={totalPages}
                      onChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        classNames={{
          body: 'py-0',
          backdrop: 'bg-background/50 backdrop-opacity-40',
          base: 'border-none bg-content1 text-foreground',
          header: 'border-b-[1px] border-divider',
          footer: 'border-t-[1px] border-divider',
        }}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="full"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mobile Filters
              </ModalHeader>
              <ModalBody>
                <FiltersContent onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Catalog;
