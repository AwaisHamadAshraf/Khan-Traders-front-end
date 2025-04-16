import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { Invoice } from '../../types/models';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface AddPaymentDialogProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onAddPayment: (paymentData: {
    amount: number;
    date: string;
    paymentMethod: string;
    referenceNumber: string;
    notes: string;
  }) => void;
}

// Payment method options
const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
];

const AddPaymentDialog = ({
  open,
  invoice,
  onClose,
  onAddPayment,
}: AddPaymentDialogProps) => {
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{
    amount?: string;
    date?: string;
    paymentMethod?: string;
  }>({});

  // Reset form when dialog opens or closes
  React.useEffect(() => {
    if (open) {
      // Default to the remaining balance amount when opening
      setAmount(invoice?.balance || 0);
      setDate(new Date());
      setPaymentMethod('cash');
      setReferenceNumber('');
      setNotes('');
      setErrors({});
    }
  }, [open, invoice]);

  const validateForm = () => {
    const newErrors: { amount?: string; date?: string; paymentMethod?: string } = {};
    let isValid = true;

    if (!amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (typeof amount === 'string' && isNaN(parseFloat(amount))) {
      newErrors.amount = 'Amount must be a valid number';
      isValid = false;
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
      isValid = false;
    } else if (Number(amount) > (invoice?.balance || 0)) {
      newErrors.amount = 'Amount cannot exceed the remaining balance';
      isValid = false;
    }

    if (!date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddPayment({
        amount: Number(amount),
        date: date ? date.toISOString() : new Date().toISOString(),
        paymentMethod,
        referenceNumber,
        notes,
      });
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Payment for Invoice #{invoice.invoiceNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Invoice Total:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Rs {invoice.total.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Amount Paid:</Typography>
                  <Typography variant="body2">
                    Rs {invoice.amountPaid.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Balance Due:</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: invoice.balance > 0 ? 'error.main' : 'success.main',
                    }}
                  >
                    Rs {invoice.balance.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Payment Date"
                  value={date}
                  onChange={(newDate: Date | null) => setDate(newDate)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.date,
                      helperText: errors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.paymentMethod}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.paymentMethod && (
                  <FormHelperText>{errors.paymentMethod}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reference Number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                fullWidth
                placeholder="Check number, transaction ID, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Optional payment notes"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Add Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPaymentDialog; 