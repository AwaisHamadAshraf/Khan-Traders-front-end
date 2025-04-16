import React, { useState } from 'react';
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
} from '@mui/material';
import { DateRange, BarChart, TrendingUp } from '@mui/icons-material';
import { Invoice } from '../../types/models';

interface SalesReportProps {
  invoices: Invoice[];
}

const SalesReport: React.FC<SalesReportProps> = ({ invoices }) => {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('day');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Generate report based on date range and grouping
  const handleGenerateReport = () => {
    let filtered = [...invoices];
    
    // Apply date filters
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(invoice => new Date(invoice.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(invoice => new Date(invoice.date) <= toDate);
    }
    
    setFilteredInvoices(filtered);
    setReportGenerated(true);
  };
  
  // Group sales data by the selected period
  const groupSalesData = () => {
    const groupedData: Record<string, { total: number, count: number }> = {};
    
    filteredInvoices.forEach(invoice => {
      const date = new Date(invoice.date);
      let groupKey: string;
      
      switch (groupBy) {
        case 'day':
          groupKey = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekNum = getWeekNumber(date);
          const year = date.getFullYear();
          groupKey = `${year}-W${weekNum}`;
          break;
        case 'month':
          groupKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case 'year':
          groupKey = `${date.getFullYear()}`;
          break;
        default:
          groupKey = date.toISOString().split('T')[0];
      }
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { total: 0, count: 0 };
      }
      
      groupedData[groupKey].total += invoice.total;
      groupedData[groupKey].count += 1;
    });
    
    return Object.entries(groupedData).map(([period, data]) => ({
      period,
      total: data.total,
      count: data.count,
    })).sort((a, b) => a.period.localeCompare(b.period));
  };
  
  // Helper function to get week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  // Format the period for display
  const formatPeriod = (period: string): string => {
    if (groupBy === 'day') {
      return new Date(period).toLocaleDateString();
    } else if (groupBy === 'week') {
      const [year, week] = period.split('-W');
      return `Week ${week}, ${year}`;
    } else if (groupBy === 'month') {
      const [year, month] = period.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    } else {
      return period;
    }
  };
  
  // Calculate report summary
  const calculateSummary = () => {
    if (!filteredInvoices.length) return { totalSales: 0, invoiceCount: 0, averageSale: 0 };
    
    const totalSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const invoiceCount = filteredInvoices.length;
    const averageSale = totalSales / invoiceCount;
    
    return { totalSales, invoiceCount, averageSale };
  };
  
  const summary = calculateSummary();
  const groupedData = reportGenerated ? groupSalesData() : [];
  
  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BarChart sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Sales Report</Typography>
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Group By</InputLabel>
                <Select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  label="Group By"
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateReport}
                startIcon={<DateRange />}
                sx={{ height: '100%' }}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
          
          {reportGenerated && (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Sales
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        Rs {summary.totalSales.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Invoices
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        {summary.invoiceCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Average Sale
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        Rs {summary.averageSale.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'grey.100' }}>
                    <TableRow>
                      <TableCell><Typography fontWeight="bold">Period</Typography></TableCell>
                      <TableCell align="right"><Typography fontWeight="bold">Invoices</Typography></TableCell>
                      <TableCell align="right"><Typography fontWeight="bold">Total Sales</Typography></TableCell>
                      <TableCell align="right"><Typography fontWeight="bold">Average</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedData.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell>{formatPeriod(row.period)}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">Rs {row.total.toLocaleString()}</TableCell>
                        <TableCell align="right">Rs {(row.total / row.count).toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                    {groupedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            No data available for the selected period
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalesReport; 