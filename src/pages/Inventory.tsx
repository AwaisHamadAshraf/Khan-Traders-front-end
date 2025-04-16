import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon 
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import InventorySummary from '../components/inventory/InventorySummary';
import InventoryFilter from '../components/inventory/InventoryFilter';
import InventoryTable from '../components/inventory/InventoryTable';
import ProductDetailDialog from '../components/inventory/ProductDetailDialog';
import AddProductDialog from '../components/inventory/AddProductDialog';
import { 
  Product, 
  Category, 
  Supplier,
  InventoryTransaction
} from '../types/models';
import { InventoryFilterType, defaultInventoryFilter } from '../types/filters';
import { 
  getProducts, 
  getCategories, 
  getSuppliers,
  getInventoryTransactions,
  addProduct
} from '../services/inventoryService';

const Inventory: React.FC = () => {
  // Get location to access state from navigation
  const location = useLocation();
  
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Initialize filter based on location state or default
  const [filter, setFilter] = useState<InventoryFilterType>(() => {
    // Check if we have a filter parameter in the location state
    if (location.state && location.state.filter === 'low-stock') {
      return {
        ...defaultInventoryFilter,
        stock: 'low_stock'
      };
    }
    return defaultInventoryFilter;
  });
  
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productTransactions, setProductTransactions] = useState<InventoryTransaction[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Filter products when filter changes
  const applyFilters = useCallback(() => {
    const filteredProducts = getProducts(filter);
    setFilteredProducts(filteredProducts);
  }, [filter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Load all data from services
  const loadData = () => {
    const allProducts = getProducts();
    const allCategories = getCategories();
    const allSuppliers = getSuppliers();

    setProducts(allProducts);
    setCategories(allCategories);
    setSuppliers(allSuppliers);
  };

  // Reset filter to default
  const handleClearFilter = () => {
    setFilter(defaultInventoryFilter);
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: InventoryFilterType) => {
    setFilter(newFilter);
  };

  // Open product detail dialog
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    const transactions = getInventoryTransactions(product.id);
    setProductTransactions(transactions);
    setIsDetailDialogOpen(true);
  };

  // Close product detail dialog
  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProduct(null);
    setProductTransactions([]);
  };

  // Handlers
  const handleEditProduct = (product: Product) => {
    // In a real app, this would open a product edit form
    setSnackbar({
      open: true,
      message: 'Edit product functionality will be implemented in the next module.',
      severity: 'info',
    });
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    // In a real app, this would delete the product
    setSnackbar({
      open: true,
      message: 'Delete product functionality will be implemented in the next module.',
      severity: 'info',
    });
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleAddProduct = () => {
    setIsAddProductDialogOpen(true);
  };

  const handleCloseAddProductDialog = () => {
    setIsAddProductDialogOpen(false);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Add the new product
      const newProduct = addProduct(productData);
      
      // Update the products list
      setProducts(prevProducts => [...prevProducts, newProduct]);
      
      // Manually update the filtered products list to include the new product
      setFilteredProducts(prevFilteredProducts => [...prevFilteredProducts, newProduct]);
      
      // Close the dialog
      setIsAddProductDialogOpen(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Product "${newProduct.name}" added successfully!`,
        severity: 'success',
      });
    } catch (error) {
      // Show error message
      setSnackbar({
        open: true,
        message: `Error adding product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      {/* Inventory Summary */}
      <InventorySummary products={products} />

      {/* Inventory Filter */}
      <InventoryFilter 
        filter={filter}
        categories={categories}
        suppliers={suppliers}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />

      {/* Inventory Table */}
      <InventoryTable
        products={filteredProducts}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Add Product FAB for mobile */}
      <Fab
        color="primary"
        aria-label="add product"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' },
        }}
        onClick={handleAddProduct}
      >
        <AddIcon />
      </Fab>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <ProductDetailDialog
          open={isDetailDialogOpen}
          product={selectedProduct}
          transactions={productTransactions}
          onClose={handleCloseDetailDialog}
        />
      )}

      {/* Add Product Dialog */}
      <AddProductDialog
        open={isAddProductDialogOpen}
        onClose={handleCloseAddProductDialog}
        onSave={handleSaveProduct}
        categories={categories}
        suppliers={suppliers}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{productToDelete?.name}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteProduct} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory; 