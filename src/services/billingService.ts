import axios from 'axios';
import { 
  Customer, 
  Invoice, 
  Payment
} from '../types/models';
import { BillingFilterType } from '../types/filters';

// Mock data for the billing module
const customers: Customer[] = [
  {
    id: '1',
    name: 'Ahmad Traders',
    contactPerson: 'Ahmad Khan',
    phone: '0300-1234567',
    email: 'ahmad@example.com',
    address: '123 Main Street, Lahore',
    paymentTerms: 'Net 30',
    creditLimit: 100000,
    outstandingBalance: 25000,
    status: 'active',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-05-20T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Malik Agro Farm',
    contactPerson: 'Malik Riaz',
    phone: '0301-7654321',
    email: 'malik@example.com',
    address: '456 Farm Road, Multan',
    paymentTerms: 'Net 15',
    creditLimit: 50000,
    outstandingBalance: 0,
    status: 'active',
    createdAt: '2023-02-10T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Hassan Pesticides',
    contactPerson: 'Hassan Ali',
    phone: '0333-1122334',
    email: 'hassan@example.com',
    address: '789 Industrial Area, Faisalabad',
    paymentTerms: 'Net 45',
    creditLimit: 200000,
    outstandingBalance: 75000,
    status: 'inactive',
    createdAt: '2022-11-05T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
  },
];

const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    customerId: '1',
    customerName: 'Ahmad Traders',
    date: '2023-04-15T00:00:00.000Z',
    dueDate: '2023-05-15T00:00:00.000Z',
    status: 'paid',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Pestex 500EC',
        quantity: 20,
        unitPrice: 1500,
        amount: 30000,
      },
      {
        id: '2',
        productId: '2',
        productName: 'Fungikill Pro',
        quantity: 15,
        unitPrice: 1100,
        amount: 16500,
      }
    ],
    subtotal: 46500,
    taxRate: 5,
    taxAmount: 2325,
    discountRate: 2,
    discountAmount: 930,
    total: 47895,
    amountPaid: 47895,
    balance: 0,
    createdAt: '2023-04-15T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    customerId: '2',
    customerName: 'Malik Agro Farm',
    date: '2023-04-20T00:00:00.000Z',
    dueDate: '2023-05-05T00:00:00.000Z',
    status: 'paid',
    items: [
      {
        id: '3',
        productId: '1',
        productName: 'Pestex 500EC',
        quantity: 10,
        unitPrice: 1500,
        amount: 15000,
      }
    ],
    subtotal: 15000,
    taxRate: 5,
    taxAmount: 750,
    discountRate: 0,
    discountAmount: 0,
    total: 15750,
    amountPaid: 15750,
    balance: 0,
    createdAt: '2023-04-20T00:00:00.000Z',
    updatedAt: '2023-04-20T00:00:00.000Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    customerId: '1',
    customerName: 'Ahmad Traders',
    date: '2023-05-05T00:00:00.000Z',
    dueDate: '2023-06-04T00:00:00.000Z',
    status: 'pending',
    items: [
      {
        id: '4',
        productId: '3',
        productName: 'Weed Clear 20%',
        quantity: 25,
        unitPrice: 950,
        amount: 23750,
      }
    ],
    subtotal: 23750,
    taxRate: 5,
    taxAmount: 1187.5,
    discountRate: 0,
    discountAmount: 0,
    total: 24937.5,
    amountPaid: 0,
    balance: 24937.5,
    createdAt: '2023-05-05T00:00:00.000Z',
    updatedAt: '2023-05-05T00:00:00.000Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2023-004',
    customerId: '3',
    customerName: 'Hassan Pesticides',
    date: '2023-04-25T00:00:00.000Z',
    dueDate: '2023-06-09T00:00:00.000Z',
    status: 'pending',
    items: [
      {
        id: '5',
        productId: '1',
        productName: 'Pestex 500EC',
        quantity: 30,
        unitPrice: 1500,
        amount: 45000,
      },
      {
        id: '6',
        productId: '2',
        productName: 'Fungikill Pro',
        quantity: 25,
        unitPrice: 1100,
        amount: 27500,
      }
    ],
    subtotal: 72500,
    taxRate: 5,
    taxAmount: 3625,
    discountRate: 5,
    discountAmount: 3625,
    total: 72500,
    amountPaid: 0,
    balance: 72500,
    createdAt: '2023-04-25T00:00:00.000Z',
    updatedAt: '2023-04-25T00:00:00.000Z',
  }
];

const payments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 47895,
    date: '2023-04-20T00:00:00.000Z',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'TRX123456',
    createdAt: '2023-04-20T00:00:00.000Z',
    updatedAt: '2023-04-20T00:00:00.000Z',
  },
  {
    id: '2',
    invoiceId: '2',
    amount: 15750,
    date: '2023-04-25T00:00:00.000Z',
    paymentMethod: 'cash',
    createdAt: '2023-04-25T00:00:00.000Z',
    updatedAt: '2023-04-25T00:00:00.000Z',
  }
];

// Get all customers
export const getCustomers = (): Customer[] => {
  return [...customers];
};

// Get customer by ID
export const getCustomerById = (customerId: string): Customer | undefined => {
  return customers.find(customer => customer.id === customerId);
};

// Get all invoices with optional filtering
export const getInvoices = (filter?: BillingFilterType): Invoice[] => {
  if (!filter) return [...invoices];
  
  let result = [...invoices];
  
  if (filter.searchTerm) {
    const searchLower = filter.searchTerm.toLowerCase();
    result = result.filter(
      invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customerName.toLowerCase().includes(searchLower)
    );
  }
  
  if (filter.customerId) {
    result = result.filter(invoice => invoice.customerId === filter.customerId);
  }
  
  if (filter.status) {
    result = result.filter(invoice => invoice.status === filter.status);
  }
  
  if (filter.dateRange.from) {
    const fromDate = new Date(filter.dateRange.from);
    result = result.filter(invoice => new Date(invoice.date) >= fromDate);
  }
  
  if (filter.dateRange.to) {
    const toDate = new Date(filter.dateRange.to);
    result = result.filter(invoice => new Date(invoice.date) <= toDate);
  }
  
  return result;
};

// Get invoice by ID
export const getInvoiceById = (id: string): Invoice | undefined => {
  return invoices.find(invoice => invoice.id === id);
};

// Get invoices by customer ID
export const getInvoicesByCustomerId = (customerId: string): Invoice[] => {
  return invoices.filter(invoice => invoice.customerId === customerId);
};

// Get all payments
export const getPayments = (): Payment[] => {
  return [...payments];
};

// Get payment by ID
export const getPaymentById = (paymentId: string): Payment | undefined => {
  return payments.find(payment => payment.id === paymentId);
};

// Get payments by invoice ID
export const getPaymentsByInvoiceId = (invoiceId: string): Payment[] => {
  return payments.filter(payment => payment.invoiceId === invoiceId);
};

// Get payments by customer ID
export const getPaymentsByCustomerId = (customerId: string): Payment[] => {
  // Get invoices for this customer
  const customerInvoices = invoices.filter(invoice => invoice.customerId === customerId);
  // Get payments for these invoices
  return payments.filter(payment => 
    customerInvoices.some(invoice => invoice.id === payment.invoiceId)
  );
};

// Calculate total sales for a specific period
export const getTotalSales = (dateFrom?: string, dateTo?: string): number => {
  let filteredInvoices = [...invoices];
  
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    filteredInvoices = filteredInvoices.filter(invoice => 
      new Date(invoice.date) >= fromDate
    );
  }
  
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59); // Set to end of day
    filteredInvoices = filteredInvoices.filter(invoice => 
      new Date(invoice.date) <= toDate
    );
  }
  
  // Only count invoices that are not cancelled
  filteredInvoices = filteredInvoices.filter(invoice => 
    invoice.status !== 'cancelled'
  );
  
  return filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
};

// Calculate outstanding balance for all customers
export const getTotalOutstandingBalance = (): number => {
  // Only count invoices that are not cancelled
  const activeInvoices = invoices.filter(invoice => 
    invoice.status !== 'cancelled'
  );
  
  return activeInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);
};

// Calculate total revenue by period
export const getTotalRevenue = (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): { date: string; total: number }[] => {
  // Only count invoices that are not cancelled
  const activeInvoices = invoices.filter(invoice => 
    invoice.status !== 'cancelled'
  );
  
  const revenueByPeriod: { [key: string]: number } = {};
  
  // Calculate revenue for each invoice based on the period
  activeInvoices.forEach(invoice => {
    const invoiceDate = new Date(invoice.date);
    let periodKey = '';
    
    switch (period) {
      case 'daily':
        periodKey = invoiceDate.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'weekly':
        // Get the week number and year
        const weekNumber = getWeekNumber(invoiceDate);
        periodKey = `${invoiceDate.getFullYear()}-W${weekNumber}`;
        break;
      case 'monthly':
        periodKey = `${invoiceDate.getFullYear()}-${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'yearly':
        periodKey = invoiceDate.getFullYear().toString();
        break;
    }
    
    revenueByPeriod[periodKey] = (revenueByPeriod[periodKey] || 0) + invoice.total;
  });
  
  // Convert to array of objects
  return Object.entries(revenueByPeriod).map(([date, total]) => ({ date, total }));
};

// Helper function to get week number
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Calculate amount due by customer
export const getAmountDueByCustomer = (): { customerId: string; customerName: string; amountDue: number }[] => {
  const customerAmounts: { [key: string]: { customerName: string; amountDue: number } } = {};
  
  // Only count invoices that are not cancelled
  const activeInvoices = invoices.filter(invoice => 
    invoice.status !== 'cancelled'
  );
  
  activeInvoices.forEach(invoice => {
    const { customerId, customerName, balance } = invoice;
    
    if (!customerAmounts[customerId]) {
      customerAmounts[customerId] = { customerName, amountDue: 0 };
    }
    
    customerAmounts[customerId].amountDue += balance;
  });
  
  return Object.entries(customerAmounts).map(([customerId, { customerName, amountDue }]) => ({
    customerId,
    customerName,
    amountDue
  }));
};

// Add new invoice
export const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice => {
  const newInvoice: Invoice = {
    ...invoice,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return newInvoice;
};

// Update existing invoice
export const updateInvoice = (invoice: Invoice): Invoice => {
  const updatedInvoice: Invoice = {
    ...invoice,
    updatedAt: new Date().toISOString(),
  };
  
  return updatedInvoice;
};

// Delete invoice
export const deleteInvoice = (id: string): boolean => {
  return true; // Mock successful deletion
};

// Add payment
export const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment => {
  const newPayment: Payment = {
    ...payment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return newPayment;
}; 