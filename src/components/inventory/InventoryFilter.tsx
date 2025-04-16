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
import { InventoryFilterType } from '../../types/filters';
import { Category, Supplier } from '../../types/models';

interface InventoryFilterProps {
  filter: InventoryFilterType;
  categories: Category[];
  suppliers: Supplier[];
  onFilterChange: (filter: InventoryFilterType) => void;
  onClearFilter: () => void;
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({
  filter,
  categories,
  suppliers,
  onFilterChange,
  onClearFilter,
}) => {
  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      searchTerm: event.target.value,
    });
  };

  // Handle category change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      categoryId: event.target.value,
    });
  };

  // Handle stock status change
  const handleStockStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      stock: event.target.value as 'all' | 'in_stock' | 'low_stock' | 'out_of_stock',
    });
  };

  // Handle supplier change
  const handleSupplierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      supplierId: event.target.value,
    });
  };

  // Handle min price change
  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFilterChange({
      ...filter,
      priceRange: {
        ...filter.priceRange,
        min: value,
      },
    });
  };

  // Handle max price change
  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onFilterChange({
      ...filter,
      priceRange: {
        ...filter.priceRange,
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
          <FilterIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="h2">
            Filter Inventory
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {/* Search Field */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search products"
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

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={filter.categoryId || ''}
              onChange={handleCategoryChange}
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Stock Status Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Stock Status"
              value={filter.stock}
              onChange={handleStockStatusChange}
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="in_stock">In Stock</MenuItem>
              <MenuItem value="low_stock">Low Stock</MenuItem>
              <MenuItem value="out_of_stock">Out of Stock</MenuItem>
            </TextField>
          </Grid>

          {/* Supplier Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Supplier"
              value={filter.supplierId || ''}
              onChange={handleSupplierChange}
              size="small"
            >
              <MenuItem value="">All Suppliers</MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Price Range Filter */}
          <Grid item xs={12} sm={3} md={1}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={filter.priceRange?.min || ''}
              onChange={handleMinPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3} md={1}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={filter.priceRange?.max || ''}
              onChange={handleMaxPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              size="small"
            />
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} sm={6} md={1}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleClearFilter}
              sx={{ height: '100%' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InventoryFilter; 