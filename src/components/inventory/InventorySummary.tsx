import React from 'react';
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { Product } from '../../types/models';

interface InventorySummaryProps {
  products: Product[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ products }) => {
  // Calculate statistics
  const totalProducts = products.length;
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockItems = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.minStockLevel
  ).length;
  const outOfStockItems = products.filter((product) => product.quantity === 0).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.sellingPrice * product.quantity,
    0
  );

  // Summary cards
  const summaryCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <InventoryIcon />,
      color: '#0d6e0d',
      bgColor: 'rgba(13, 110, 13, 0.1)',
    },
    {
      title: 'Total Items',
      value: totalItems,
      icon: <ShoppingCartIcon />,
      color: '#1976d2',
      bgColor: 'rgba(25, 118, 210, 0.1)',
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems,
      icon: <WarningIcon />,
      color: '#ff9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
    },
    {
      title: 'Out of Stock Items',
      value: outOfStockItems,
      icon: <ErrorIcon />,
      color: '#d32f2f',
      bgColor: 'rgba(211, 47, 47, 0.1)',
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
                {card.value.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
            bgcolor: 'primary.light',
            color: 'white',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1">Total Inventory Value</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              Rs {totalValue.toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InventorySummary; 