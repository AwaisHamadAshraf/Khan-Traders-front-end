import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { Customer, Invoice, Payment } from '../../types/models';

interface CustomerDetailDialogProps {
  open: boolean;
  customer: Customer | null;
  invoices: Invoice[];
  payments: Payment[];
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

const CustomerDetailDialog: React.FC<CustomerDetailDialogProps> = ({
  open,
  customer,
  invoices,
  payments,
  onClose,
  onEdit,
}) => {
  if (!customer) return null;

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status chip color
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'success' as const, textColor: '#0d6e0d' };
      case 'inactive':
        return { label: 'Inactive', color: 'error' as const, textColor: '#d32f2f' };
      default:
        return { label: status, color: 'default' as const, textColor: '#757575' };
    }
  };

  // Get invoice status chip color
  const getInvoiceStatusChip = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', color: 'success' as const, textColor: '#0d6e0d' };
      case 'pending':
        return { label: 'Pending', color: 'warning' as const, textColor: '#f57c00' };
      case 'overdue':
        return { label: 'Overdue', color: 'error' as const, textColor: '#d32f2f' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'default' as const, textColor: '#757575' };
      case 'draft':
        return { label: 'Draft', color: 'info' as const, textColor: '#0288d1' };
      default:
        return { label: status, color: 'default' as const, textColor: '#757575' };
    }
  };

  const statusChip = getStatusChip(customer.status);

  // Calculate totals
  const totalPurchases = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
  const outstandingBalance = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Customer Details</Typography>
          <Box>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={() => onEdit(customer)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3}>
          {/* Customer Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h5" component="h2">
                  {customer.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip
                    label={statusChip.label}
                    color={statusChip.color}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Customer since {formatDate(customer.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Outstanding Balance
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: outstandingBalance > 0 ? 'error.main' : 'success.main',
                  }}
                >
                  Rs {outstandingBalance.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                {customer.contactPerson && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Contact Person
                    </Typography>
                    <Typography variant="body1">{customer.contactPerson}</Typography>
                  </Grid>
                )}
                {customer.phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{customer.phone}</Typography>
                  </Grid>
                )}
                {customer.email && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{customer.email}</Typography>
                  </Grid>
                )}
                {customer.address && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">{customer.address}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Financial Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Financial Information
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Purchases
                  </Typography>
                  <Typography variant="body1">Rs {totalPurchases.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Paid
                  </Typography>
                  <Typography variant="body1">Rs {totalPaid.toLocaleString()}</Typography>
                </Grid>
                {customer.creditLimit !== undefined && customer.creditLimit !== null && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Credit Limit
                    </Typography>
                    <Typography variant="body1">Rs {customer.creditLimit.toLocaleString()}</Typography>
                  </Grid>
                )}
                {customer.paymentTerms && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Terms
                    </Typography>
                    <Typography variant="body1">{customer.paymentTerms}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Invoices */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Recent Invoices
            </Typography>
            {invoices.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Paid</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.slice(0, 5).map((invoice) => {
                      const invoiceStatus = getInvoiceStatusChip(invoice.status);
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell align="right">Rs {invoice.total.toLocaleString()}</TableCell>
                          <TableCell align="right">Rs {invoice.amountPaid.toLocaleString()}</TableCell>
                          <TableCell align="right">Rs {invoice.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={invoiceStatus.label}
                              color={invoiceStatus.color}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {invoices.length > 5 && (
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing 5 of {invoices.length} invoices
                    </Typography>
                  </Box>
                )}
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No invoices found for this customer.
              </Typography>
            )}
          </Grid>

          {/* Recent Payments */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Recent Payments
            </Typography>
            {payments.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.slice(0, 5).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>
                          {payment.paymentMethod
                            .split('_')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </TableCell>
                        <TableCell>{payment.referenceNumber || '-'}</TableCell>
                        <TableCell align="right">Rs {payment.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {payments.length > 5 && (
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing 5 of {payments.length} payments
                    </Typography>
                  </Box>
                )}
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No payments found for this customer.
              </Typography>
            )}
          </Grid>

          {/* Notes */}
          {customer.notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Notes
              </Typography>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body1">{customer.notes}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDetailDialog; 