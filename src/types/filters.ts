// Update the filters.ts file to include CustomerFilterType

// Define the structure for range-based filters
export interface RangeFilter<T> {
  min?: T;
  max?: T;
}

// Define the structure for date range filters
export interface DateRange {
  from?: string;
  to?: string;
}

// Define the inventory filter type
export interface InventoryFilterType {
  searchTerm: string;
  categoryId?: string;
  supplierId?: string;
  stock: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  priceRange?: RangeFilter<number>;
}

// Define the billing filter type
export interface BillingFilterType {
  searchTerm: string;
  customerId?: string;
  status?: string;
  dateRange: DateRange;
}

// Define the customer filter type
export interface CustomerFilterType {
  searchTerm: string;
  status?: string;
  balanceRange?: RangeFilter<number>;
}

// Define the default inventory filter
export const defaultInventoryFilter: InventoryFilterType = {
  searchTerm: '',
  stock: 'all',
};

// Define the default billing filter
export const defaultBillingFilter: BillingFilterType = {
  searchTerm: '',
  dateRange: {},
};

// Define the default customer filter
export const defaultCustomerFilter: CustomerFilterType = {
  searchTerm: '',
}; 