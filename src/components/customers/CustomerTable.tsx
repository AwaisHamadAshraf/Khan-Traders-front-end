import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Customer } from '../../types/models';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewHistory: (customer: Customer) => void;
}

// Define the table columns
interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name', numeric: false, sortable: true },
  { id: 'contactPerson', label: 'Contact Person', numeric: false, sortable: true },
  { id: 'phone', label: 'Phone', numeric: false, sortable: true },
  { id: 'email', label: 'Email', numeric: false, sortable: true },
  { id: 'outstandingBalance', label: 'Outstanding', numeric: true, sortable: true },
  { id: 'status', label: 'Status', numeric: false, sortable: true },
  { id: 'actions', label: 'Actions', numeric: false, sortable: false },
];

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onView,
  onEdit,
  onDelete,
  onViewHistory,
}) => {
  // State for pagination and sorting
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Handle sort request
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort customers
  const sortedCustomers = React.useMemo(() => {
    return [...customers].sort((a, b) => {
      const aValue = a[orderBy as keyof Customer];
      const bValue = b[orderBy as keyof Customer];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [customers, order, orderBy]);

  // Calculate empty rows
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - customers.length)
    : 0;

  // Get status chip color
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'success' as const, textColor: '#0d6e0d' };
      case 'inactive':
        return { label: 'Inactive', color: 'error' as const, textColor: '#d32f2f' };
      default:
        return { label: status, color: 'default' as const, textColor: '#757575' };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {headCell.sortable ? (
                      <Box
                        component="span"
                        onClick={() => handleRequestSort(headCell.id)}
                        sx={{ 
                          cursor: 'pointer',
                          userSelect: 'none',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={{ ml: 0.5 }}>
                            {order === 'asc' ? '↑' : '↓'}
                          </Box>
                        ) : null}
                      </Box>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => {
                  const statusChip = getStatusChip(customer.status);
                  
                  return (
                    <TableRow
                      hover
                      key={customer.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.contactPerson || '-'}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            color: (customer.outstandingBalance || 0) > 0 ? 'error.main' : 'inherit',
                          }}
                        >
                          {(customer.outstandingBalance || 0) > 0
                            ? `Rs ${customer.outstandingBalance?.toLocaleString()}`
                            : 'Rs 0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusChip.label}
                          color={statusChip.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onView(customer)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Customer">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onEdit(customer)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View History">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => onViewHistory(customer)}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Customer">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(customer)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No customers found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={customers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default CustomerTable; 