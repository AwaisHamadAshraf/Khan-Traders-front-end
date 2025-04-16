import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Backup as BackupIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import BackupRestoreSection from '../components/settings/BackupRestoreSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Settings tabs"
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  pl: 2,
                },
              }}
            >
              <Tab 
                icon={<BusinessIcon />} 
                iconPosition="start" 
                label="Company" 
                {...a11yProps(0)}
                sx={{ justifyContent: 'flex-start' }}
              />
              <Tab 
                icon={<BackupIcon />} 
                iconPosition="start" 
                label="Backup & Restore" 
                {...a11yProps(1)}
                sx={{ justifyContent: 'flex-start' }}
              />
              <Tab 
                icon={<SecurityIcon />} 
                iconPosition="start" 
                label="Security" 
                {...a11yProps(2)}
                sx={{ justifyContent: 'flex-start' }}
              />
              <Tab 
                icon={<NotificationsIcon />} 
                iconPosition="start" 
                label="Notifications" 
                {...a11yProps(3)}
                sx={{ justifyContent: 'flex-start' }}
              />
              <Tab 
                icon={<PaletteIcon />} 
                iconPosition="start" 
                label="Appearance" 
                {...a11yProps(4)}
                sx={{ justifyContent: 'flex-start' }}
              />
            </Tabs>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper sx={{ width: '100%', minHeight: '70vh' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Company Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" color="text.secondary">
                Company settings will be implemented in a future update.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <BackupRestoreSection />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Security Settings</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" color="text.secondary">
                Security settings will be implemented in a future update.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Notification Preferences</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" color="text.secondary">
                Notification settings will be implemented in a future update.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" color="text.secondary">
                Appearance settings will be implemented in a future update.
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings; 