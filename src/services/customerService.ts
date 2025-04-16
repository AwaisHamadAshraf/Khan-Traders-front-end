import { Customer } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

// Storage key for customers
const CUSTOMERS_STORAGE_KEY = 'khan_traders_customers';

// Initial sample customers
const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    contactPerson: 'John Smith',
    phone: '123-456-7890',
    email: 'john@acme.com',
    address: '123 Main St, Anytown, CA 12345',
    paymentTerms: 'Net 30',
    creditLimit: 10000,
    outstandingBalance: 2500,
    notes: 'Long-term client since 2020',
    status: 'active',
    createdAt: '2023-01-15T09:30:00Z',
    updatedAt: '2023-04-20T11:45:00Z',
  },
  {
    id: '2',
    name: 'XYZ Industries',
    contactPerson: 'Jane Doe',
    phone: '987-654-3210',
    email: 'jane@xyz.com',
    address: '456 Oak Ave, Business Park, NY 54321',
    paymentTerms: 'Net 15',
    creditLimit: 5000,
    outstandingBalance: 0,
    notes: 'Reliable payment history',
    status: 'active',
    createdAt: '2023-02-10T14:20:00Z',
    updatedAt: '2023-02-10T14:20:00Z',
  },
  {
    id: '3',
    name: 'Global Enterprises',
    contactPerson: 'Mike Johnson',
    phone: '555-123-4567',
    email: 'mike@global.com',
    address: '789 Elm Street, Downtown, TX 67890',
    paymentTerms: 'Net 45',
    creditLimit: 15000,
    outstandingBalance: 8000,
    notes: 'International client with multiple locations',
    status: 'active',
    createdAt: '2023-03-05T10:10:00Z',
    updatedAt: '2023-05-15T16:30:00Z',
  },
  {
    id: '4',
    name: 'Local Shop',
    contactPerson: 'Sarah Williams',
    phone: '333-444-5555',
    email: 'sarah@localshop.com',
    address: '101 Small Street, Village, FL 33333',
    paymentTerms: 'Net 7',
    creditLimit: 2000,
    outstandingBalance: 500,
    notes: 'Small local business',
    status: 'active',
    createdAt: '2023-04-01T08:00:00Z',
    updatedAt: '2023-05-01T09:15:00Z',
  },
  {
    id: '5',
    name: 'Inactive Client Inc',
    contactPerson: 'Robert Brown',
    phone: '222-333-4444',
    email: 'robert@inactive.com',
    address: '999 Closed Ave, Empty, WA 99999',
    paymentTerms: 'Net 30',
    creditLimit: 5000,
    outstandingBalance: 1200,
    notes: 'Inactive due to unpaid invoices',
    status: 'inactive',
    createdAt: '2022-10-10T13:45:00Z',
    updatedAt: '2023-01-05T11:20:00Z',
  },
];

// Initialize customers in localStorage if not already present
const initializeCustomers = (): void => {
  if (!localStorage.getItem(CUSTOMERS_STORAGE_KEY)) {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(initialCustomers));
  }
};

// Get all customers
export const getCustomers = (): Customer[] => {
  initializeCustomers();
  const customers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  return customers ? JSON.parse(customers) : [];
};

// Get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  const customers = getCustomers();
  return customers.find(customer => customer.id === id);
};

// Create a new customer
export const createCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
  const customers = getCustomers();
  
  const newCustomer: Customer = {
    ...customerData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify([...customers, newCustomer]));
  return newCustomer;
};

// Update an existing customer
export const updateCustomer = (id: string, customerData: Partial<Customer>): Customer => {
  const customers = getCustomers();
  const customerIndex = customers.findIndex(customer => customer.id === id);
  
  if (customerIndex === -1) {
    throw new Error('Customer not found');
  }
  
  const updatedCustomer = {
    ...customers[customerIndex],
    ...customerData,
    updatedAt: new Date().toISOString(),
  };
  
  customers[customerIndex] = updatedCustomer;
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  
  return updatedCustomer;
};

// Delete a customer
export const deleteCustomer = (id: string): boolean => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(customer => customer.id !== id);
  
  if (updatedCustomers.length === customers.length) {
    // No customer was removed
    throw new Error('Customer not found');
  }
  
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers));
  return true;
};

// Filter customers based on search criteria
export interface CustomerFilter {
  searchTerm: string;
  status: string;
}

export const filterCustomers = (customers: Customer[], filter: CustomerFilter): Customer[] => {
  return customers.filter(customer => {
    // Filter by search term
    const matchesSearch = !filter.searchTerm || 
      customer.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      (customer.contactPerson && customer.contactPerson.toLowerCase().includes(filter.searchTerm.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(filter.searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(filter.searchTerm));
    
    // Filter by status
    const matchesStatus = !filter.status || customer.status === filter.status;
    
    return matchesSearch && matchesStatus;
  });
}; 