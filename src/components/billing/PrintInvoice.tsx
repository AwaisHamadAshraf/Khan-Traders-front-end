import React, { forwardRef } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper,
  styled
} from '@mui/material';
import { Invoice, Payment } from '../../types/models';

interface PrintInvoiceProps {
  invoice: Invoice;
  payments: Payment[];
  companyDetails?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

// Styled components for print-specific styling
const PrintContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  color: '#000',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  '@media print': {
    padding: theme.spacing(2),
  }
}));

const PrintHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const PrintFooter = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  textAlign: 'center',
  fontSize: '0.75rem',
  color: '#666',
}));

const TableContainer = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '@media print': {
    boxShadow: 'none',
    border: '1px solid #ddd',
  }
}));

// Use React.forwardRef to pass ref to the component to enable printing
const PrintInvoice = forwardRef<HTMLDivElement, PrintInvoiceProps>(
  ({ invoice, payments, companyDetails }, ref) => {
    // Format date
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Default company details if not provided
    const company = companyDetails || {
      name: 'Khan Traders',
      address: '123 Agriculture Road, Multan',
      phone: '+92-300-1234567',
      email: 'info@khantraders.com',
    };

    return (
      <PrintContainer ref={ref}>
        <PrintHeader>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {company.name}
                </Typography>
                <Typography variant="body2">{company.address}</Typography>
                <Typography variant="body2">Phone: {company.phone}</Typography>
                <Typography variant="body2">Email: {company.email}</Typography>
                {company.website && (
                  <Typography variant="body2">Website: {company.website}</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h4" gutterBottom>
                INVOICE
              </Typography>
              <Typography variant="h6">#{invoice.invoiceNumber}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(invoice.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Status:</strong>{' '}
                  <Box
                    component="span"
                    sx={{
                      p: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      fontWeight: 'bold',
                      bgcolor: 
                        invoice.status === 'paid' ? '#e8f5e9' : 
                        invoice.status === 'pending' ? '#fff8e1' :
                        invoice.status === 'overdue' ? '#ffebee' : '#f5f5f5',
                      color: 
                        invoice.status === 'paid' ? '#2e7d32' :
                        invoice.status === 'pending' ? '#f57c00' :
                        invoice.status === 'overdue' ? '#c62828' : '#757575',
                    }}
                  >
                    {invoice.status.toUpperCase()}
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </PrintHeader>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bill To:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {invoice.customerName}
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Items:
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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

        <Grid container spacing={3}>
          <Grid item xs={7}>
            {payments.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment History:
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
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

            {invoice.notes && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notes:
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body2">{invoice.notes}</Typography>
                </Paper>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={5}>
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>Rs {invoice.subtotal.toLocaleString()}</Typography>
              </Box>
              {invoice.taxRate > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax ({invoice.taxRate}%):</Typography>
                  <Typography>Rs {invoice.taxAmount.toLocaleString()}</Typography>
                </Box>
              )}
              {invoice.discountRate > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Discount ({invoice.discountRate}%):</Typography>
                  <Typography>- Rs {invoice.discountAmount.toLocaleString()}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Total:</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>Rs {invoice.total.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Amount Paid:</Typography>
                <Typography>Rs {invoice.amountPaid.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Balance Due:</Typography>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: invoice.balance > 0 ? '#d32f2f' : '#388e3c',
                  }}
                >
                  Rs {invoice.balance.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <PrintFooter>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">
            Thank you for your business!
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Typography>
        </PrintFooter>
      </PrintContainer>
    );
  }
);

// Add display name for React Developer Tools
PrintInvoice.displayName = 'PrintInvoice';

export default PrintInvoice; 