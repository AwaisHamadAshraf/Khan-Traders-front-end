import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Alert,
  AlertTitle,
  TextField,
  LinearProgress,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { backupData, restoreData, getBackupHistory } from '../../services/backupService';

const BackupRestoreSection: React.FC = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    setBackupInProgress(true);
    setBackupProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setBackupProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Perform backup operation
      const result = await backupData();
      
      clearInterval(interval);
      setBackupProgress(100);

      setTimeout(() => {
        setBackupInProgress(false);
        setBackupProgress(0);
        setSnackbar({
          open: true,
          message: 'Backup completed successfully! The backup file has been downloaded.',
          severity: 'success',
        });
      }, 500);

      // Trigger download of the backup file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `khan-traders-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      setBackupInProgress(false);
      setBackupProgress(0);
      setSnackbar({
        open: true,
        message: 'Backup failed. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setSnackbar({
        open: true,
        message: 'Please select a backup file to restore.',
        severity: 'warning',
      });
      return;
    }

    setRestoreInProgress(true);
    setRestoreProgress(0);

    try {
      // Read the file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Simulate progress
          const interval = setInterval(() => {
            setRestoreProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + 5;
            });
          }, 200);

          // Parse the file and restore data
          const fileContent = e.target?.result as string;
          const backupData = JSON.parse(fileContent);
          
          await restoreData(backupData);
          
          clearInterval(interval);
          setRestoreProgress(100);
          
          setTimeout(() => {
            setRestoreInProgress(false);
            setRestoreProgress(0);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setSnackbar({
              open: true,
              message: 'Data restored successfully! The application will reload in a few seconds.',
              severity: 'success',
            });
            
            // In a real app, we would reload the application after a few seconds
            // setTimeout(() => window.location.reload(), 3000);
          }, 500);
        } catch (error) {
          setRestoreInProgress(false);
          setRestoreProgress(0);
          setSnackbar({
            open: true,
            message: 'Failed to restore data. The backup file may be corrupted.',
            severity: 'error',
          });
        }
      };

      reader.onerror = () => {
        setRestoreInProgress(false);
        setRestoreProgress(0);
        setSnackbar({
          open: true,
          message: 'Error reading the backup file.',
          severity: 'error',
        });
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      setRestoreInProgress(false);
      setRestoreProgress(0);
      setSnackbar({
        open: true,
        message: 'Restore operation failed. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleViewHistory = async () => {
    try {
      const history = await getBackupHistory();
      setBackupHistory(history);
      setShowHistory(!showHistory);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to retrieve backup history.',
        severity: 'error',
      });
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BackupIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Data Backup & Restore</Typography>
          <Tooltip title="View backup history">
            <IconButton size="small" onClick={handleViewHistory} sx={{ ml: 'auto' }}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Important Information</AlertTitle>
          <Typography variant="body2">
            Backing up your data regularly helps prevent data loss. We recommend doing this at least once a week.
            When you restore data, the current data will be completely replaced with the backup data.
          </Typography>
        </Alert>
        
        <Grid container spacing={4}>
          {/* Backup Section */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DownloadIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="subtitle1" fontWeight="medium">Backup Data</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create a backup of all your current data including inventory, customers, invoices, and settings.
                  The backup will be downloaded as a JSON file.
                </Typography>
                
                {backupInProgress && (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress variant="determinate" value={backupProgress} />
                    <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                      Backing up data... {backupProgress}%
                    </Typography>
                  </Box>
                )}
                
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={backupInProgress ? <CircularProgress size={20} color="inherit" /> : <BackupIcon />}
                  onClick={handleBackup}
                  disabled={backupInProgress || restoreInProgress}
                >
                  Backup Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Restore Section */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <UploadIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="subtitle1" fontWeight="medium">Restore Data</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Restore your data from a previously created backup file. This will replace all current data.
                  Make sure to back up your current data first if needed.
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="No file selected"
                    value={selectedFile ? selectedFile.name : ''}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                          disabled={restoreInProgress}
                        >
                          Browse
                          <input
                            type="file"
                            hidden
                            accept=".json"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </Button>
                      ),
                    }}
                    size="small"
                  />
                </Box>
                
                {restoreInProgress && (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress variant="determinate" value={restoreProgress} />
                    <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                      Restoring data... {restoreProgress}%
                    </Typography>
                  </Box>
                )}
                
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  size="large"
                  startIcon={restoreInProgress ? <CircularProgress size={20} color="inherit" /> : <RestoreIcon />}
                  onClick={handleRestore}
                  disabled={!selectedFile || backupInProgress || restoreInProgress}
                >
                  Restore Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Backup History */}
        {showHistory && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
              Backup History
            </Typography>
            {backupHistory.length > 0 ? (
              <Card variant="outlined">
                <Box sx={{ p: 2 }}>
                  {backupHistory.map((backup, index) => (
                    <Box key={index} sx={{ 
                      p: 1, 
                      borderBottom: index < backupHistory.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(backup.date).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Size: {backup.size} KB | Created by: {backup.user}
                        </Typography>
                      </Box>
                      <Tooltip title="Download this backup">
                        <IconButton size="small" onClick={() => console.log('Download backup:', backup.id)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No backup history found. Start creating backups to see them here.
              </Typography>
            )}
          </Box>
        )}
        
        {/* Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default BackupRestoreSection; 