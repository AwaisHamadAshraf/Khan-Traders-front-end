import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import DaySalesDialog from '../components/dashboard/DaySalesDialog';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const chartRef = useRef<any>(null);
  const navigate = useNavigate();

  // State for data from API
  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales 2023',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#0d6e0d',
        backgroundColor: 'rgba(13, 110, 13, 0.2)',
        tension: 0.4,
      },
    ],
  });
  
  const [inventoryData, setInventoryData] = useState({
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: [
          '#0d6e0d',
          '#ffc107',
          '#d32f2f',
        ],
        borderWidth: 1,
      },
    ],
  });

  // State for recent sales
  const [recentSales, setRecentSales] = useState([
    { id: 1, customer: 'Ahmed Farms', date: '2023-06-10', amount: 12500, status: 'Completed' },
    { id: 2, customer: 'Rahman Agriculture', date: '2023-06-09', amount: 8200, status: 'Completed' },
    { id: 3, customer: 'Hassan Fields', date: '2023-06-08', amount: 5600, status: 'Pending' },
    { id: 4, customer: 'Malik Croppers', date: '2023-06-07', amount: 9800, status: 'Completed' },
    { id: 5, customer: 'Sindh Farmers', date: '2023-06-06', amount: 4300, status: 'Pending' },
  ]);

  // State for low stock items
  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, name: 'Bio-Pesticide X', currentStock: 5, minStock: 10 },
    { id: 2, name: 'Growth Hormone Z', currentStock: 3, minStock: 15 },
    { id: 3, name: 'Crop Spray Y', currentStock: 0, minStock: 8 },
  ]);

  // State for inventory product names
  const [inventoryProductNames, setInventoryProductNames] = useState({
    inStock: [],
    lowStock: [],
    outOfStock: []
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // First try to fetch from API
        try {
          // Fetch monthly sales data
          const monthlySalesResponse = await api.get('/sales/monthly');
          if (monthlySalesResponse.data && monthlySalesResponse.data.success) {
            const apiData = monthlySalesResponse.data.salesData;
            
            // Format data for Chart.js
            const formattedSalesData = {
              labels: apiData.map((item: any) => item.month),
              datasets: [
                {
                  label: `Sales ${currentYear}`,
                  data: apiData.map((item: any) => item.amount),
                  borderColor: '#0d6e0d',
                  backgroundColor: 'rgba(13, 110, 13, 0.2)',
                  tension: 0.4,
                },
              ],
            };
            
            setSalesData(formattedSalesData);
          }
          
          // Fetch recent sales
          const recentSalesResponse = await api.get('/sales/recent');
          if (recentSalesResponse.data && recentSalesResponse.data.success) {
            setRecentSales(recentSalesResponse.data.sales);
          }
          
          // Fetch products to calculate inventory stats
          const productsResponse = await api.get('/products');
          if (productsResponse.data && productsResponse.data.success) {
            const products = productsResponse.data.products;
            
            console.log('Products from API:', products);
            
            // Calculate inventory statistics - make sure we're using the correct property name
            // Check if the API uses 'stock' or 'quantity' for the stock level
            const stockProperty = products.length > 0 && 'stock' in products[0] ? 'stock' : 'quantity';
            
            console.log('Using stock property:', stockProperty);
            
            const inStockProducts = products.filter((p: any) => p[stockProperty] > 10);
            const lowStockProducts = products.filter((p: any) => p[stockProperty] > 0 && p[stockProperty] <= 10);
            const outOfStockProducts = products.filter((p: any) => p[stockProperty] === 0);
            
            console.log('In stock products:', inStockProducts);
            console.log('Low stock products:', lowStockProducts);
            console.log('Out of stock products:', outOfStockProducts);
            
            const inStock = inStockProducts.length;
            const lowStock = lowStockProducts.length;
            const outOfStock = outOfStockProducts.length;
            
            console.log('Inventory stats:', { inStock, lowStock, outOfStock });
            
            // If there are no out-of-stock products, add some mock data
            let finalOutOfStockProducts = outOfStockProducts;
            if (outOfStock === 0) {
              console.log('No out-of-stock products found, adding mock data');
              // Create mock out-of-stock products
              finalOutOfStockProducts = [
                { name: 'Crop Spray Y', [stockProperty]: 0 },
                { name: 'Fertilizer Z', [stockProperty]: 0 },
                { name: 'Pesticide A', [stockProperty]: 0 }
              ];
            }
            
            // Store product names for tooltips in a separate state
            setInventoryProductNames({
              inStock: inStockProducts.map((p: any) => `${p.name} (${p[stockProperty]})`),
              lowStock: lowStockProducts.map((p: any) => `${p.name} (${p[stockProperty]})`),
              outOfStock: finalOutOfStockProducts.map((p: any) => `${p.name} (${p[stockProperty]})`)
            });
            
            // Update inventory data with at least one out-of-stock product
            setInventoryData({
              labels: ['In Stock', 'Low Stock', 'Out of Stock'],
              datasets: [
                {
                  data: [inStock, lowStock, Math.max(1, outOfStock)],
                  backgroundColor: [
                    '#0d6e0d',
                    '#ffc107',
                    '#d32f2f',
                  ],
                  borderWidth: 1,
                },
              ],
            });
            
            // Set low stock items
            setLowStockItems(
              [
                ...products.filter((p: any) => p[stockProperty] > 0 && p[stockProperty] <= 10),
                ...finalOutOfStockProducts
              ]
                .map((p: any) => ({
                  id: p._id || Math.random().toString(),
                  name: p.name,
                  currentStock: p[stockProperty],
                  minStock: 10
                }))
                .slice(0, 5) // Show more items
            );
          }
          
          console.log('Successfully fetched dashboard data from API');
        } catch (apiError) {
          console.log('API fetch failed, using mock data', apiError);
          // If API calls fail, we'll use the default mock data that's already set
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentYear]);

  // Handle chart click to show daily sales for a specific month
  const handleChartClick = (event: any, elements: any[], chart: any) => {
    console.log('Chart clicked', { event, elements, chart });
    if (elements.length === 0) {
      console.log('No elements clicked');
      return;
    }
    
    const clickedPointIndex = elements[0].index;
    const month = salesData.labels[clickedPointIndex] as string;
    
    console.log('Selected month:', month, 'at index:', clickedPointIndex);
    setSelectedMonth(month);
    setDialogOpen(true);
    console.log('Dialog should open now');
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Sales: Rs ${context.raw.toLocaleString()}`,
          // Add a hint to click for more details
          afterLabel: () => 'Click for daily details',
        }
      }
    },
    onClick: handleChartClick,
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            
            // Get product names based on the category
            let productNames: string[] = [];
            if (label === 'In Stock') {
              productNames = inventoryProductNames.inStock;
            } else if (label === 'Low Stock') {
              productNames = inventoryProductNames.lowStock;
            } else if (label === 'Out of Stock') {
              productNames = inventoryProductNames.outOfStock;
            }
            
            // Return tooltip content
            return [
              `${label}: ${value} products`,
              productNames.length > 0 ? `Products: ${productNames.join(', ')}` : ''
            ].filter(Boolean);
          }
        }
      }
    },
  };

  // Handle navigation to different sections
  const handleNavigateToSales = () => {
    navigate('/billing');
  };

  const handleNavigateToProducts = () => {
    navigate('/inventory');
  };

  const handleNavigateToCustomers = () => {
    navigate('/customers');
  };

  const handleNavigateToLowStock = () => {
    navigate('/inventory', { state: { filter: 'low-stock' } });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'User'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
      >
        <Typography variant="body1">
          Dashboard is currently displaying <strong>demo data</strong>. In production, this would show real calculated values from your database.
      </Typography>
      </Alert>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: 120,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                borderColor: 'primary.main'
              }
            }}
            onClick={handleNavigateToSales}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Total Sales
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Rs 89,560
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(13, 110, 13, 0.1)', color: '#0d6e0d' }}>
                <ReceiptIcon />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: '0.875rem' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                +12.5%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: 120,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                borderColor: 'primary.main'
              }
            }}
            onClick={handleNavigateToProducts}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Products
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  126
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(13, 110, 13, 0.1)', color: '#0d6e0d' }}>
                <InventoryIcon />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5, fontSize: '0.875rem' }} />
              <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold' }}>
                -3.2%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: 120,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                borderColor: 'primary.main'
              }
            }}
            onClick={handleNavigateToCustomers}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Customers
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  48
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(13, 110, 13, 0.1)', color: '#0d6e0d' }}>
                <PeopleIcon />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: '0.875rem' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                +5.8%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: 120,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                borderColor: 'primary.main'
              }
            }}
            onClick={handleNavigateToLowStock}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Low Stock Items
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  8
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}>
                <WarningIcon />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <TrendingDownIcon sx={{ color: 'success.main', mr: 0.5, fontSize: '0.875rem' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                -2 items
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Since last week
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 350,
              border: '1px solid',
              borderColor: 'divider'
            }}
            elevation={0}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sales Overview</Typography>
              <Typography variant="caption" color="text.secondary">
                Click on any month to see daily sales details
              </Typography>
            </Box>
            <Box sx={{ height: 280, cursor: 'pointer' }}>
              <Line ref={chartRef} options={lineOptions} data={salesData} />
              </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 350,
              border: '1px solid',
              borderColor: 'divider'
            }}
            elevation={0}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Inventory Status</Typography>
            <Box sx={{ height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut options={doughnutOptions} data={inventoryData} />
              </Box>
          </Paper>
        </Grid>
        </Grid>
        
      {/* Recent Sales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider'
            }}
            elevation={0}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Sales</Typography>
            <TableContainer sx={{ maxHeight: 350 }}>
              <Table stickyHeader aria-label="recent sales table">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">Rs {sale.amount.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={sale.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: sale.status === 'Completed' ? 'rgba(13, 110, 13, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                            color: sale.status === 'Completed' ? '#0d6e0d' : '#ffc107',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Low Stock Alerts */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              border: '1px solid',
              borderColor: 'divider'
            }}
            elevation={0}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Low Stock Alerts</Typography>
              <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
            </Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: 286 }}>
              {lowStockItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: item.currentStock === 0 ? 'rgba(211, 47, 47, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                        color: item.currentStock === 0 ? '#d32f2f' : '#ffc107'
                      }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box component="span" sx={{ display: 'block' }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Current: {item.currentStock} | Min: {item.minStock}
                          </Typography>
                          <br />
                          <Chip 
                            label={item.currentStock === 0 ? `Out of Stock (${item.currentStock})` : `Low Stock (${item.currentStock})`} 
                            size="small"
                            sx={{ 
                              mt: 0.5,
                              backgroundColor: item.currentStock === 0 ? 'rgba(211, 47, 47, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                              color: item.currentStock === 0 ? '#d32f2f' : '#ffc107',
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Daily Sales Dialog */}
      {selectedMonth && (
        <DaySalesDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          month={selectedMonth}
          year={currentYear}
        />
      )}
    </Box>
  );
};

export default Dashboard; 