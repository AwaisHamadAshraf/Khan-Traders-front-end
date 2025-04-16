// Base model interface
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory related types
export interface Product extends BaseModel {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  categoryName?: string;
  supplierId?: string;
  supplierName?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  unit: string;
  location?: string;
  status: 'active' | 'inactive' | 'discontinued';
  expiryDate?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Supplier extends BaseModel {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

// Transaction types
export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  date: string;
  referenceNumber?: string;
  notes?: string;
}

// Filter types moved to filters.ts

// Billing related types
export interface Customer extends BaseModel {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  paymentTerms?: string;
  creditLimit?: number;
  outstandingBalance?: number;
  notes?: string;
  status: 'active' | 'inactive';
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice extends BaseModel {
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string;
}

export interface Payment extends BaseModel {
  invoiceId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
}

// Filter types moved to filters.ts

// Dashboard types
export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalCustomers: number;
  totalSales: number;
  totalInvoices: number;
  lowStockItems: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  lastLogin: string;
} 