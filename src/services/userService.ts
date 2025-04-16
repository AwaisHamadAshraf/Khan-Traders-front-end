import axios from 'axios';
import { User } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would call an API. For now, let's use localStorage
const USERS_STORAGE_KEY = 'khan_traders_users';

// Sample users data for demonstration
const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@khantraders.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    status: 'active',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sara Manager',
    email: 'manager@khantraders.com',
    password: 'manager123',
    role: 'manager',
    status: 'active',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Tom User',
    email: 'user@khantraders.com',
    password: 'user123',
    role: 'user',
    status: 'active',
    lastLogin: '2023-03-15T10:30:00Z',
  },
  {
    id: '4',
    name: 'Inactive User',
    email: 'inactive@khantraders.com',
    password: 'inactive123',
    role: 'user',
    status: 'inactive',
    lastLogin: '2023-01-20T08:15:00Z',
  },
  // Add the auto-logged in user from AuthContext for consistency
  {
    id: '5',
    name: 'Admin User', // Combine firstName and lastName from AuthContext
    email: 'admin@khan-traders.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    lastLogin: new Date().toISOString(),
  }
];

// Initialize users in localStorage if not already present
const initializeUsers = (): void => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  }
};

// Get all users
export const getUsers = (): User[] => {
  initializeUsers();
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Create a new user
export const createUser = (userData: Omit<User, 'id'>): User => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser: User = {
    ...userData,
    id: uuidv4(),
  };
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
  return newUser;
};

// Update an existing user
export const updateUser = (id: string, userData: Partial<User>): User => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Check if email is changed and already exists for another user
  if (
    userData.email &&
    userData.email !== users[userIndex].email &&
    users.some(user => user.email === userData.email)
  ) {
    throw new Error('Email already exists');
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...userData,
  };
  
  users[userIndex] = updatedUser;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return updatedUser;
};

// Delete a user
export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const updatedUsers = users.filter(user => user.id !== id);
  
  if (updatedUsers.length === users.length) {
    // No user was removed
    throw new Error('User not found');
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  return true;
};

// Reset user password
export const resetPassword = (id: string, newPassword: string): User => {
  return updateUser(id, { password: newPassword });
};

// Filter users based on search criteria
export interface UserFilter {
  searchTerm: string;
  role: string;
  status: string;
}

export const filterUsers = (users: User[], filter: UserFilter): User[] => {
  return users.filter(user => {
    // Filter by search term
    const matchesSearch = !filter.searchTerm || 
      user.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    // Filter by role
    const matchesRole = !filter.role || user.role === filter.role;
    
    // Filter by status
    const matchesStatus = !filter.status || user.status === filter.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
}; 