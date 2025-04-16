import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Tooltip, 
  Container, 
  Dialog,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Print as PrintIcon } from '@mui/icons-material';
import BillingSummary from '../components/billing/BillingSummary';
import BillingFilter from '../components/billing/BillingFilter';
import InvoiceTable from '../components/billing/InvoiceTable';
import InvoiceForm from '../components/billing/InvoiceForm';
import InvoiceDetailDialog from '../components/billing/InvoiceDetailDialog';
import AddPaymentDialog from '../components/billing/AddPaymentDialog';
import PrintInvoice from '../components/billing/PrintInvoice';
import { 
  getInvoices, 
  getCustomers, 
  getPaymentsByInvoiceId,
  addInvoice, 
  updateInvoice, 
  deleteInvoice,
  addPayment,
  getTotalSales,
  getTotalOutstandingBalance
} from '../services/billingService';
import { getProducts } from '../services/inventoryService';
import { Invoice, Payment } from '../types/models';
import { BillingFilterType, defaultBillingFilter } from '../types/filters';

const Billing = () => {
  // State management
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<BillingFilterType>(defaultBillingFilter);
  
  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOutstanding: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  });
  
  // Print reference
  const printRef = useRef<HTMLDivElement>(null);
  
  // Load invoices on mount
  useEffect(() => {
    loadInvoices();
  }, []);
  
  // Filter invoices when filter changes
  useEffect(() => {
    applyFilters();
  }, [filter, invoices]);
  
  // Load and calculate stats when invoices change
  useEffect(() => {
    calculateStats();
  }, [invoices]);
  
  // Load invoices
  const loadInvoices = () => {
    const data = getInvoices();
    setInvoices(data);
    setFilteredInvoices(data);
  };
  
  // Apply filters
  const applyFilters = () => {
    const filtered = getInvoices(filter);
    setFilteredInvoices(filtered);
  };
  
  // Calculate statistics
  const calculateStats = () => {
    const totalSales = getTotalSales();
    const totalOutstanding = getTotalOutstandingBalance();
    const totalInvoices = invoices.length;
    
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
    
    setStats({
      totalSales,
      totalOutstanding,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilter: BillingFilterType) => {
    setFilter(newFilter);
  };
  
  // Clear filters
  const handleClearFilter = () => {
    setFilter(defaultBillingFilter);
  };
  
  // Open invoice form for creation
  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };
  
  // Open invoice form for editing
  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };
  
  // Open invoice details dialog
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    const invoicePayments = getPaymentsByInvoiceId(invoice.id);
    setPayments(invoicePayments);
    setIsDetailOpen(true);
  };
  
  // Handle invoice deletion
  const handleDeleteInvoice = (invoice: Invoice) => {
    try {
      const success = deleteInvoice(invoice.id);
      if (success) {
        setSnackbar({
          open: true,
          message: `Invoice ${invoice.invoiceNumber} deleted successfully`,
          severity: 'success'
        });
        loadInvoices();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting invoice',
        severity: 'error'
      });
    }
  };
  
  // Print invoice
  const handlePrintInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    const invoicePayments = getPaymentsByInvoiceId(invoice.id);
    setPayments(invoicePayments);
    
    // Wait for state update before printing
    setTimeout(() => {
      setIsPrintMode(true);
      setTimeout(() => {
        if (printRef.current) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Invoice ${invoice.invoiceNumber}</title>
                  <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                  </style>
                </head>
                <body>
                  ${printRef.current.innerHTML}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }
        }
        setIsPrintMode(false);
      }, 100);
    }, 100);
  };
  
  // Open payment dialog
  const handleAddPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };
  
  // Save invoice (create or update)
  const handleSaveInvoice = (invoice: Invoice) => {
    try {
      if (invoice.id && invoices.some(inv => inv.id === invoice.id)) {
        // Update existing invoice
        updateInvoice(invoice);
        setSnackbar({
          open: true,
          message: `Invoice ${invoice.invoiceNumber} updated successfully`,
          severity: 'success'
        });
      } else {
        // Create new invoice
        addInvoice(invoice);
        setSnackbar({
          open: true,
          message: `Invoice ${invoice.invoiceNumber} created successfully`,
          severity: 'success'
        });
      }
      
      setIsFormOpen(false);
      loadInvoices();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving invoice',
        severity: 'error'
      });
    }
  };
  
  // Add payment to invoice
  const handleAddPaymentSubmit = (paymentData: {
    amount: number;
    date: string;
    paymentMethod: string;
    referenceNumber: string;
    notes: string;
  }) => {
    try {
      if (!selectedInvoice) return;
      
      // Create payment
      const payment = {
        invoiceId: selectedInvoice.id,
        ...paymentData
      };
      
      addPayment(payment);
      
      // Update invoice
      const updatedInvoice = {
        ...selectedInvoice,
        amountPaid: selectedInvoice.amountPaid + paymentData.amount,
        balance: selectedInvoice.balance - paymentData.amount,
        status: (selectedInvoice.balance - paymentData.amount) <= 0 ? 'paid' : selectedInvoice.status
      };
      
      updateInvoice(updatedInvoice);
      
      setSnackbar({
        open: true,
        message: `Payment of Rs ${paymentData.amount.toLocaleString()} added successfully`,
        severity: 'success'
      });
      
      setIsPaymentDialogOpen(false);
      loadInvoices();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding payment',
        severity: 'error'
      });
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Billing & Invoices
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            New Invoice
          </Button>
        </Box>
        
        {/* Stats summary */}
        <BillingSummary 
          totalSales={stats.totalSales}
          totalOutstanding={stats.totalOutstanding}
          totalInvoices={stats.totalInvoices}
          paidInvoices={stats.paidInvoices}
          pendingInvoices={stats.pendingInvoices}
          overdueInvoices={stats.overdueInvoices}
        />
        
        {/* Filters */}
        <BillingFilter 
          filter={filter}
          customers={getCustomers()}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
        />
        
        {/* Invoices table */}
        <InvoiceTable 
          invoices={filteredInvoices}
          onView={handleViewInvoice}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onPrint={handlePrintInvoice}
          onAddPayment={handleAddPayment}
        />
      </Box>
      
      {/* Invoice form dialog */}
      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="xl" fullWidth>
        <InvoiceForm 
          invoice={selectedInvoice}
          customers={getCustomers()}
          products={getProducts()}
          onSave={handleSaveInvoice}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>
      
      {/* Invoice detail dialog */}
      <InvoiceDetailDialog 
        open={isDetailOpen}
        invoice={selectedInvoice}
        payments={payments}
        onClose={() => setIsDetailOpen(false)}
        onPrint={() => selectedInvoice && handlePrintInvoice(selectedInvoice)}
        onAddPayment={() => {
          setIsDetailOpen(false);
          setIsPaymentDialogOpen(true);
        }}
      />
      
      {/* Add payment dialog */}
      <AddPaymentDialog
        open={isPaymentDialogOpen}
        invoice={selectedInvoice}
        onClose={() => setIsPaymentDialogOpen(false)}
        onAddPayment={handleAddPaymentSubmit}
      />
      
      {/* Print invoice (hidden) */}
      {isPrintMode && selectedInvoice && (
        <Box sx={{ display: 'none' }}>
          <PrintInvoice ref={printRef} invoice={selectedInvoice} payments={payments} />
        </Box>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Billing; 