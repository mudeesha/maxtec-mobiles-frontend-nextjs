export interface AttributeValueDto {
  id: number
  type: string
  value: string
}

export interface ProductVariantDto {
  id: number
  sku: string
  attributes: AttributeValueDto[]
  stockQuantity: number
  price: number
  defaultImageUrl: string | null
  images: string[]
}

export interface ModelListingDto {
  id: number
  name: string
  brandId: number
  brandName: string
  defaultImageUrl: string | null
  minPrice: number
  maxPrice: number
  totalStock: number
  hasStock: boolean
  attributeOptions: Record<string, string[]>
  products: ProductVariantDto[]
}

export interface Brand {
  id: number
  name: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:44306/api";

export const productService = {
  async fetchModels(): Promise<ModelListingDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/CustomerModels/listing`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  },

  extractBrandsFromModels(models: ModelListingDto[]): Brand[] {
    const uniqueBrands: Brand[] = [];
    const brandMap = new Map<number, string>();
    
    models.forEach(model => {
      if (!brandMap.has(model.brandId)) {
        brandMap.set(model.brandId, model.brandName);
        uniqueBrands.push({
          id: model.brandId,
          name: model.brandName
        });
      }
    });
    
    return uniqueBrands;
  },

  calculateMaxPrice(models: ModelListingDto[]): number {
    if (models.length === 0) return 150000;
    const maxPriceInData = Math.max(...models.map(model => model.maxPrice));
    return Math.ceil(maxPriceInData * 1.1);
  },

  getDefaultProduct(model: ModelListingDto): ProductVariantDto | null {
    if (!model.products || model.products.length === 0) return null;
    
    const inStockProduct = model.products.find(p => p.stockQuantity > 0);
    if (inStockProduct) return inStockProduct;
    
    return model.products[0];
  },

  getAttributeSummary(model: ModelListingDto): string {
    const summaries: string[] = [];
    
    Object.entries(model.attributeOptions).forEach(([type, values]) => {
      summaries.push(`${type}: ${values.join("/")}`);
    });
    
    return summaries.join(" | ");
  },

  filterModels(
    models: ModelListingDto[],
    searchQuery: string,
    selectedBrand: number | null,
    minPrice: number,
    maxPrice: number
  ): ModelListingDto[] {
    return models.filter((model) => {
      const modelName = model.name.toLowerCase();
      const brandName = model.brandName.toLowerCase();
      const matchesSearch =
        !searchQuery || 
        modelName.includes(searchQuery.toLowerCase()) || 
        brandName.includes(searchQuery.toLowerCase());
      
      const matchesBrand = !selectedBrand || model.brandId === selectedBrand;
      const matchesPrice = model.minPrice >= minPrice && model.maxPrice <= maxPrice;
      
      return matchesSearch && matchesBrand && matchesPrice;
    });
  },

  sortModels(models: ModelListingDto[], sortBy: string): ModelListingDto[] {
    const filtered = [...models];
    
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.maxPrice - a.maxPrice);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  },


  paginateModels(models: ModelListingDto[], currentPage: number, itemsPerPage: number) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return models.slice(startIndex, endIndex);
  },

  calculateTotalPages(models: ModelListingDto[], itemsPerPage: number): number {
    return Math.ceil(models.length / itemsPerPage);
  }
};