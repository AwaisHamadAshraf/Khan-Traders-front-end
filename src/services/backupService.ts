import {
  getUsers,
  createUser,
  deleteUser,
} from './userService';
import { getCustomers } from './customerService';
import { getProducts, getCategories, getSuppliers } from './inventoryService';
import { getInvoices, getPayments } from './billingService';

// Types for backup data structure
export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    users: any[];
    customers: any[];
    products: any[];
    categories: any[];
    suppliers: any[];
    invoices: any[];
    payments: any[];
    settings: any;
  };
}

// Sample backup history data
const backupHistoryData = [
  {
    id: '1',
    date: '2023-07-15T08:30:00Z',
    size: 423,
    user: 'John Admin',
  },
  {
    id: '2',
    date: '2023-08-01T10:15:00Z',
    size: 512,
    user: 'John Admin',
  },
  {
    id: '3',
    date: '2023-08-15T14:20:00Z',
    size: 534,
    user: 'Sara Manager',
  },
  {
    id: '4',
    date: '2023-09-01T09:45:00Z',
    size: 621,
    user: 'John Admin',
  },
];

/**
 * Create a backup of all application data
 * @returns A Promise that resolves to the backup data
 */
export const backupData = async (): Promise<BackupData> => {
  try {
    // In a real application, this would involve API calls to get data from the server
    // Here we're using our mock services to get data from localStorage
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get all data from various services
    const users = getUsers();
    const customers = getCustomers();
    const products = getProducts();
    const categories = getCategories();
    const suppliers = getSuppliers();
    const invoices = getInvoices();
    const payments = getPayments();
    
    // Get settings from localStorage (mock implementation)
    const settings = localStorage.getItem('khan_traders_settings') 
      ? JSON.parse(localStorage.getItem('khan_traders_settings') || '{}')
      : {};
    
    // Create backup data object
    const backupData: BackupData = {
      version: '1.0.0', // Application version
      timestamp: new Date().toISOString(),
      data: {
        users,
        customers,
        products,
        categories,
        suppliers,
        invoices,
        payments,
        settings,
      },
    };
    
    // In a real application, we might also store this backup in the cloud or server
    // For now, we'll just log some info and return the data
    console.log(`Backup created at ${backupData.timestamp}`);
    
    // Record the backup in history (mock implementation)
    const currentUser = getCurrentUser();
    const backupSize = JSON.stringify(backupData).length / 1024; // Size in KB
    
    const backupHistory = localStorage.getItem('khan_traders_backup_history')
      ? JSON.parse(localStorage.getItem('khan_traders_backup_history') || '[]')
      : [];
    
    backupHistory.push({
      id: Date.now().toString(),
      date: backupData.timestamp,
      size: Math.round(backupSize),
      user: currentUser?.name || 'Unknown User',
    });
    
    localStorage.setItem('khan_traders_backup_history', JSON.stringify(backupHistory));
    
    return backupData;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
};

/**
 * Restore data from a backup
 * @param backupData The backup data to restore
 * @returns A Promise that resolves when the restore is complete
 */
export const restoreData = async (backupData: BackupData): Promise<void> => {
  try {
    // Validate the backup data
    if (!backupData || !backupData.version || !backupData.data) {
      throw new Error('Invalid backup data format');
    }
    
    // Check version compatibility (in a real app, we would have more sophisticated version checking)
    // For now, we'll just log a warning if the version doesn't match
    if (backupData.version !== '1.0.0') {
      console.warn(`Backup version (${backupData.version}) might not be compatible with current app version (1.0.0)`);
    }
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear existing data (in a real app, this would be a transaction to ensure atomicity)
    // Here we're just clearing localStorage items
    
    // Clear all users except the current user
    const currentUser = getCurrentUser();
    const allUsers = getUsers();
    
    // Delete all users
    allUsers.forEach(user => {
      deleteUser(user.id);
    });
    
    // Restore data from backup
    const { users, customers, products, categories, suppliers, invoices, payments, settings } = backupData.data;
    
    // Restore users
    users.forEach(user => {
      // Skip if this user has the same ID as the current user to prevent logging ourselves out
      if (currentUser && user.id === currentUser.id) {
        return;
      }
      
      createUser({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      });
    });
    
    // For other data, we would normally use services to restore them
    // For now, we'll just set the data directly in localStorage
    localStorage.setItem('khan_traders_customers', JSON.stringify(customers));
    localStorage.setItem('khan_traders_products', JSON.stringify(products));
    localStorage.setItem('khan_traders_categories', JSON.stringify(categories));
    localStorage.setItem('khan_traders_suppliers', JSON.stringify(suppliers));
    localStorage.setItem('khan_traders_invoices', JSON.stringify(invoices));
    localStorage.setItem('khan_traders_payments', JSON.stringify(payments));
    localStorage.setItem('khan_traders_settings', JSON.stringify(settings));
    
    console.log(`Data restored from backup created at ${backupData.timestamp}`);
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw new Error('Failed to restore backup');
  }
};

/**
 * Get the backup history
 * @returns A Promise that resolves to the backup history
 */
export const getBackupHistory = async (): Promise<any[]> => {
  try {
    // In a real application, this would be an API call to get backup history from the server
    // Here we're just retrieving from localStorage or returning mock data
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedHistory = localStorage.getItem('khan_traders_backup_history');
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    
    // If no history found, return the mock data and store it in localStorage
    localStorage.setItem('khan_traders_backup_history', JSON.stringify(backupHistoryData));
    return backupHistoryData;
  } catch (error) {
    console.error('Error getting backup history:', error);
    return [];
  }
};

/**
 * Get the current logged in user (mock implementation)
 * @returns The current user object or null if not logged in
 */
const getCurrentUser = () => {
  // In a real app, this would check the authentication state
  // Here we're just returning the first admin user as a placeholder
  const users = getUsers();
  return users.find(user => user.role === 'admin') || null;
}; 