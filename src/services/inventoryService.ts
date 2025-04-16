import { 
  Product, 
  Category, 
  Supplier, 
  InventoryTransaction,
} from '../types/models';
import { InventoryFilterType } from '../types/filters';

// Mock data for the inventory module
const categories: Category[] = [
  { id: '1', name: 'Insecticides', description: 'Pest control chemicals' },
  { id: '2', name: 'Fungicides', description: 'Chemicals to control fungal infections' },
  { id: '3', name: 'Herbicides', description: 'Weed control chemicals' },
  { id: '4', name: 'Fertilizers', description: 'Plant nutrients' },
  { id: '5', name: 'Seeds', description: 'Agricultural seeds' },
];

const suppliers: Supplier[] = [
  { 
    id: '1', 
    name: 'Punjab Pesticides',
    contactPerson: 'Ali Khan',
    phone: '0300-1234567',
    email: 'info@punjabpesticides.com',
    address: 'Industrial Area, Lahore',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  { 
    id: '2', 
    name: 'Agro Chemicals Ltd',
    contactPerson: 'Muhammad Ahmed',
    phone: '0321-7654321',
    email: 'contact@agrochemicals.com',
    address: 'Main Boulevard, Faisalabad',
    createdAt: '2022-02-15T00:00:00.000Z',
    updatedAt: '2022-02-15T00:00:00.000Z',
  },
  { 
    id: '3', 
    name: 'Green Fertilizers',
    contactPerson: 'Fatima Ali',
    phone: '0333-1122334',
    email: 'info@greenfertilizers.com',
    address: 'Korangi Industrial Area, Karachi',
    createdAt: '2022-03-20T00:00:00.000Z',
    updatedAt: '2022-03-20T00:00:00.000Z',
  },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Pestex 500EC',
    description: 'Broad-spectrum insecticide for various crops',
    sku: 'PST-500EC',
    barcode: '8901234567890',
    categoryId: '1',
    supplierId: '1',
    costPrice: 1200,
    sellingPrice: 1500,
    quantity: 150,
    minStockLevel: 30,
    unit: 'Liter',
    location: 'Shelf A1',
    status: 'active',
    createdAt: '2023-01-10T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Fungikill Pro',
    description: 'Systemic fungicide for powdery mildew control',
    sku: 'FNG-PRO',
    barcode: '8901234567891',
    categoryId: '2',
    supplierId: '2',
    costPrice: 900,
    sellingPrice: 1100,
    quantity: 20,
    minStockLevel: 25,
    unit: 'Liter',
    location: 'Shelf B3',
    status: 'active',
    createdAt: '2023-02-05T00:00:00.000Z',
    updatedAt: '2023-04-20T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Weed Clear 20%',
    description: 'Selective herbicide for broadleaf weeds',
    sku: 'WC-20P',
    barcode: '8901234567892',
    categoryId: '3',
    supplierId: '1',
    costPrice: 800,
    sellingPrice: 950,
    quantity: 0,
    minStockLevel: 20,
    unit: 'Liter',
    location: 'Shelf C2',
    status: 'active',
    createdAt: '2023-03-15T00:00:00.000Z',
    updatedAt: '2023-04-25T00:00:00.000Z',
  },
];

const inventoryTransactions: InventoryTransaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Pestex 500EC',
    type: 'purchase',
    quantity: 100,
    date: '2023-03-01T00:00:00.000Z',
    referenceNumber: 'PO-2023-001',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Pestex 500EC',
    type: 'sale',
    quantity: -20,
    date: '2023-03-15T00:00:00.000Z',
    referenceNumber: 'INV-2023-001',
  },
  {
    id: '3',
    productId: '2',
    productName: 'Fungikill Pro',
    type: 'purchase',
    quantity: 50,
    date: '2023-03-10T00:00:00.000Z',
    referenceNumber: 'PO-2023-002',
  },
];

// Helper function to find category name by ID
export const getCategoryNameById = (categoryId: string): string => {
  const category = categories.find((cat: Category) => cat.id === categoryId);
  return category ? category.name : 'Uncategorized';
};

// Helper function to find supplier name by ID
export const getSupplierNameById = (supplierId: string): string => {
  const supplier = suppliers.find((sup: Supplier) => sup.id === supplierId);
  return supplier ? supplier.name : 'Unknown Supplier';
};

// Get all products
export const getProducts = (filter?: InventoryFilterType): Product[] => {
  if (!filter) return [...products];
  
  let result = [...products];
  
  // Apply search filter
  if (filter.searchTerm) {
    const searchLower = filter.searchTerm.toLowerCase();
    result = result.filter(
      (product: Product) => 
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply category filter
  if (filter.categoryId) {
    result = result.filter(
      (product: Product) => 
      product.categoryId === filter.categoryId
    );
  }
  
  // Apply supplier filter
  if (filter.supplierId) {
    result = result.filter(
      (product: Product) => 
      product.supplierId === filter.supplierId
    );
  }
  
  // Apply stock status filter
  if (filter.stock && filter.stock !== 'all') {
    switch (filter.stock) {
      case 'in_stock':
        result = result.filter(
          (product: Product) => product.quantity > product.minStockLevel
        );
        break;
      case 'low_stock':
        result = result.filter(
          (product: Product) => product.quantity > 0 && product.quantity <= product.minStockLevel
        );
        break;
      case 'out_of_stock':
        result = result.filter(
          (product: Product) => product.quantity === 0
        );
        break;
    }
  }
  
  // Apply price range filter
  if (filter.priceRange) {
    if (filter.priceRange.min !== undefined) {
      result = result.filter((product: Product) => product.sellingPrice >= filter.priceRange!.min!);
    }
    if (filter.priceRange.max !== undefined) {
      result = result.filter((product: Product) => product.sellingPrice <= filter.priceRange!.max!);
    }
  }
  
  return result;
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find((product: Product) => product.id === id);
};

// Get all categories
export const getCategories = (): Category[] => {
  return [...categories];
};

// Get all suppliers
export const getSuppliers = (): Supplier[] => {
  return [...suppliers];
};

// Get inventory transactions
export const getInventoryTransactions = (productId?: string): InventoryTransaction[] => {
  if (productId) {
    return [...inventoryTransactions].filter((transaction: InventoryTransaction) => transaction.productId === productId);
  }
  return [...inventoryTransactions];
};

// Get low stock items
export const getLowStockItems = (): Product[] => {
  return products.filter(product => 
    product.quantity <= product.minStockLevel
  );
};

// Get out of stock items
export const getOutOfStockItems = (): Product[] => {
  return products.filter(product => 
    product.quantity === 0
  );
};

// Add a new product
export const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  // Generate a new ID (in a real app this would be done by the backend)
  const id = String(Date.now());
  
  // Create timestamps
  const now = new Date().toISOString();
  
  // Enrich the product with category and supplier names if available
  let enrichedProduct = { ...productData };
  
  if (productData.categoryId) {
    const category = categories.find(c => c.id === productData.categoryId);
    if (category) {
      enrichedProduct.categoryName = category.name;
    }
  }
  
  if (productData.supplierId) {
    const supplier = suppliers.find(s => s.id === productData.supplierId);
    if (supplier) {
      enrichedProduct.supplierName = supplier.name;
    }
  }
  
  // Create the new product
  const newProduct: Product = {
    ...enrichedProduct,
    id,
    createdAt: now,
    updatedAt: now
  };
  
  // Add to the products array (in a real app, this would be a backend API call)
  products.push(newProduct);
  
  // Add an initial inventory transaction if product has initial quantity
  if (newProduct.quantity > 0) {
    inventoryTransactions.push({
      id: String(Date.now() + 1),
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'adjustment',
      quantity: newProduct.quantity,
      date: now,
      referenceNumber: `INIT-${newProduct.id}`,
      notes: 'Initial inventory setup'
    });
  }
  
  return newProduct;
};

// Export the products array to allow direct manipulation in other components (for development/demo only)
export { products }; 