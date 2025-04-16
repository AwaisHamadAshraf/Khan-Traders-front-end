import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { FilterList, BarChart, LocalMall } from '@mui/icons-material';
import { Product, InvoiceItem, Invoice } from '../../types/models';

interface ProductsReportProps {
  products: Product[];
  invoices: Invoice[];
}

interface ProductSalesData {
  productId: string;
  productName: string;
  sku: string;
  categoryName?: string;
  quantity: number;
  revenue: number;
  costPrice: number;
  profit: number;
  profitMargin: number;
}

const ProductsReport: React.FC<ProductsReportProps> = ({ products, invoices }) => {
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);
  
  // Extract all categories from products
  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();
    products.forEach(product => {
      if (product.categoryId && product.categoryName) {
        categoryMap.set(product.categoryId, product.categoryName);
      }
    });
    return Array.from(categoryMap).map(([id, name]) => ({ id, name }));
  }, [products]);
  
  // Filter invoices by date range
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      result = result.filter(invoice => new Date(invoice.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59);
      result = result.filter(invoice => new Date(invoice.date) <= toDate);
    }
    
    return result;
  }, [invoices, dateFrom, dateTo]);
  
  // Calculate product sales data from invoices
  const productSalesData = useMemo(() => {
    const salesMap = new Map<string, ProductSalesData>();
    
    // Initialize with all products
    products.forEach(product => {
      if (!category || product.categoryId === category) {
        salesMap.set(product.id, {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          categoryName: product.categoryName,
          quantity: 0,
          revenue: 0,
          costPrice: product.costPrice,
          profit: 0,
          profitMargin: 0,
        });
      }
    });
    
    // Aggregate sales data from filtered invoices
    filteredInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && (!category || product.categoryId === category)) {
          const existing = salesMap.get(product.id);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.amount;
            const costAmount = item.quantity * product.costPrice;
            existing.profit += (item.amount - costAmount);
            existing.profitMargin = (existing.profit / existing.revenue) * 100;
          }
        }
      });
    });
    
    // Convert to array and sort
    return Array.from(salesMap.values())
      .filter(item => item.quantity > 0)  // Only include products with sales
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'quantity':
            return (a.quantity - b.quantity) * multiplier;
          case 'revenue':
            return (a.revenue - b.revenue) * multiplier;
          case 'profit':
            return (a.profit - b.profit) * multiplier;
          case 'margin':
            return (a.profitMargin - b.profitMargin) * multiplier;
          default:
            return (a.revenue - b.revenue) * multiplier;
        }
      })
      .slice(0, limit);
  }, [products, filteredInvoices, category, sortBy, sortOrder, limit]);
  
  // Calculate totals
  const totals = useMemo(() => {
    return productSalesData.reduce((acc, curr) => ({
      quantity: acc.quantity + curr.quantity,
      revenue: acc.revenue + curr.revenue,
      profit: acc.profit + curr.profit,
    }), { quantity: 0, revenue: 0, profit: 0 });
  }, [productSalesData]);
  
  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalMall sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Product Performance Report</Typography>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
            <Grid item xs={12} md={6} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="quantity">Quantity</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="profit">Profit</MenuItem>
                  <MenuItem value="margin">Profit Margin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={1}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  label="Order"
                >
                  <MenuItem value="desc">Desc</MenuItem>
                  <MenuItem value="asc">Asc</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={1}>
              <FormControl fullWidth size="small">
                <InputLabel>Limit</InputLabel>
                <Select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  label="Limit"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Report Summary */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Quantity Sold
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totals.quantity.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    Rs {totals.revenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Profit
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    Rs {totals.profit.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Product Performance Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.100' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Product</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">SKU</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Category</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Quantity</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Revenue</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Profit</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Margin</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productSalesData.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.categoryName || 'Uncategorized'}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">Rs {product.revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">Rs {product.profit.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${product.profitMargin.toFixed(1)}%`}
                        color={product.profitMargin > 20 ? 'success' : product.profitMargin > 10 ? 'info' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {productSalesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No product sales data available for the selected period
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

export default ProductsReport; 