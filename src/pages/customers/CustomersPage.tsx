import React, { useState, useEffect } from 'react';
import { 
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerFilter from '../../components/customers/CustomerFilter';
import CustomerForm from '../../components/customers/CustomerForm';
import CustomerDetailDialog from '../../components/customers/CustomerDetailDialog';
import { Customer, Invoice, Payment } from '../../types/models';
import { CustomerFilterType, defaultCustomerFilter } from '../../types/filters';

// Mock data for testing - will be replaced with API calls
const mockCustomers: Customer[] = [
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

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    customerId: '1',
    customerName: 'Ahmad Traders',
    date: '2023-04-15T00:00:00.000Z',
    dueDate: '2023-05-15T00:00:00.000Z',
    status: 'paid',
    items: [],
    subtotal: 50000,
    taxRate: 5,
    taxAmount: 2500,
    discountRate: 2,
    discountAmount: 1000,
    total: 51500,
    amountPaid: 51500,
    balance: 0,
    createdAt: '2023-04-15T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-015',
    customerId: '1',
    customerName: 'Ahmad Traders',
    date: '2023-05-20T00:00:00.000Z',
    dueDate: '2023-06-20T00:00:00.000Z',
    status: 'pending',
    items: [],
    subtotal: 25000,
    taxRate: 5,
    taxAmount: 1250,
    discountRate: 0,
    discountAmount: 0,
    total: 26250,
    amountPaid: 0,
    balance: 26250,
    createdAt: '2023-05-20T00:00:00.000Z',
    updatedAt: '2023-05-20T00:00:00.000Z',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    amount: 51500,
    date: '2023-04-20T00:00:00.000Z',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'TRX123456',
    createdAt: '2023-04-20T00:00:00.000Z',
    updatedAt: '2023-04-20T00:00:00.000Z',
  },
];

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<CustomerFilterType>(defaultCustomerFilter);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>([]);
  const [customerPayments, setCustomerPayments] = useState<Payment[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fetch customers on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setCustomers(mockCustomers);
  }, []);

  // Apply filters when customers or filter changes
  useEffect(() => {
    applyFilters();
  }, [customers, filter]);

  const applyFilters = () => {
    let result = [...customers];

    // Apply search filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          (customer.contactPerson && customer.contactPerson.toLowerCase().includes(searchLower)) ||
          (customer.phone && customer.phone.toLowerCase().includes(searchLower)) ||
          (customer.email && customer.email.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filter.status) {
      result = result.filter((customer) => customer.status === filter.status);
    }

    // Apply balance range filters
    if (filter.balanceRange?.min !== undefined) {
      result = result.filter(
        (customer) => (customer.outstandingBalance || 0) >= (filter.balanceRange?.min || 0)
      );
    }

    if (filter.balanceRange?.max !== undefined) {
      result = result.filter(
        (customer) => (customer.outstandingBalance || 0) <= (filter.balanceRange?.max || 0)
      );
    }

    setFilteredCustomers(result);
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: CustomerFilterType) => {
    setFilter(newFilter);
  };

  // Clear all filters
  const handleClearFilter = () => {
    setFilter(defaultCustomerFilter);
  };

  // Open form for adding a new customer
  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing customer
  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsFormOpen(true);
  };

  // Handle save customer (both add and edit)
  const handleSaveCustomer = (customer: Customer) => {
    if (customer.id) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...customer, updatedAt: new Date().toISOString() } : c))
      );
      setSnackbar({
        open: true,
        message: 'Customer updated successfully',
        severity: 'success',
      });
    } else {
      // Add new customer
      const newCustomer = {
        ...customer,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setSnackbar({
        open: true,
        message: 'Customer added successfully',
        severity: 'success',
      });
    }
    setIsFormOpen(false);
  };

  // Handle view customer details
  const handleViewCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    // In a real app, fetch the customer's invoices and payments
    const invoices = mockInvoices.filter((invoice) => invoice.customerId === customer.id);
    const payments = mockPayments.filter((payment) => 
      invoices.some((invoice) => invoice.id === payment.invoiceId)
    );
    
    setCustomerInvoices(invoices);
    setCustomerPayments(payments);
    setIsDetailDialogOpen(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    // In a real app, you would show confirmation dialog first
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    setSnackbar({
      open: true,
      message: 'Customer deleted successfully',
      severity: 'success',
    });
  };

  // Handle view customer history
  const handleViewHistory = (customer: Customer) => {
    // This would be implemented to show a history dialog or navigate to a history page
    console.log('View history for customer:', customer.id);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
      </Box>

      {/* Customer Filter */}
      <CustomerFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />

      {/* Customer Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <CustomerTable
          customers={filteredCustomers}
          onView={handleViewCustomer}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onViewHistory={handleViewHistory}
        />
      </Paper>

      {/* Customer Form Dialog */}
      {isFormOpen && (
        <CustomerForm
          customer={currentCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* Customer Detail Dialog */}
      <CustomerDetailDialog
        open={isDetailDialogOpen}
        customer={currentCustomer}
        invoices={customerInvoices}
        payments={customerPayments}
        onClose={() => setIsDetailDialogOpen(false)}
        onEdit={handleEditCustomer}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomersPage; 