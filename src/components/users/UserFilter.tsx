import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface UserFilterProps {
  filter: {
    searchTerm: string;
    role: string;
    status: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onClearFilter: () => void;
}

const UserFilter: React.FC<UserFilterProps> = ({
  filter,
  onFilterChange,
  onClearFilter,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('searchTerm', event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    onFilterChange('role', event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    onFilterChange('status', event.target.value);
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Filter Users</Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name or email"
              value={filter.searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="role-filter-label">Role</InputLabel>
              <Select
                labelId="role-filter-label"
                value={filter.role}
                onChange={handleRoleChange}
                label="Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filter.status}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={onClearFilter}
              sx={{ height: '100%' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserFilter; 