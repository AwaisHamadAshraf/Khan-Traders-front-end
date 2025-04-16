import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import UserTable from '../../components/users/UserTable';
import UserForm from '../../components/users/UserForm';
import UserFilter from '../../components/users/UserFilter';
import ConfirmDialog from '../../components/users/ConfirmDialog';
import { User } from '../../types/models';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  filterUsers,
  UserFilter as UserFilterType,
} from '../../services/userService';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string>('');
  const [userToResetPassword, setUserToResetPassword] = useState<string>('');
  const [filter, setFilter] = useState<UserFilterType>({
    searchTerm: '',
    role: '',
    status: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users whenever the filter or users list changes
  useEffect(() => {
    applyFilters();
  }, [filter, users]);

  const loadUsers = () => {
    const loadedUsers = getUsers();
    setUsers(loadedUsers);
  };

  const applyFilters = () => {
    const filtered = filterUsers(users, filter);
    setFilteredUsers(filtered);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilter = () => {
    setFilter({
      searchTerm: '',
      role: '',
      status: '',
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userData: User) => {
    try {
      if (userData.id) {
        // Update existing user
        updateUser(userData.id, userData);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      } else {
        // Create new user
        createUser(userData);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success',
        });
      }
      loadUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    try {
      deleteUser(userToDelete);
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
      loadUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete('');
    }
  };

  const handleResetPasswordClick = (userId: string) => {
    setUserToResetPassword(userId);
    setIsResetPasswordDialogOpen(true);
  };

  const handleConfirmResetPassword = () => {
    try {
      // In a real app, you'd generate a random password or use a more secure method
      const tempPassword = 'tempPass' + Math.floor(Math.random() * 10000);
      resetPassword(userToResetPassword, tempPassword);
      setSnackbar({
        open: true,
        message: `Password reset successfully. Temporary password: ${tempPassword}`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error',
      });
    } finally {
      setIsResetPasswordDialogOpen(false);
      setUserToResetPassword('');
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      updateUser(userId, { status: newStatus });
      setSnackbar({
        open: true,
        message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
        severity: 'success',
      });
      loadUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error',
      });
    }
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    try {
      updateUser(userId, { role: newRole });
      setSnackbar({
        open: true,
        message: `User role changed to ${newRole} successfully`,
        severity: 'success',
      });
      loadUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      <UserFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />

      <Paper sx={{ width: '100%', mb: 2 }}>
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          onResetPassword={handleResetPasswordClick}
          onToggleStatus={handleToggleStatus}
          onChangeRole={handleChangeRole}
        />
      </Paper>

      {/* User Form Dialog */}
      <UserForm
        open={isFormOpen}
        user={selectedUser}
        onClose={handleFormClose}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      {/* Reset Password Confirmation Dialog */}
      <ConfirmDialog
        open={isResetPasswordDialogOpen}
        title="Reset Password"
        message="Are you sure you want to reset this user's password? A temporary password will be generated."
        confirmButtonText="Reset Password"
        confirmButtonColor="warning"
        onConfirm={handleConfirmResetPassword}
        onCancel={() => setIsResetPasswordDialogOpen(false)}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UsersPage; 