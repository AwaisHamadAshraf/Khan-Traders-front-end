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
  Typography
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Payment as PaymentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { Invoice } from '../../types/models';

interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onPrint: (invoice: Invoice) => void;
  onAddPayment: (invoice: Invoice) => void;
}

interface HeadCell {
  id: keyof Invoice | 'actions';
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'invoiceNumber', label: 'Invoice #', numeric: false, sortable: true },
  { id: 'customerName', label: 'Customer', numeric: false, sortable: true },
  { id: 'date', label: 'Date', numeric: false, sortable: true },
  { id: 'dueDate', label: 'Due Date', numeric: false, sortable: true },
  { id: 'total', label: 'Total (Rs)', numeric: true, sortable: true },
  { id: 'amountPaid', label: 'Paid (Rs)', numeric: true, sortable: true },
  { id: 'balance', label: 'Balance (Rs)', numeric: true, sortable: true },
  { id: 'status', label: 'Status', numeric: false, sortable: true },
  { id: 'actions', label: 'Actions', numeric: false, sortable: false },
];

type Order = 'asc' | 'desc';

const InvoiceTable = ({ 
  invoices, 
  onView, 
  onEdit, 
  onDelete,
  onPrint,
  onAddPayment
}: InvoiceTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Invoice>('date');

  const handleRequestSort = (property: keyof Invoice) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort function
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (a: { [key in Key]?: any }, b: { [key in Key]?: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status chip color
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', color: 'success' as const };
      case 'pending':
        return { label: 'Pending', color: 'warning' as const };
      case 'overdue':
        return { label: 'Overdue', color: 'error' as const };
      case 'cancelled':
        return { label: 'Cancelled', color: 'default' as const };
      case 'draft':
        return { label: 'Draft', color: 'info' as const };
      default:
        return { label: status, color: 'default' as const };
    }
  };

  // Empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoices.length) : 0;

  return (
    <Paper sx={{ width: '100%', borderRadius: 2, mb: 3 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ fontWeight: 'bold' }}
                >
                  {headCell.sortable ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (headCell.id !== 'actions') {
                          handleRequestSort(headCell.id as keyof Invoice);
                        }
                      }}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={{ ml: 0.5 }}>
                          {order === 'desc' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
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
            {stableSort(invoices, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => {
                const statusChip = getStatusChip(invoice.status);
                return (
                  <TableRow hover key={invoice.id}>
                    <TableCell>
                      <Typography fontWeight="medium">{invoice.invoiceNumber}</Typography>
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell align="right">Rs {invoice.total.toLocaleString()}</TableCell>
                    <TableCell align="right">Rs {invoice.amountPaid.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight={invoice.balance > 0 ? 'bold' : 'normal'}
                        color={invoice.balance > 0 ? 'error.main' : 'text.primary'}
                      >
                        Rs {invoice.balance.toLocaleString()}
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
                      <Tooltip title="View Invoice">
                        <IconButton onClick={() => onView(invoice)} size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <Tooltip title="Add Payment">
                          <IconButton onClick={() => onAddPayment(invoice)} size="small" color="success">
                            <PaymentIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Print Invoice">
                        <IconButton onClick={() => onPrint(invoice)} size="small" color="primary">
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <Tooltip title="Edit Invoice">
                          <IconButton onClick={() => onEdit(invoice)} size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete Invoice">
                        <IconButton onClick={() => onDelete(invoice)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={invoices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default InvoiceTable; 