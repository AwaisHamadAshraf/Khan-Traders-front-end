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
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  VpnKey as VpnKeyIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { User } from '../../types/models';

interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'avatar', label: '', numeric: false, sortable: false },
  { id: 'name', label: 'Name', numeric: false, sortable: true },
  { id: 'email', label: 'Email', numeric: false, sortable: true },
  { id: 'role', label: 'Role', numeric: false, sortable: true },
  { id: 'status', label: 'Status', numeric: false, sortable: true },
  { id: 'lastLogin', label: 'Last Login', numeric: false, sortable: true },
  { id: 'actions', label: 'Actions', numeric: false, sortable: false },
];

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: string) => void;
  onChangeRole: (userId: string, newRole: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  onChangeRole,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedUser(null);
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      onResetPassword(selectedUser.id);
      handleActionMenuClose();
    }
  };

  const handleToggleStatus = () => {
    if (selectedUser) {
      onToggleStatus(selectedUser.id, selectedUser.status);
      handleActionMenuClose();
    }
  };

  const handleChangeToAdmin = () => {
    if (selectedUser) {
      onChangeRole(selectedUser.id, 'admin');
      handleActionMenuClose();
    }
  };

  const handleChangeToUser = () => {
    if (selectedUser) {
      onChangeRole(selectedUser.id, 'user');
      handleActionMenuClose();
    }
  };

  // Sort function
  const descendingComparator = <T extends Record<string, any>>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = <T extends Record<string, any>>(
    order: 'asc' | 'desc',
    orderBy: string
  ): ((a: T, b: T) => number) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy as keyof T)
      : (a, b) => -descendingComparator(a, b, orderBy as keyof T);
  };

  const sortedUsers = React.useMemo(() => {
    return [...users].sort(getComparator(order, orderBy));
  }, [users, order, orderBy]);

  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-labelledby="tableTitle" size="medium">
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
                        userSelect: 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      <Box component="span" sx={{ fontSize: '0.75rem', ml: 0.5 }}>
                        {orderBy === headCell.id ? (order === 'desc' ? ' ↓' : ' ↑') : ''}
                      </Box>
                    </Box>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                hover
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {getInitials(user.name)}
                  </Avatar>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography variant="body1" fontWeight="medium">
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.role}
                    color={getRoleBadgeColor(user.role) as "error" | "warning" | "info" | "default"}
                    icon={user.role.toLowerCase() === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.status}
                    color={getStatusBadgeColor(user.status) as "success" | "error" | "warning" | "default"}
                  />
                </TableCell>
                <TableCell>{formatDate(user.lastLogin)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => onDelete(user.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionMenuOpen(e, user)}
                        aria-label="more"
                        aria-controls="user-actions-menu"
                        aria-haspopup="true"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found
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
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        id="user-actions-menu"
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
        PaperProps={{
          elevation: 2,
        }}
      >
        <MenuItem onClick={handleResetPassword}>
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedUser?.status === 'active' ? (
              <BlockIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.status === 'active' ? 'Deactivate User' : 'Activate User'}
          </ListItemText>
        </MenuItem>
        {selectedUser?.role !== 'admin' && (
          <MenuItem onClick={handleChangeToAdmin}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Make Admin</ListItemText>
          </MenuItem>
        )}
        {selectedUser?.role !== 'user' && (
          <MenuItem onClick={handleChangeToUser}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Make Regular User</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default UserTable; 