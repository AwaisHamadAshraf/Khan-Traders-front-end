import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { BillingFilterType } from '../../types/filters';
import { Customer } from '../../types/models';

interface BillingFilterProps {
  filter: BillingFilterType;
  customers: Customer[];
  onFilterChange: (filter: BillingFilterType) => void;
  onClearFilter: () => void;
}

const BillingFilter = ({
  filter,
  customers,
  onFilterChange,
  onClearFilter,
}: BillingFilterProps) => {
  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      searchTerm: event.target.value,
    });
  };

  // Handle customer change
  const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      customerId: event.target.value,
    });
  };

  // Handle status change
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      status: event.target.value,
    });
  };

  // Format date helper
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return dateString;
  };

  // Handle date from change
  const handleDateFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      dateRange: {
        ...filter.dateRange,
        from: event.target.value || undefined,
      },
    });
  };

  // Handle date to change
  const handleDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      dateRange: {
        ...filter.dateRange,
        to: event.target.value || undefined,
      },
    });
  };

  // Clear all filters
  const handleClearFilter = () => {
    onClearFilter();
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="h2">
            Filter Invoices
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {/* Search Field */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by invoice #, customer"
              value={filter.searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          {/* Customer Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Customer"
              value={filter.customerId || ''}
              onChange={handleCustomerChange}
              size="small"
            >
              <MenuItem value="">All Customers</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filter.status || ''}
              onChange={handleStatusChange}
              size="small"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={formatDateForInput(filter.dateRange.from)}
              onChange={handleDateFromChange}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={formatDateForInput(filter.dateRange.to)}
              onChange={handleDateToChange}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilter}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BillingFilter; 