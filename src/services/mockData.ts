import { Product, Category, Supplier, InventoryTransaction, Customer, Invoice, Payment } from '../types/models';

// Mock Categories
export const categories: Category[] = [
  { id: 'cat1', name: 'Pesticides', description: 'Agricultural pesticides for crop protection' },
  { id: 'cat2', name: 'Herbicides', description: 'Chemicals for weed control' },
  { id: 'cat3', name: 'Fungicides', description: 'Products for controlling fungal diseases' },
  { id: 'cat4', name: 'Growth Promoters', description: 'Products to enhance plant growth' },
  { id: 'cat5', name: 'Fertilizers', description: 'Products to enhance soil fertility' },
  { id: 'cat6', name: 'Seeds', description: 'High-quality agricultural seeds' },
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'AgroChem Solutions',
    contactPerson: 'Ahmed Khan',
    email: 'ahmed@agrochemsolutions.com',
    phone: '+92-300-1234567',
    address: '123 Industrial Area, Lahore',
    notes: 'Reliable supplier with good pricing',
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2023-05-15T12:30:00Z'
  },
  {
    id: 'sup2',
    name: 'FarmTech Innovations',
    contactPerson: 'Zainab Ali',
    email: 'zainab@farmtech.com',
    phone: '+92-321-7654321',
    address: '456 Business Plaza, Karachi',
    notes: 'Specializes in high-quality growth promoters',
    createdAt: '2023-01-05T09:15:00Z',
    updatedAt: '2023-05-12T14:45:00Z'
  },
  {
    id: 'sup3',
    name: 'Green Harvest Inc.',
    contactPerson: 'Imran Shah',
    email: 'imran@greenharvest.com',
    phone: '+92-333-5551234',
    address: '789 Agriculture Zone, Islamabad',
    notes: 'International supplier with premium products',
    createdAt: '2023-01-10T10:30:00Z',
    updatedAt: '2023-05-20T16:20:00Z'
  },
  {
    id: 'sup4',
    name: 'Punjab Agri Supplies',
    contactPerson: 'Fatima Malik',
    email: 'fatima@punjabagri.com',
    phone: '+92-345-9876543',
    address: '234 Rural Market, Faisalabad',
    notes: 'Local supplier with competitive prices',
    createdAt: '2023-01-15T11:45:00Z',
    updatedAt: '2023-05-18T10:10:00Z'
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: 'prod1',
    name: 'SuperGrow Plus',
    description: 'Advanced growth hormone for all crops',
    sku: 'GH-001',
    categoryId: 'cat4',
    categoryName: 'Growth Promoters',
    supplierId: 'sup2',
    supplierName: 'FarmTech Innovations',
    costPrice: 1800,
    sellingPrice: 2500,
    quantity: 45,
    minStockLevel: 10,
    unit: 'bottle',
    location: 'Rack A-1',
    status: 'active',
    expiryDate: '2024-12-31',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['hormone', 'growth', 'premium'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: 'prod2',
    name: 'BugAway Ultra',
    description: 'Powerful pesticide for insect control',
    sku: 'PS-102',
    categoryId: 'cat1',
    categoryName: 'Pesticides',
    supplierId: 'sup1',
    supplierName: 'AgroChem Solutions',
    costPrice: 1200,
    sellingPrice: 1800,
    quantity: 3,
    minStockLevel: 15,
    unit: 'liter',
    location: 'Rack B-3',
    status: 'active',
    expiryDate: '2025-02-28',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['pesticide', 'insect', 'control'],
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-15T11:45:00Z'
  },
  {
    id: 'prod3',
    name: 'WeedClear Pro',
    description: 'Effective herbicide for all weed types',
    sku: 'HB-078',
    categoryId: 'cat2',
    categoryName: 'Herbicides',
    supplierId: 'sup3',
    supplierName: 'Green Harvest Inc.',
    costPrice: 950,
    sellingPrice: 1500,
    quantity: 0,
    minStockLevel: 8,
    unit: 'liter',
    location: 'Rack C-2',
    status: 'active',
    expiryDate: '2024-10-15',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['herbicide', 'weed', 'control'],
    createdAt: '2023-03-05T10:30:00Z',
    updatedAt: '2023-06-10T15:20:00Z'
  },
  {
    id: 'prod4',
    name: 'FungiShield',
    description: 'Protection against fungal diseases',
    sku: 'FG-045',
    categoryId: 'cat3',
    categoryName: 'Fungicides',
    supplierId: 'sup1',
    supplierName: 'AgroChem Solutions',
    costPrice: 1600,
    sellingPrice: 2200,
    quantity: 25,
    minStockLevel: 12,
    unit: 'kg',
    location: 'Rack B-1',
    status: 'active',
    expiryDate: '2025-04-30',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['fungicide', 'disease', 'protection'],
    createdAt: '2023-01-20T11:45:00Z',
    updatedAt: '2023-06-05T13:10:00Z'
  },
  {
    id: 'prod5',
    name: 'SoilBoost Premium',
    description: 'Enhanced soil nutrition for all crops',
    sku: 'FR-056',
    categoryId: 'cat5',
    categoryName: 'Fertilizers',
    supplierId: 'sup4',
    supplierName: 'Punjab Agri Supplies',
    costPrice: 750,
    sellingPrice: 1200,
    quantity: 60,
    minStockLevel: 20,
    unit: 'kg',
    location: 'Rack D-4',
    status: 'active',
    expiryDate: '2025-06-30',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['fertilizer', 'soil', 'nutrition'],
    createdAt: '2023-04-12T12:00:00Z',
    updatedAt: '2023-06-01T09:30:00Z'
  },
  {
    id: 'prod6',
    name: 'Wheat Seeds Elite',
    description: 'High-yield premium wheat seeds',
    sku: 'SD-123',
    categoryId: 'cat6',
    categoryName: 'Seeds',
    supplierId: 'sup2',
    supplierName: 'FarmTech Innovations',
    costPrice: 2800,
    sellingPrice: 3500,
    quantity: 18,
    minStockLevel: 10,
    unit: 'kg',
    location: 'Rack E-1',
    status: 'active',
    expiryDate: '2023-12-31',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['seeds', 'wheat', 'high-yield'],
    createdAt: '2023-05-05T13:15:00Z',
    updatedAt: '2023-06-25T10:55:00Z'
  },
  {
    id: 'prod7',
    name: 'CropGuard Total',
    description: 'Complete protection system for crops',
    sku: 'PS-255',
    categoryId: 'cat1',
    categoryName: 'Pesticides',
    supplierId: 'sup3',
    supplierName: 'Green Harvest Inc.',
    costPrice: 2500,
    sellingPrice: 3200,
    quantity: 12,
    minStockLevel: 8,
    unit: 'set',
    location: 'Rack A-4',
    status: 'active',
    expiryDate: '2025-01-15',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['protection', 'system', 'combo'],
    createdAt: '2023-03-18T14:30:00Z',
    updatedAt: '2023-06-22T16:40:00Z'
  },
  {
    id: 'prod8',
    name: 'Rice Seeds Pro',
    description: 'Disease-resistant rice seeds',
    sku: 'SD-147',
    categoryId: 'cat6',
    categoryName: 'Seeds',
    supplierId: 'sup4',
    supplierName: 'Punjab Agri Supplies',
    costPrice: 2000,
    sellingPrice: 2800,
    quantity: 30,
    minStockLevel: 15,
    unit: 'kg',
    location: 'Rack E-2',
    status: 'active',
    expiryDate: '2024-06-30',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['seeds', 'rice', 'resistant'],
    createdAt: '2023-05-22T15:45:00Z',
    updatedAt: '2023-06-28T11:25:00Z'
  },
];

// Mock Inventory Transactions
export const inventoryTransactions: InventoryTransaction[] = [
  {
    id: 'trans1',
    productId: 'prod1',
    productName: 'SuperGrow Plus',
    type: 'purchase',
    quantity: 50,
    date: '2023-06-01',
    referenceNumber: 'PO-2023-001',
    notes: 'Regular monthly stock replenishment'
  },
  {
    id: 'trans2',
    productId: 'prod2',
    productName: 'BugAway Ultra',
    type: 'sale',
    quantity: 12,
    date: '2023-06-05',
    referenceNumber: 'SO-2023-015',
    notes: 'Sold to Ahmed Farms'
  },
  {
    id: 'trans3',
    productId: 'prod4',
    productName: 'FungiShield',
    type: 'purchase',
    quantity: 30,
    date: '2023-06-10',
    referenceNumber: 'PO-2023-002',
    notes: 'Special order for new product'
  },
  {
    id: 'trans4',
    productId: 'prod3',
    productName: 'WeedClear Pro',
    type: 'sale',
    quantity: 25,
    date: '2023-06-12',
    referenceNumber: 'SO-2023-018',
    notes: 'Bulk order for Rahman Agriculture'
  },
  {
    id: 'trans5',
    productId: 'prod5',
    productName: 'SoilBoost Premium',
    type: 'adjustment',
    quantity: -5,
    date: '2023-06-15',
    referenceNumber: 'ADJ-2023-001',
    notes: 'Inventory count adjustment'
  },
  {
    id: 'trans6',
    productId: 'prod1',
    productName: 'SuperGrow Plus',
    type: 'sale',
    quantity: 8,
    date: '2023-06-18',
    referenceNumber: 'SO-2023-022',
    notes: 'Sold to Malik Croppers'
  },
  {
    id: 'trans7',
    productId: 'prod7',
    productName: 'CropGuard Total',
    type: 'purchase',
    quantity: 15,
    date: '2023-06-20',
    referenceNumber: 'PO-2023-003',
    notes: 'New batch with improved formula'
  },
  {
    id: 'trans8',
    productId: 'prod2',
    productName: 'BugAway Ultra',
    type: 'return',
    quantity: 3,
    date: '2023-06-25',
    referenceNumber: 'RET-2023-002',
    notes: 'Customer return due to damaged packaging'
  }
];

// Mock Customers
export const customers: Customer[] = [
  {
    id: 'cust1',
    name: 'Ahmed Farms',
    contactPerson: 'Ahmed Khan',
    email: 'ahmed@ahmedfarms.com',
    phone: '+92-300-1112233',
    address: '123 Rural Road, Lahore',
    creditLimit: 100000,
    outstandingBalance: 15000,
    notes: 'Large farm with consistent orders',
    status: 'active',
    createdAt: '2023-01-05T09:00:00Z',
    updatedAt: '2023-06-15T13:30:00Z'
  },
  {
    id: 'cust2',
    name: 'Rahman Agriculture',
    contactPerson: 'Abdul Rahman',
    email: 'rahman@rahmanag.com',
    phone: '+92-321-4445566',
    address: '456 Field Avenue, Multan',
    creditLimit: 75000,
    outstandingBalance: 25000,
    notes: 'Medium-sized farm, pays on time',
    status: 'active',
    createdAt: '2023-01-10T10:15:00Z',
    updatedAt: '2023-06-10T14:45:00Z'
  },
  {
    id: 'cust3',
    name: 'Malik Croppers',
    contactPerson: 'Amir Malik',
    email: 'amir@malikcroppers.com',
    phone: '+92-333-7778899',
    address: '789 Harvest Lane, Faisalabad',
    creditLimit: 50000,
    outstandingBalance: 0,
    notes: 'Small farm, always pays in cash',
    status: 'active',
    createdAt: '2023-01-15T11:30:00Z',
    updatedAt: '2023-06-20T15:20:00Z'
  },
  {
    id: 'cust4',
    name: 'Sindh Farmers Cooperative',
    contactPerson: 'Zainab Ali',
    email: 'zainab@sindhfarmers.org',
    phone: '+92-345-1122334',
    address: '101 Cooperative Plaza, Karachi',
    creditLimit: 200000,
    outstandingBalance: 75000,
    notes: 'Large cooperative, bulk orders with credit terms',
    status: 'active',
    createdAt: '2023-01-20T12:45:00Z',
    updatedAt: '2023-06-05T16:10:00Z'
  },
  {
    id: 'cust5',
    name: 'Hassan Fields',
    contactPerson: 'Hassan Ahmed',
    email: 'hassan@hassanfields.com',
    phone: '+92-302-5566778',
    address: '202 Crop Road, Islamabad',
    creditLimit: 80000,
    outstandingBalance: 12000,
    notes: 'Medium-sized operation, specializes in wheat',
    status: 'active',
    createdAt: '2023-01-25T13:00:00Z',
    updatedAt: '2023-06-18T10:35:00Z'
  }
];

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2023-001',
    customerId: 'cust1',
    customerName: 'Ahmed Farms',
    date: '2023-06-01',
    dueDate: '2023-07-01',
    status: 'paid',
    items: [
      {
        id: 'item1',
        productId: 'prod1',
        productName: 'SuperGrow Plus',
        description: 'Advanced growth hormone for all crops',
        quantity: 5,
        unitPrice: 2500,
        amount: 12500
      },
      {
        id: 'item2',
        productId: 'prod4',
        productName: 'FungiShield',
        description: 'Protection against fungal diseases',
        quantity: 3,
        unitPrice: 2200,
        amount: 6600
      }
    ],
    subtotal: 19100,
    taxRate: 5,
    taxAmount: 955,
    discountRate: 2,
    discountAmount: 382,
    total: 19673,
    amountPaid: 19673,
    balance: 0,
    notes: 'Paid in full via bank transfer',
    createdAt: '2023-06-01T08:30:00Z',
    updatedAt: '2023-06-15T14:20:00Z'
  },
  {
    id: 'inv2',
    invoiceNumber: 'INV-2023-002',
    customerId: 'cust2',
    customerName: 'Rahman Agriculture',
    date: '2023-06-05',
    dueDate: '2023-07-05',
    status: 'overdue',
    items: [
      {
        id: 'item3',
        productId: 'prod3',
        productName: 'WeedClear Pro',
        description: 'Effective herbicide for all weed types',
        quantity: 10,
        unitPrice: 1500,
        amount: 15000
      }
    ],
    subtotal: 15000,
    taxRate: 5,
    taxAmount: 750,
    discountRate: 0,
    discountAmount: 0,
    total: 15750,
    amountPaid: 0,
    balance: 15750,
    notes: 'First-time customer',
    createdAt: '2023-06-05T10:15:00Z',
    updatedAt: '2023-06-05T10:15:00Z'
  },
  {
    id: 'inv3',
    invoiceNumber: 'INV-2023-003',
    customerId: 'cust3',
    customerName: 'Malik Croppers',
    date: '2023-06-08',
    dueDate: '2023-06-15',
    status: 'paid',
    items: [
      {
        id: 'item4',
        productId: 'prod2',
        productName: 'BugAway Ultra',
        description: 'Powerful pesticide for insect control',
        quantity: 2,
        unitPrice: 1800,
        amount: 3600
      },
      {
        id: 'item5',
        productId: 'prod5',
        productName: 'SoilBoost Premium',
        description: 'Enhanced soil nutrition for all crops',
        quantity: 5,
        unitPrice: 1200,
        amount: 6000
      }
    ],
    subtotal: 9600,
    taxRate: 5,
    taxAmount: 480,
    discountRate: 5,
    discountAmount: 480,
    total: 9600,
    amountPaid: 9600,
    balance: 0,
    notes: 'Loyal customer, applied 5% discount',
    createdAt: '2023-06-08T09:45:00Z',
    updatedAt: '2023-06-10T16:30:00Z'
  },
  {
    id: 'inv4',
    invoiceNumber: 'INV-2023-004',
    customerId: 'cust4',
    customerName: 'Sindh Farmers Cooperative',
    date: '2023-06-12',
    dueDate: '2023-07-12',
    status: 'paid',
    items: [
      {
        id: 'item6',
        productId: 'prod6',
        productName: 'Wheat Seeds Elite',
        description: 'High-yield premium wheat seeds',
        quantity: 8,
        unitPrice: 3500,
        amount: 28000
      },
      {
        id: 'item7',
        productId: 'prod7',
        productName: 'CropGuard Total',
        description: 'Complete protection system for crops',
        quantity: 3,
        unitPrice: 3200,
        amount: 9600
      }
    ],
    subtotal: 37600,
    taxRate: 5,
    taxAmount: 1880,
    discountRate: 10,
    discountAmount: 3760,
    total: 35720,
    amountPaid: 35720,
    balance: 0,
    notes: 'Bulk order with 10% discount',
    createdAt: '2023-06-12T11:20:00Z',
    updatedAt: '2023-06-20T15:40:00Z'
  },
  {
    id: 'inv5',
    invoiceNumber: 'INV-2023-005',
    customerId: 'cust5',
    customerName: 'Hassan Fields',
    date: '2023-06-15',
    dueDate: '2023-07-15',
    status: 'pending',
    items: [
      {
        id: 'item8',
        productId: 'prod8',
        productName: 'Rice Seeds Pro',
        description: 'Disease-resistant rice seeds',
        quantity: 5,
        unitPrice: 2800,
        amount: 14000
      },
      {
        id: 'item9',
        productId: 'prod5',
        productName: 'SoilBoost Premium',
        description: 'Enhanced soil nutrition for all crops',
        quantity: 10,
        unitPrice: 1200,
        amount: 12000
      }
    ],
    subtotal: 26000,
    taxRate: 5,
    taxAmount: 1300,
    discountRate: 0,
    discountAmount: 0,
    total: 27300,
    amountPaid: 15000,
    balance: 12300,
    notes: 'Partial payment received',
    createdAt: '2023-06-15T14:50:00Z',
    updatedAt: '2023-06-18T09:15:00Z'
  },
  {
    id: 'inv6',
    invoiceNumber: 'INV-2023-006',
    customerId: 'cust1',
    customerName: 'Ahmed Farms',
    date: '2023-06-18',
    dueDate: '2023-07-18',
    status: 'pending',
    items: [
      {
        id: 'item10',
        productId: 'prod1',
        productName: 'SuperGrow Plus',
        description: 'Advanced growth hormone for all crops',
        quantity: 8,
        unitPrice: 2500,
        amount: 20000
      }
    ],
    subtotal: 20000,
    taxRate: 5,
    taxAmount: 1000,
    discountRate: 3,
    discountAmount: 600,
    total: 20400,
    amountPaid: 5000,
    balance: 15400,
    notes: 'Repeat customer, partial payment received',
    createdAt: '2023-06-18T13:25:00Z',
    updatedAt: '2023-06-22T10:30:00Z'
  },
  {
    id: 'inv7',
    invoiceNumber: 'INV-2023-007',
    customerId: 'cust3',
    customerName: 'Malik Croppers',
    date: '2023-06-20',
    dueDate: '2023-07-05',
    status: 'cancelled',
    items: [
      {
        id: 'item11',
        productId: 'prod2',
        productName: 'BugAway Ultra',
        description: 'Powerful pesticide for insect control',
        quantity: 3,
        unitPrice: 1800,
        amount: 5400
      }
    ],
    subtotal: 5400,
    taxRate: 5,
    taxAmount: 270,
    discountRate: 0,
    discountAmount: 0,
    total: 5670,
    amountPaid: 0,
    balance: 5670,
    notes: 'Order cancelled due to product unavailability',
    createdAt: '2023-06-20T16:45:00Z',
    updatedAt: '2023-06-21T09:10:00Z'
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: 'pay1',
    invoiceId: 'inv1',
    amount: 19673,
    date: '2023-06-15',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'TRF123456',
    notes: 'Full payment for invoice',
    createdAt: '2023-06-15T14:20:00Z',
    updatedAt: '2023-06-15T14:20:00Z'
  },
  {
    id: 'pay2',
    invoiceId: 'inv3',
    amount: 9600,
    date: '2023-06-10',
    paymentMethod: 'cash',
    notes: 'Payment received at delivery',
    createdAt: '2023-06-10T16:30:00Z',
    updatedAt: '2023-06-10T16:30:00Z'
  },
  {
    id: 'pay3',
    invoiceId: 'inv4',
    amount: 35720,
    date: '2023-06-20',
    paymentMethod: 'check',
    referenceNumber: 'CHK987654',
    notes: 'Check cleared on June 20',
    createdAt: '2023-06-20T15:40:00Z',
    updatedAt: '2023-06-20T15:40:00Z'
  },
  {
    id: 'pay4',
    invoiceId: 'inv5',
    amount: 15000,
    date: '2023-06-18',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'TRF789012',
    notes: 'Partial payment, remaining due by July 15',
    createdAt: '2023-06-18T09:15:00Z',
    updatedAt: '2023-06-18T09:15:00Z'
  },
  {
    id: 'pay5',
    invoiceId: 'inv6',
    amount: 5000,
    date: '2023-06-22',
    paymentMethod: 'mobile_payment',
    referenceNumber: 'MP345678',
    notes: 'Partial payment via EasyPaisa',
    createdAt: '2023-06-22T10:30:00Z',
    updatedAt: '2023-06-22T10:30:00Z'
  }
]; 