export const ITEMS_PER_PAGE = 12;
export const DEFAULT_MAX_PRICE = 150000;
export const DEFAULT_MIN_PRICE = 0;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
] as const;

export const filterDefaults = {
  searchQuery: "",
  selectedBrand: null as number | null,
  minPrice: DEFAULT_MIN_PRICE,
  maxPrice: DEFAULT_MAX_PRICE,
  sortBy: "featured" as const,
};