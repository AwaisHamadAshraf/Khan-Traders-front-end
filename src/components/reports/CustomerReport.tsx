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
  Avatar,
} from '@mui/material';
import { Assignment, People, AttachMoney } from '@mui/icons-material';
import { Customer, Invoice } from '../../types/models';

interface CustomerReportProps {
  customers: Customer[];
  invoices: Invoice[];
}

interface CustomerSalesData {
  customerId: string;
  customerName: string;
  totalPurchases: number;
  invoiceCount: number;
  avgPurchaseValue: number;
  lastPurchaseDate?: string;
  status: string;
  outstandingBalance: number;
}

const CustomerReport: React.FC<CustomerReportProps> = ({ customers, invoices }) => {
  const [sortBy, setSortBy] = useState<string>('totalPurchases');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);
  
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
  
  // Calculate customer sales data
  const customerSalesData = useMemo(() => {
    const salesMap = new Map<string, CustomerSalesData>();
    
    // Initialize with all customers
    customers.forEach(customer => {
      if (!status || customer.status === status) {
        salesMap.set(customer.id, {
          customerId: customer.id,
          customerName: customer.name,
          totalPurchases: 0,
          invoiceCount: 0,
          avgPurchaseValue: 0,
          lastPurchaseDate: undefined,
          status: customer.status,
          outstandingBalance: customer.outstandingBalance || 0,
        });
      }
    });
    
    // Aggregate sales data from filtered invoices
    filteredInvoices.forEach(invoice => {
      const customer = customers.find(c => c.id === invoice.customerId);
      if (customer && (!status || customer.status === status)) {
        const existing = salesMap.get(customer.id);
        if (existing) {
          existing.totalPurchases += invoice.total;
          existing.invoiceCount += 1;
          existing.avgPurchaseValue = existing.totalPurchases / existing.invoiceCount;
          
          // Track the last purchase date
          if (!existing.lastPurchaseDate || new Date(invoice.date) > new Date(existing.lastPurchaseDate)) {
            existing.lastPurchaseDate = invoice.date;
          }
        }
      }
    });
    
    // Convert to array and sort
    return Array.from(salesMap.values())
      .filter(item => item.invoiceCount > 0)  // Only include customers with purchases
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'totalPurchases':
            return (a.totalPurchases - b.totalPurchases) * multiplier;
          case 'invoiceCount':
            return (a.invoiceCount - b.invoiceCount) * multiplier;
          case 'avgPurchaseValue':
            return (a.avgPurchaseValue - b.avgPurchaseValue) * multiplier;
          case 'lastPurchaseDate':
            if (a.lastPurchaseDate && b.lastPurchaseDate) {
              return (new Date(a.lastPurchaseDate).getTime() - new Date(b.lastPurchaseDate).getTime()) * multiplier;
            }
            return 0;
          case 'outstandingBalance':
            return (a.outstandingBalance - b.outstandingBalance) * multiplier;
          default:
            return (a.totalPurchases - b.totalPurchases) * multiplier;
        }
      })
      .slice(0, limit);
  }, [customers, filteredInvoices, status, sortBy, sortOrder, limit]);
  
  // Calculate totals
  const totals = useMemo(() => {
    return customerSalesData.reduce((acc, curr) => ({
      totalPurchases: acc.totalPurchases + curr.totalPurchases,
      invoiceCount: acc.invoiceCount + curr.invoiceCount,
      outstandingBalance: acc.outstandingBalance + curr.outstandingBalance,
    }), { totalPurchases: 0, invoiceCount: 0, outstandingBalance: 0 });
  }, [customerSalesData]);
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <People sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Customer Analysis Report</Typography>
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
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
                  <MenuItem value="totalPurchases">Total Purchases</MenuItem>
                  <MenuItem value="invoiceCount">Invoice Count</MenuItem>
                  <MenuItem value="avgPurchaseValue">Avg Purchase Value</MenuItem>
                  <MenuItem value="lastPurchaseDate">Last Purchase Date</MenuItem>
                  <MenuItem value="outstandingBalance">Outstanding Balance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
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
            <Grid item xs={12} sm={6} md={1}>
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
                    Total Sales
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    Rs {totals.totalPurchases.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Invoices
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totals.invoiceCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Outstanding Balance
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    Rs {totals.outstandingBalance.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Customer Analysis Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.100' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Customer</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Total Purchases</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Invoices</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Avg Purchase</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Last Purchase</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Outstanding</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerSalesData.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30, mr: 1, fontSize: '0.875rem' }}>
                          {customer.customerName.charAt(0)}
                        </Avatar>
                        {customer.customerName}
                      </Box>
                    </TableCell>
                    <TableCell align="right">Rs {customer.totalPurchases.toLocaleString()}</TableCell>
                    <TableCell align="right">{customer.invoiceCount}</TableCell>
                    <TableCell align="right">Rs {customer.avgPurchaseValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>{formatDate(customer.lastPurchaseDate)}</TableCell>
                    <TableCell align="right">
                      {customer.outstandingBalance > 0 ? (
                        <Typography color="error.main">Rs {customer.outstandingBalance.toLocaleString()}</Typography>
                      ) : (
                        'Rs 0'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status === 'active' ? 'Active' : 'Inactive'}
                        color={customer.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {customerSalesData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No customer data available for the selected period
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

export default CustomerReport; 