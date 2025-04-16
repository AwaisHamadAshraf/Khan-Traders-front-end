import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Customer, Product, Invoice, InvoiceItem } from '../../types/models';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  customers: Customer[];
  products: Product[];
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

interface InvoiceItemWithErrors extends InvoiceItem {
  errors?: {
    productId?: string;
    quantity?: string;
    unitPrice?: string;
  };
}

const InvoiceForm = ({
  invoice,
  customers,
  products,
  onSave,
  onCancel,
}: InvoiceFormProps) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'>('draft');
  const [items, setItems] = useState<InvoiceItemWithErrors[]>([]);
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  
  const [formErrors, setFormErrors] = useState({
    invoiceNumber: '',
    customerId: '',
    date: '',
    dueDate: '',
  });

  // Add new empty item row
  const addNewItem = useCallback(() => {
    setItems(prevItems => [
      ...prevItems,
      {
        id: uuidv4(),
        productId: '',
        productName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        errors: {},
      },
    ]);
  }, []);

  // Initialize the form with invoice data if editing
  useEffect(() => {
    if (invoice) {
      setInvoiceNumber(invoice.invoiceNumber);
      setCustomerId(invoice.customerId);
      setCustomerName(invoice.customerName);
      setDate(invoice.date ? new Date(invoice.date) : new Date());
      setDueDate(invoice.dueDate ? new Date(invoice.dueDate) : null);
      setStatus(invoice.status);
      setItems(invoice.items.map((item) => ({ ...item })));
      setNotes(invoice.notes || '');
      setTaxRate(invoice.taxRate);
      setDiscountRate(invoice.discountRate);
    } else {
      // Generate a new invoice number for new invoices
      const timestamp = new Date().getTime().toString().slice(-6);
      setInvoiceNumber(`INV-${timestamp}`);
      // Default due date to 15 days from now for new invoices
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + 15);
      setDueDate(newDueDate);
      // Add one empty item row
      addNewItem();
    }
  }, [invoice, addNewItem]);

  // Handle customer change and update related fields
  const handleCustomerChange = (event: SelectChangeEvent<string>) => {
    const selectedCustomerId = event.target.value;
    setCustomerId(selectedCustomerId);
    
    // Find the selected customer and update customer name
    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.name);
    } else {
      setCustomerName('');
    }
  };

  // Remove item at specific index
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Handle item product selection
  const handleProductChange = (index: number, productId: string) => {
    const newItems = [...items];
    const product = products.find((p) => p.id === productId);
    
    if (product) {
      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        productName: product.name,
        description: product.description || '',
        unitPrice: product.sellingPrice,
        amount: product.sellingPrice * newItems[index].quantity,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        productId: '',
        productName: '',
        description: '',
        unitPrice: 0,
        amount: 0,
      };
    }
    
    setItems(newItems);
  };

  // Handle item quantity change
  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      amount: quantity * newItems[index].unitPrice,
    };
    setItems(newItems);
  };

  // Handle item unit price change
  const handleUnitPriceChange = (index: number, unitPrice: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      unitPrice,
      amount: newItems[index].quantity * unitPrice,
    };
    setItems(newItems);
  };

  // Calculate subtotal, tax, discount, and total
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discountAmount = (subtotal * discountRate) / 100;
  const total = subtotal + taxAmount - discountAmount;

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;
    const errors = {
      invoiceNumber: '',
      customerId: '',
      date: '',
      dueDate: '',
    };

    // Validate invoice number
    if (!invoiceNumber.trim()) {
      errors.invoiceNumber = 'Invoice number is required';
      isValid = false;
    }

    // Validate customer
    if (!customerId) {
      errors.customerId = 'Customer is required';
      isValid = false;
    }

    // Validate date
    if (!date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    // Validate due date
    if (!dueDate) {
      errors.dueDate = 'Due date is required';
      isValid = false;
    }

    // Validate items
    const newItems = [...items];
    let itemsValid = true;

    newItems.forEach((item, index) => {
      item.errors = {};

      if (!item.productId) {
        item.errors.productId = 'Product is required';
        itemsValid = false;
      }

      if (!item.quantity || item.quantity <= 0) {
        item.errors.quantity = 'Quantity must be greater than 0';
        itemsValid = false;
      }

      if (!item.unitPrice || item.unitPrice < 0) {
        item.errors.unitPrice = 'Unit price must be 0 or greater';
        itemsValid = false;
      }
    });

    setItems(newItems);
    setFormErrors(errors);

    return isValid && itemsValid && items.length > 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const savedInvoice: Invoice = {
        id: invoice?.id || uuidv4(),
        invoiceNumber,
        customerId,
        customerName,
        date: date ? date.toISOString() : new Date().toISOString(),
        dueDate: dueDate ? dueDate.toISOString() : new Date().toISOString(),
        status: status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled',
        items: items.map(({ id, productId, productName, description, quantity, unitPrice, amount }) => ({
          id,
          productId,
          productName,
          description,
          quantity,
          unitPrice,
          amount,
        })),
        subtotal,
        taxRate,
        taxAmount,
        discountRate,
        discountAmount,
        total,
        notes,
        amountPaid: invoice?.amountPaid || 0,
        balance: invoice ? (total - invoice.amountPaid) : total,
        createdAt: invoice?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(savedInvoice);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">
              {invoice ? 'Edit Invoice' : 'Create New Invoice'}
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Invoice Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Invoice Number"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      fullWidth
                      required
                      error={!!formErrors.invoiceNumber}
                      helperText={formErrors.invoiceNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!formErrors.customerId}>
                      <InputLabel>Customer</InputLabel>
                      <Select
                        value={customerId}
                        onChange={handleCustomerChange}
                        label="Customer"
                      >
                        {customers.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.customerId && (
                        <Typography variant="caption" color="error">
                          {formErrors.customerId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={date}
                        onChange={(newDate: Date | null) => setDate(newDate)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!formErrors.date,
                            helperText: formErrors.date,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(newDate: Date | null) => setDueDate(newDate)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!formErrors.dueDate,
                            helperText: formErrors.dueDate,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled')}
                        label="Status"
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="overdue">Overdue</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      multiline
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      fullWidth
                      placeholder="Add notes or terms of service"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tax Rate (%)"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Discount Rate (%)"
                      type="number"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Items</Typography>
              <Button startIcon={<AddIcon />} onClick={addNewItem} color="primary">
                Add Item
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price (Rs)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount (Rs)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormControl fullWidth error={!!item.errors?.productId}>
                          <Select
                            value={item.productId}
                            onChange={(e) => handleProductChange(index, e.target.value as string)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select Product
                            </MenuItem>
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {item.errors?.productId && (
                            <Typography variant="caption" color="error">
                              {item.errors.productId}
                            </Typography>
                          )}
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].description = e.target.value;
                            setItems(newItems);
                          }}
                          fullWidth
                          multiline
                          maxRows={2}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                          inputProps={{ min: 1, style: { textAlign: 'right' } }}
                          error={!!item.errors?.quantity}
                          helperText={item.errors?.quantity}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value) || 0)}
                          inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                          error={!!item.errors?.unitPrice}
                          helperText={item.errors?.unitPrice}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No items added. Click "Add Item" to add invoice items.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ width: '300px', p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>Rs {subtotal.toLocaleString()}</Typography>
                </Box>
                {taxRate > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax ({taxRate}%):</Typography>
                    <Typography>Rs {taxAmount.toLocaleString()}</Typography>
                  </Box>
                )}
                {discountRate > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Discount ({discountRate}%):</Typography>
                    <Typography>- Rs {discountAmount.toLocaleString()}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Rs {total.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InvoiceForm; 