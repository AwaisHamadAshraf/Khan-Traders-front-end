import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Customer } from '../../types/models';
import { v4 as uuidv4 } from 'uuid';

interface CustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [creditLimit, setCreditLimit] = useState<number | string>(0);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    creditLimit: '',
  });

  // Initialize the form with customer data if editing
  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setContactPerson(customer.contactPerson || '');
      setPhone(customer.phone || '');
      setEmail(customer.email || '');
      setAddress(customer.address || '');
      setPaymentTerms(customer.paymentTerms || '');
      setCreditLimit(customer.creditLimit || 0);
      setNotes(customer.notes || '');
      setStatus(customer.status);
    }
  }, [customer]);

  // Validate the form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      creditLimit: '',
    };

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate phone (optional but should be valid if provided)
    if (phone && !/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
      isValid = false;
    }

    // Validate email (optional but should be valid if provided)
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    // Validate credit limit
    if (creditLimit !== '' && (isNaN(Number(creditLimit)) || Number(creditLimit) < 0)) {
      newErrors.creditLimit = 'Credit limit must be a positive number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      const savedCustomer: Customer = {
        id: customer?.id || uuidv4(),
        name,
        contactPerson,
        phone,
        email,
        address,
        paymentTerms,
        creditLimit: typeof creditLimit === 'string' ? parseFloat(creditLimit) || 0 : creditLimit,
        outstandingBalance: customer?.outstandingBalance || 0,
        notes,
        status,
        createdAt: customer?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(savedCustomer);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">
              {customer ? 'Edit Customer' : 'Add New Customer'}
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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Customer Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Financial Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payment Terms"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  fullWidth
                  placeholder="e.g. Net 30, COD, etc."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Credit Limit"
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  error={!!errors.creditLimit}
                  helperText={errors.creditLimit}
                />
              </Grid>

              {customer && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Outstanding Balance"
                    value={customer.outstandingBalance || 0}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add any additional notes about this customer"
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerForm; 