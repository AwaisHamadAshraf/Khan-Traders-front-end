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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { 
  Close as CloseIcon,
  Print as PrintIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { Invoice, Payment } from '../../types/models';

interface InvoiceDetailDialogProps {
  open: boolean;
  invoice: Invoice | null;
  payments: Payment[];
  onClose: () => void;
  onPrint: () => void;
  onAddPayment: () => void;
}

const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({
  open,
  invoice,
  payments,
  onClose,
  onPrint,
  onAddPayment,
}) => {
  if (!invoice) return null;

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

  const statusChip = getStatusChip(invoice.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Invoice Details</Typography>
          <Box>
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button
                startIcon={<PaymentIcon />}
                variant="contained"
                color="success"
                size="small"
                onClick={onAddPayment}
                sx={{ mr: 1 }}
              >
                Add Payment
              </Button>
            )}
            <Button
              startIcon={<PrintIcon />}
              variant="outlined"
              size="small"
              onClick={onPrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Khan Traders
                </Typography>
                <Typography variant="body2">
                  123 Agriculture Road, Multan
                </Typography>
                <Typography variant="body2">
                  Phone: +92-300-1234567
                </Typography>
                <Typography variant="body2">
                  Email: info@khantraders.com
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Invoice #{invoice.invoiceNumber}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ width: 100, color: 'text.secondary' }}>
                    Date:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatDate(invoice.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ width: 100, color: 'text.secondary' }}>
                    Due Date:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatDate(invoice.dueDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ width: 100, color: 'text.secondary' }}>
                    Status:
                  </Typography>
                  <Chip
                    label={statusChip.label}
                    color={statusChip.color}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Bill To:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {invoice.customerName}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {invoice.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Notes:
                </Typography>
                <Typography variant="body2">{invoice.notes}</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Items:
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">Rs {item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell align="right">Rs {item.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {payments.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Payment History:
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((payment, index) => (
                        <TableRow key={payment.id || `payment-${index}`}>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>
                            {payment.paymentMethod
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </TableCell>
                          <TableCell align="right">Rs {payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.referenceNumber || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">Rs {invoice.subtotal.toLocaleString()}</Typography>
              </Box>
              {invoice.taxRate > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Tax ({invoice.taxRate}%):</Typography>
                  <Typography variant="body1">Rs {invoice.taxAmount.toLocaleString()}</Typography>
                </Box>
              )}
              {invoice.discountRate > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Discount ({invoice.discountRate}%):</Typography>
                  <Typography variant="body1">- Rs {invoice.discountAmount.toLocaleString()}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Rs {invoice.total.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Amount Paid:</Typography>
                <Typography variant="body1">Rs {invoice.amountPaid.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Balance Due:</Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    fontWeight: 'bold',
                    color: invoice.balance > 0 ? 'error.main' : 'success.main'
                  }}
                >
                  Rs {invoice.balance.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailDialog; 