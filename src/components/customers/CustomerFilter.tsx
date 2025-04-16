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
import { CustomerFilterType } from '../../types/filters';

interface CustomerFilterProps {
  filter: CustomerFilterType;
  onFilterChange: (filter: CustomerFilterType) => void;
  onClearFilter: () => void;
}

const CustomerFilter: React.FC<CustomerFilterProps> = ({
  filter,
  onFilterChange,
  onClearFilter,
}) => {
  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      searchTerm: event.target.value,
    });
  };

  // Handle status change
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      status: event.target.value,
    });
  };

  // Handle balance range change
  const handleMinBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFilterChange({
      ...filter,
      balanceRange: {
        ...filter.balanceRange,
        min: value,
      },
    });
  };

  const handleMaxBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFilterChange({
      ...filter,
      balanceRange: {
        ...filter.balanceRange,
        max: value,
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
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2">
            Filter Customers
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {/* Search Field */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by name, contact, phone or email"
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
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>

          {/* Balance Range */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Balance"
              type="number"
              value={filter.balanceRange?.min || ''}
              onChange={handleMinBalanceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Max Balance"
              type="number"
              value={filter.balanceRange?.max || ''}
              onChange={handleMaxBalanceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
              size="small"
            />
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilter}
              sx={{ height: '100%' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomerFilter; 