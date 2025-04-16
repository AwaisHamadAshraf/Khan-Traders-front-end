import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Divider,
} from '@mui/material';
import { 
  BarChart, 
  Paid, 
  Inventory as InventoryIcon, 
  People, 
  Article 
} from '@mui/icons-material';
import SalesReport from '../components/reports/SalesReport';
import ProductsReport from '../components/reports/ProductsReport';
import CustomerReport from '../components/reports/CustomerReport';
import InventoryReport from '../components/reports/InventoryReport';
import { Product, Category, Supplier, Customer, Invoice } from '../types/models';
import { 
  getProducts, 
  getCategories, 
  getSuppliers 
} from '../services/inventoryService';
import { 
  getCustomers, 
  getInvoices 
} from '../services/billingService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `reports-tab-${index}`,
    'aria-controls': `reports-tabpanel-${index}`,
  };
};

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch all the data required for reports
      const productsData = getProducts();
      const categoriesData = getCategories();
      const suppliersData = getSuppliers();
      const customersData = getCustomers();
      const invoicesData = getInvoices();
      
      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setCustomers(customersData);
      setInvoices(invoicesData);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Article fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Reports & Analytics
          </Typography>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="Sales" 
            icon={<Paid />} 
            iconPosition="start" 
            {...a11yProps(0)} 
          />
          <Tab 
            label="Products" 
            icon={<BarChart />} 
            iconPosition="start" 
            {...a11yProps(1)} 
          />
          <Tab 
            label="Customers" 
            icon={<People />} 
            iconPosition="start" 
            {...a11yProps(2)} 
          />
          <Tab 
            label="Inventory" 
            icon={<InventoryIcon />} 
            iconPosition="start" 
            {...a11yProps(3)} 
          />
        </Tabs>
      </Paper>
      
      {isLoading ? (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Loading data...
          </Typography>
        </Box>
      ) : (
        <>
          <TabPanel value={activeTab} index={0}>
            <SalesReport invoices={invoices} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <ProductsReport products={products} invoices={invoices} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <CustomerReport customers={customers} invoices={invoices} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            <InventoryReport 
              products={products} 
              categories={categories} 
              suppliers={suppliers} 
            />
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default Reports; 