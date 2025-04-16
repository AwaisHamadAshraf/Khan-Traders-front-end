import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Product, InventoryTransaction } from '../../types/models';
import { getCategoryNameById, getSupplierNameById } from '../../services/inventoryService';

interface ProductDetailDialogProps {
  open: boolean;
  product: Product | null;
  transactions: InventoryTransaction[];
  onClose: () => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  product,
  transactions,
  onClose,
}) => {
  if (!product) return null;

  // Get stock status
  const getStockStatus = () => {
    if (product.quantity === 0) {
      return { label: `${product.quantity} - Out of Stock`, color: 'error' as const, textColor: '#d32f2f' };
    } else if (product.quantity <= product.minStockLevel) {
      return { label: `${product.quantity} - Low Stock`, color: 'warning' as const, textColor: '#ff9800' };
    } else {
      return { label: `${product.quantity} - In Stock`, color: 'success' as const, textColor: '#0d6e0d' };
    }
  };

  const stockStatus = getStockStatus();

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Product Details</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3}>
          {/* Product Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={product.imageUrl}
                variant="rounded"
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
                <Chip
                  label={stockStatus.label}
                  color={stockStatus.color}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Product Description */}
          <Grid item xs={12}>
            <Typography variant="body1">{product.description}</Typography>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              General Information
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                '& > div': {
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">
                  {getCategoryNameById(product.categoryId || '')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Supplier
                </Typography>
                <Typography variant="body1">
                  {getSupplierNameById(product.supplierId || '')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">{product.location || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Batch Number
                </Typography>
                <Typography variant="body1">N/A</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Expiry Date
                </Typography>
                <Typography variant="body1">
                  {product.expiryDate ? formatDate(product.expiryDate) : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date Added
                </Typography>
                <Typography variant="body1">{formatDate(product.createdAt)}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Stock Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Stock Information
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                '& > div': {
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Stock
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', color: stockStatus.textColor }}
                >
                  {product.quantity} units
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Minimum Stock Level
                </Typography>
                <Typography variant="body1">{product.minStockLevel} units</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Selling Price
                </Typography>
                <Typography variant="body1">Rs {product.sellingPrice.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cost Price
                </Typography>
                <Typography variant="body1">Rs {product.costPrice.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Profit Margin
                </Typography>
                <Typography variant="body1">
                  Rs {(product.sellingPrice - product.costPrice).toLocaleString()} (
                  {Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100)}%)
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
                <Typography variant="body1">
                  Rs {(product.sellingPrice * product.quantity).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
              Recent Transactions
            </Typography>
            {transactions.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            color={
                              transaction.type === 'purchase' || transaction.type === 'return'
                                ? 'success'
                                : transaction.type === 'sale'
                                ? 'primary'
                                : 'default'
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {transaction.type === 'purchase' || transaction.type === 'return'
                            ? '+'
                            : ''}
                          {transaction.quantity}
                        </TableCell>
                        <TableCell>{transaction.referenceNumber || 'N/A'}</TableCell>
                        <TableCell>{transaction.notes || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent transactions found for this product.
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog; 