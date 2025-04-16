import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { Inventory, Category, Warning, NotificationsActive } from '@mui/icons-material';
import { Product, Category as CategoryType, Supplier } from '../../types/models';

interface InventoryReportProps {
  products: Product[];
  categories: CategoryType[];
  suppliers: Supplier[];
}

const InventoryReport: React.FC<InventoryReportProps> = ({ products, categories, suppliers }) => {
  const [sortBy, setSortBy] = useState<string>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [categoryId, setCategoryId] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (categoryId) {
      filtered = filtered.filter(product => product.categoryId === categoryId);
    }
    
    // Apply supplier filter
    if (supplierId) {
      filtered = filtered.filter(product => product.supplierId === supplierId);
    }
    
    // Apply stock status filter
    switch (stockFilter) {
      case 'in_stock':
        filtered = filtered.filter(product => product.quantity > product.minStockLevel);
        break;
      case 'low_stock':
        filtered = filtered.filter(product => product.quantity > 0 && product.quantity <= product.minStockLevel);
        break;
      case 'out_of_stock':
        filtered = filtered.filter(product => product.quantity === 0);
        break;
    }
    
    // Calculate additional metrics for each product
    const enhancedProducts = filtered.map(product => {
      const stockValue = product.quantity * product.costPrice;
      const retailValue = product.quantity * product.sellingPrice;
      const potentialProfit = retailValue - stockValue;
      const stockPercentage = product.minStockLevel > 0 
        ? Math.min(Math.round((product.quantity / product.minStockLevel) * 100), 100) 
        : 100;
      
      const category = categories.find(c => c.id === product.categoryId);
      const supplier = suppliers.find(s => s.id === product.supplierId);
      
      return {
        ...product,
        stockValue,
        retailValue,
        potentialProfit,
        stockPercentage,
        categoryName: category?.name || 'Uncategorized',
        supplierName: supplier?.name || 'Unknown Supplier',
      };
    });
    
    // Sort products
    return enhancedProducts.sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * multiplier;
        case 'quantity':
          return (a.quantity - b.quantity) * multiplier;
        case 'value':
          return (a.stockValue - b.stockValue) * multiplier;
        case 'retail':
          return (a.retailValue - b.retailValue) * multiplier;
        case 'profit':
          return (a.potentialProfit - b.potentialProfit) * multiplier;
        default:
          return (a.stockValue - b.stockValue) * multiplier;
      }
    });
  }, [products, categories, suppliers, categoryId, supplierId, stockFilter, sortBy, sortOrder]);
  
  // Calculate summary metrics
  const summary = useMemo(() => {
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalStockValue = products.reduce((sum, product) => sum + (product.quantity * product.costPrice), 0);
    const totalRetailValue = products.reduce((sum, product) => sum + (product.quantity * product.sellingPrice), 0);
    const potentialProfit = totalRetailValue - totalStockValue;
    
    const lowStockItems = products.filter(product => 
      product.quantity > 0 && product.quantity <= product.minStockLevel
    ).length;
    
    const outOfStockItems = products.filter(product => product.quantity === 0).length;
    
    return {
      totalProducts: products.length,
      totalItems,
      totalStockValue,
      totalRetailValue,
      potentialProfit,
      lowStockItems,
      outOfStockItems,
    };
  }, [products]);
  
  // Get stock status chip
  const getStockStatusChip = (product: Product & { stockPercentage: number }) => {
    if (product.quantity === 0) {
      return <Chip label={`${product.quantity} - Out of Stock`} color="error" size="small" icon={<Warning fontSize="small" />} />;
    } else if (product.quantity <= product.minStockLevel) {
      return <Chip label={`${product.quantity} - Low Stock`} color="warning" size="small" icon={<NotificationsActive fontSize="small" />} />;
    } else {
      return <Chip label={`${product.quantity} - In Stock`} color="success" size="small" />;
    }
  };
  
  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Inventory sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Inventory Analysis Report</Typography>
          </Box>
          
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  label="Supplier"
                >
                  <MenuItem value="">All Suppliers</MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  label="Stock Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="in_stock">In Stock</MenuItem>
                  <MenuItem value="low_stock">Low Stock</MenuItem>
                  <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="quantity">Quantity</MenuItem>
                  <MenuItem value="value">Stock Value</MenuItem>
                  <MenuItem value="retail">Retail Value</MenuItem>
                  <MenuItem value="profit">Potential Profit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  label="Order"
                >
                  <MenuItem value="desc">Highest First</MenuItem>
                  <MenuItem value="asc">Lowest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Summary Metrics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    Products
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {summary.totalProducts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    Total Items
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {summary.totalItems.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    Stock Value
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    Rs {summary.totalStockValue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    Retail Value
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    Rs {summary.totalRetailValue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    Low Stock
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, color: 'warning.main' }}>
                    {summary.lowStockItems}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    Out of Stock
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, color: 'error.main' }}>
                    {summary.outOfStockItems}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Inventory Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: 'grey.100' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Product</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Category</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Stock Level</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Quantity</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Cost Price</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Stock Value</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Retail Value</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {getStockStatusChip(product as any)}
                        <Tooltip 
                          title={`${product.quantity} / Min: ${product.minStockLevel}`} 
                          arrow
                          placement="top"
                        >
                          <Box sx={{ width: '100%', mt: 0.5 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(product as any).stockPercentage} 
                              color={
                                product.quantity === 0 
                                  ? 'error' 
                                  : product.quantity <= product.minStockLevel 
                                  ? 'warning' 
                                  : 'success'
                              }
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">Rs {product.costPrice.toLocaleString()}</TableCell>
                    <TableCell align="right">Rs {(product as any).stockValue.toLocaleString()}</TableCell>
                    <TableCell align="right">Rs {(product as any).retailValue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No products match the selected filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryReport; 