import React from 'react';
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import {
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';

interface BillingSummaryProps {
  totalSales: number;
  totalOutstanding: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

const BillingSummary = ({
  totalSales,
  totalOutstanding,
  totalInvoices,
  paidInvoices,
  pendingInvoices,
  overdueInvoices,
}: BillingSummaryProps) => {
  // Summary cards
  const summaryCards = [
    {
      title: 'Total Sales',
      value: `Rs ${totalSales.toLocaleString()}`,
      icon: <AttachMoneyIcon />,
      color: '#0d6e0d',
      bgColor: 'rgba(13, 110, 13, 0.1)',
    },
    {
      title: 'Outstanding Balance',
      value: `Rs ${totalOutstanding.toLocaleString()}`,
      icon: <AccountBalanceIcon />,
      color: '#f57c00',
      bgColor: 'rgba(245, 124, 0, 0.1)',
    },
    {
      title: 'Total Invoices',
      value: totalInvoices.toString(),
      icon: <ReceiptIcon />,
      color: '#1976d2',
      bgColor: 'rgba(25, 118, 210, 0.1)',
    },
    {
      title: 'This Month',
      value: `${paidInvoices} Paid / ${pendingInvoices} Pending`,
      icon: <CalendarTodayIcon />,
      color: '#9c27b0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {summaryCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Avatar
              sx={{
                backgroundColor: card.bgColor,
                color: card.color,
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              {card.icon}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {card.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <Typography variant="body2">Paid Invoices</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {paidInvoices}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <Typography variant="body2">Pending Invoices</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {pendingInvoices}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
                <Typography variant="body2">Overdue Invoices</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {overdueInvoices}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BillingSummary; 