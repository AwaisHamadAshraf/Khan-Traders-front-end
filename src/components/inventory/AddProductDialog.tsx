import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { Category, Supplier, Product } from '../../types/models';

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  suppliers: Supplier[];
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onClose,
  onSave,
  categories,
  suppliers
}) => {
  // Use useMemo to prevent the object from being recreated on every render
  const initialProductState = useMemo(() => ({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    categoryId: '',
    supplierId: '',
    costPrice: 0,
    sellingPrice: 0,
    quantity: 0,
    minStockLevel: 0,
    unit: '',
    location: '',
    status: 'active' as const
  }), []);

  const [product, setProduct] = useState(initialProductState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setProduct(initialProductState);
      setErrors({});
    }
  }, [open, initialProductState]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (['costPrice', 'sellingPrice', 'quantity', 'minStockLevel'].includes(name)) {
      const numValue = parseFloat(value);
      setProduct(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!product.name.trim()) newErrors.name = 'Name is required';
    if (!product.sku.trim()) newErrors.sku = 'SKU is required';
    if (!product.unit.trim()) newErrors.unit = 'Unit is required';
    if (!product.categoryId) newErrors.categoryId = 'Category is required';
    
    // Numeric validations
    if (product.costPrice <= 0) newErrors.costPrice = 'Cost price must be greater than 0';
    if (product.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0';
    if (product.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (product.minStockLevel < 0) newErrors.minStockLevel = 'Min stock level cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(product);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleTextFieldChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={product.sku}
              onChange={handleTextFieldChange}
              error={!!errors.sku}
              helperText={errors.sku}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleTextFieldChange}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Barcode"
              name="barcode"
              value={product.barcode}
              onChange={handleTextFieldChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.categoryId} required>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={product.categoryId}
                onChange={handleSelectChange}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <FormHelperText>{errors.categoryId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                name="supplierId"
                value={product.supplierId}
                onChange={handleSelectChange}
                label="Supplier"
              >
                <MenuItem value="">None</MenuItem>
                {suppliers.map(supplier => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={product.unit}
              onChange={handleTextFieldChange}
              placeholder="e.g. kg, liter, piece"
              error={!!errors.unit}
              helperText={errors.unit}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
              Pricing & Inventory
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Cost Price"
              name="costPrice"
              value={product.costPrice}
              onChange={handleTextFieldChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
              error={!!errors.costPrice}
              helperText={errors.costPrice}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Selling Price"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleTextFieldChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Initial Quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleTextFieldChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Minimum Stock Level"
              name="minStockLevel"
              value={product.minStockLevel}
              onChange={handleTextFieldChange}
              error={!!errors.minStockLevel}
              helperText={errors.minStockLevel}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Storage Location"
              name="location"
              value={product.location}
              onChange={handleTextFieldChange}
              placeholder="e.g. Shelf A1"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={product.status}
                onChange={handleSelectChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="discontinued">Discontinued</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog; 