import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions,
  ChartData,
  ScriptableContext
} from 'chart.js';
import { getTotalRevenue } from '../../services/billingService';
import api from '../../utils/api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DailySale {
  date: string;
  total: number;
}

interface DaySalesDialogProps {
  open: boolean;
  onClose: () => void;
  month: string;
  year: number;
}

const DaySalesDialog: React.FC<DaySalesDialogProps> = ({ open, onClose, month, year }) => {
  const [tabValue, setTabValue] = useState(0);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthName, setMonthName] = useState('');
  const [monthIndex, setMonthIndex] = useState(-1);

  useEffect(() => {
    console.log('DaySalesDialog useEffect triggered:', { open, month, year });
    if (open) {
      setIsLoading(true);
      // Convert month name to number (1-12)
      const monthIdx = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
      console.log('Month index:', monthIdx, 'for month:', month);
      
      if (monthIdx !== -1) {
        // Set month name for display
        setMonthName(new Date(year, monthIdx).toLocaleString('default', { month: 'long' }));
        setMonthIndex(monthIdx);
        
        // First try to fetch from API
        const fetchDailySales = async () => {
          try {
            console.log('Fetching data from API for month:', month);
            const response = await api.get(`/sales/daily/${month}`);
            
            if (response.data && response.data.success) {
              const apiData = response.data.salesData;
              console.log('API data received:', apiData);
              
              // Convert API data to expected format
              const formattedData = apiData.map((item: any) => {
                // Create a proper date string from the day number
                const date = new Date(year, monthIdx, item.day).toISOString().split('T')[0];
                return {
                  date,
                  total: item.amount
                };
              });
              
              console.log('Formatted data:', formattedData);
              setDailySales(formattedData);
              console.log('Successfully fetched daily sales data from API');
            } else {
              console.log('API response not successful:', response.data);
              throw new Error('API response not successful');
            }
          } catch (error) {
            console.log('Error fetching daily sales from API, using mock data', error);
            
            // Fallback to mock data
            try {
              const dailySalesData = getTotalRevenue('daily');
              console.log('Mock data from getTotalRevenue:', dailySalesData);
              
              // Filter by month
              const filteredData = dailySalesData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === monthIdx && itemDate.getFullYear() === year;
              });
              
              console.log('Filtered mock data for month', month, ':', filteredData);
              
              // If no data was found or filtered, create some mock data
              if (filteredData.length === 0) {
                console.log('No matching data found in getTotalRevenue, creating explicit mock data');
                
                // Get days in month
                const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
                
                // Create mock data with random sales for each day
                const mockDailySales = Array.from({ length: daysInMonth }, (_, i) => {
                  // Random sales amount between 100 and 5000
                  const randomSales = Math.floor(Math.random() * 4900) + 100;
                  // Some days will have zero sales
                  const amount = Math.random() < 0.2 ? 0 : randomSales;
                  
                  // Create a date string for the current day
                  const dayNum = i + 1;
                  const date = new Date(year, monthIdx, dayNum).toISOString().split('T')[0];
                  
                  return {
                    date,
                    total: amount
                  };
                });
                
                console.log('Created explicit mock data:', mockDailySales);
                setDailySales(mockDailySales);
              } else {
                setDailySales(filteredData);
              }
            } catch (mockError) {
              console.error('Error with mock data fallback:', mockError);
              // Create very basic mock data as a last resort
              const basicMockData = [
                { date: new Date(year, monthIdx, 15).toISOString().split('T')[0], total: 3500 }
              ];
              setDailySales(basicMockData);
            }
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchDailySales();
      } else {
        console.log('Invalid month:', month);
        setIsLoading(false);
      }
    }
  }, [open, month, year]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Define chart options with proper typing
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Check if context.raw exists and handle both object format and primitive format
            const rawValue = context.raw;
            let value = 0;
            
            if (typeof rawValue === 'object' && rawValue !== null && 'y' in rawValue) {
              value = Number(rawValue.y);
            } else if (rawValue !== undefined) {
              value = Number(rawValue);
            }
            
            // Only show sales data for days with actual sales
            if (value <= 0.1) return 'No sales recorded'; 
            return `Sales: Rs ${value.toLocaleString()}`;
          },
          title: (tooltipItems) => {
            const dayNum = tooltipItems[0].label;
            return `${monthName} ${dayNum}, ${year}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day of Month',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 10
        },
        ticks: {
          callback: (value) => `Day ${value}`, // Show "Day X" for clarity
          font: {
            weight: 'bold',
            size: 12
          },
          color: '#333',
          maxRotation: 0 // Keep labels horizontal
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        border: {
          display: true,
          width: 2,
          color: 'rgba(0, 0, 0, 0.3)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales Amount (Rs)',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 10
        },
        beginAtZero: true,
        min: 0, // Ensure axis starts at 0
        ticks: {
          callback: (value) => {
            // Format based on value size for better readability
            const numValue = Number(value);
            // Skip negative values or very small values
            if (numValue <= 0) return '';
            
            if (numValue >= 10000) {
              return `Rs ${(numValue / 1000).toFixed(0)}K`; // Show as "Rs 10K" instead of "Rs 10,000"
            } else if (numValue >= 1000) {
              return `Rs ${(numValue / 1000).toFixed(1)}K`; // Show as "Rs 1.5K"
            } else {
              // Only show whole numbers, not decimals
              return `Rs ${Math.round(numValue)}`;
            }
          },
          font: {
            size: 12
          },
          color: '#333',
          precision: 0 // Avoid decimal places
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        border: {
          display: true,
          width: 2,
          color: 'rgba(0, 0, 0, 0.3)'
        }
      }
    }
  };

  // Generate full month days array for x-axis (if needed)
  const generateFullMonthData = (): ChartData<'line'> => {
    console.log('Generating chart data with daily sales:', dailySales);
    // Create array with all days of the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    console.log('Days in month:', daysInMonth, 'allDays:', allDays);
    
    // Generate data for all days, ensuring positive values
    const allData = allDays.map(day => {
      const matchingDay = dailySales.find(sale => 
        new Date(sale.date).getDate() === day);
      
      // Use actual value if exists, otherwise use a small value that's almost invisible
      const value = matchingDay ? matchingDay.total : 0.01;  // Use 0.01 for days with no sales
      return value;
    });
    
    console.log('Generated chart data:', allData);
    
    return {
      labels: allDays,
      datasets: [{
        label: 'Daily Sales',
        data: allData,
        borderColor: '#0d6e0d',
        backgroundColor: 'rgba(13, 110, 13, 0.2)',
        tension: 0.4,
        pointRadius: (ctx: ScriptableContext<'line'>) => {
          // Only show points for days with actual sales
          const value = Number(ctx.raw);
          return value > 0.1 ? 6 : 0; // Hide points for days with no sales
        },
        pointHoverRadius: 8,
        pointBackgroundColor: '#0d6e0d',
        fill: true
      }]
    };
  };

  // Use the function to get complete month data for the chart
  const chartData = generateFullMonthData();

  // Calculate total sales for the month
  const totalMonthlySales = dailySales.reduce((sum, item) => sum + item.total, 0);
  
  // Find the day with highest sales
  const highestSalesDay = dailySales.length > 0 
    ? dailySales.reduce((prev, current) => (prev.total > current.total) ? prev : current) 
    : null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{`${monthName} ${year} Sales Details`}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Chart View" />
                <Tab label="Table View" />
                <Tab label="Summary" />
              </Tabs>
            </Box>
            
            {/* Chart View */}
            {tabValue === 0 && (
              <Box sx={{ height: 400, mb: 3 }}>
                <Line options={chartOptions} data={chartData} />
              </Box>
            )}
            
            {/* Table View */}
            {tabValue === 1 && (
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Sales Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dailySales.map((sale) => (
                      <TableRow key={sale.date} hover>
                        <TableCell>
                          {new Date(sale.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          Rs {sale.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Summary View */}
            {tabValue === 2 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Monthly Sales Summary</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Total Sales for {monthName}</Typography>
                  <Typography variant="h4" color="primary">
                    Rs {totalMonthlySales.toLocaleString()}
                  </Typography>
                </Box>
                
                {highestSalesDay && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">Highest Sales Day</Typography>
                    <Typography variant="body1">
                      {new Date(highestSalesDay.date).toLocaleDateString()} - 
                      <strong> Rs {highestSalesDay.total.toLocaleString()}</strong>
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Daily Average</Typography>
                  <Typography variant="body1">
                    Rs {(totalMonthlySales / dailySales.length).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>Distribution</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Number of days with sales</Typography>
                  <Typography variant="body2">{dailySales.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Number of days without sales</Typography>
                  <Typography variant="body2">
                    {new Date(year, monthIndex + 1, 0).getDate() - dailySales.length}
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DaySalesDialog; 