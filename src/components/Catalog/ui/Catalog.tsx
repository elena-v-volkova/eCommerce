import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Car,
  Filter,
  Loader2,
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
import {
  ProductsSimpleNew,
  useProductSearch,
} from '../module/useProductSearch';

import { SkeletonSidebar } from './SkeletonSidebar';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router';

interface FiltersState {
  priceRange: [number, number];
  brands: string[];
  years: [number, number];
  transmission: string;
  condition: string;
}

const DEFAULT_FILTERS: FiltersState = {
  priceRange: [0, 500000],
  brands: [],
  years: [1950, 2000],
  transmission: '',
  condition: '',
};

const ITEMS_PER_PAGE = 6;

const Catalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState('grid');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { categories, isLoading: isLoadingCategories } =
    useRetroCarCategories();
  const {
    products,
    isLoading,
    error,
    filterOptions,
    loadFilterOptions,
    searchProducts,
    immediateSearch,
  } = useProductSearch();

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(products.length / ITEMS_PER_PAGE);
  }, [products.length]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  console.log(products);

  const navigate = useNavigate();
  const handleProductClick = useCallback(
    (product: ProductsSimpleNew) => {
      const slug =
        typeof product.slug === 'string'
          ? product.slug
          : Object.values(product.slug)[0];

      navigate(`/products/${slug}`);
    },
    [navigate],
  );

  const handleBrandFilter = useCallback((brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSelectedCategory('');
    setSearchQuery('');
  }, []);

  const handleSortChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0];

    if (typeof selectedKey === 'string') {
      setSortBy(selectedKey);
    }
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleConditionChange = useCallback((keys: any) => {
    const value = (Array.from(keys)[0] as string) || '';

    setFilters((prev) => ({ ...prev, condition: value }));
  }, []);

  const handlePriceRangeChange = useCallback((value: number | number[]) => {
    const priceRange = Array.isArray(value)
      ? (value as [number, number])
      : ([value, value] as [number, number]);

    setFilters((prev) => ({ ...prev, priceRange }));
  }, []);

  // Effects
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, filters, sortBy, sortOrder]);

  useEffect(() => {
    loadFilterOptions();
    immediateSearch({
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }, []);

  useEffect(() => {
    const searchParams = {
      query: searchQuery,
      categoryId: selectedCategory,
      priceRange: filters.priceRange,
      brands: filters.brands,
      years: filters.years,
      transmission: filters.transmission,
      condition: filters.condition,
      sortBy,
      sortOrder,
    };

    if (searchQuery?.trim()) {
      searchProducts(searchParams, 500);
    } else {
      immediateSearch(searchParams);
    }
  }, [
    searchQuery,
    selectedCategory,
    filters.priceRange,
    filters.brands,
    filters.years,
    filters.transmission,
    filters.condition,
    sortBy,
    sortOrder,
  ]);

  const FiltersContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between border-b border-divider pb-4">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <Button
            isIconOnly
            aria-label="Close filters"
            variant="light"
            onPress={onClose}
          />
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

      {/* Price Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Price Range</h3>
        <div className="space-y-2">
          <Slider
            aria-label="Select price range"
            className="w-full"
            formatOptions={{
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }}
            label="Price Range"
            maxValue={500000}
            minValue={0}
            size="sm"
            step={10000}
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
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
          {filterOptions.brands.map((brand) => (
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

      {/* Year Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Year Range</h3>
        <div className="space-y-2">
          <Slider
            aria-label="Select year range"
            className="w-full"
            label="Year Range"
            maxValue={2000}
            minValue={1950}
            size="sm"
            step={5}
            value={filters.years}
            onChange={(value) => {
              const yearRange = Array.isArray(value)
                ? (value as [number, number])
                : ([value, value] as [number, number]);

              setFilters((prev) => ({ ...prev, years: yearRange }));
            }}
          />
          <div className="flex justify-between text-sm text-foreground-500">
            <span>{filters.years[0]}</span>
            <span>{filters.years[1]}</span>
          </div>
        </div>
      </div>

      {/* Condition Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Condition</h3>
        <Select
          aria-label="Select vehicle condition"
          label="Vehicle Condition"
          placeholder="All Conditions"
          selectedKeys={filters.condition ? [filters.condition] : []}
          size="sm"
          onSelectionChange={handleConditionChange}
        >
          {filterOptions.conditions.map((condition) => (
            <SelectItem key={condition}>{condition}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Transmission Filter */}
      <div className="rounded-lg border border-divider bg-content1 p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Transmission</h3>
        <Select
          aria-label="Select transmission type"
          label="Transmission Type"
          placeholder="All Transmissions"
          selectedKeys={filters.transmission ? [filters.transmission] : []}
          size="sm"
          onSelectionChange={(keys) => {
            const value = (Array.from(keys)[0] as string) || '';

            setFilters((prev) => ({ ...prev, transmission: value }));
          }}
        >
          {filterOptions.transmissions.map((transmission) => (
            <SelectItem key={transmission}>{transmission}</SelectItem>
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

  if (isLoadingCategories) {
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
            <div className="relative max-w-md flex-1">
              <Input
                aria-label="Search for cars, brands, or descriptions"
                className="w-full"
                label="Search"
                placeholder="Search cars, brands, or descriptions..."
                size="lg"
                startContent={
                  isLoading ? (
                    <Loader2 className="size-4 animate-spin text-foreground-400" />
                  ) : (
                    <Search className="size-4 text-foreground-400" />
                  )
                }
                type="text"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>

            {/* Mobile Filter Button */}
            <Button
              aria-label="Open filters"
              className="md:hidden"
              color="primary"
              startContent={<Filter className="size-4" />}
              variant="flat"
              onPress={onOpen}
            >
              Filters
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-danger bg-danger-50 p-3 text-danger">
              <p className="text-sm">{error}</p>
            </div>
          )}
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
                  {products.length} cars found
                  {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-600">Sort by:</span>
                  <Select
                    aria-label="Select sorting option"
                    className="w-32"
                    label="Sort By"
                    selectedKeys={[sortBy]}
                    size="sm"
                    onSelectionChange={handleSortChange}
                  >
                    <SelectItem key="name">Name</SelectItem>
                    <SelectItem key="price">Price</SelectItem>
                    <SelectItem key="year">Year</SelectItem>
                  </Select>

                  <Button
                    isIconOnly
                    aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                    variant="light"
                    onPress={toggleSortOrder}
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
                  aria-label="Grid view"
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  variant={viewMode === 'grid' ? 'solid' : 'light'}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  aria-label="List view"
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  variant={viewMode === 'list' ? 'solid' : 'light'}
                  onPress={() => setViewMode('list')}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="rounded-lg border border-divider bg-content1 p-8 text-center shadow-sm">
                <Loader2 className="mx-auto mb-4 size-12 animate-spin text-foreground-400" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Searching cars...
                </h3>
                <p className="text-foreground-600">
                  Please wait while we find the best matches
                </p>
              </div>
            ) : products.length === 0 ? (
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
                      aria-label="Pagination navigation"
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
