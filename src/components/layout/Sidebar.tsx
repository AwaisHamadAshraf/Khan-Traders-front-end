import React from 'react';
import { 
  Drawer, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography, 
  Box,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Inventory as InventoryIcon, 
  Receipt as ReceiptIcon, 
  People as PeopleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Users', icon: <PersonIcon />, path: '/users' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerWidth = 240;

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Khan Traders
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              mb: 1,
              backgroundColor: location.pathname === item.path 
                ? 'rgba(255,255,255,0.2)' 
                : 'transparent',
              borderRadius: '4px',
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              cursor: 'pointer'
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" component="div" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} Khan Traders
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 