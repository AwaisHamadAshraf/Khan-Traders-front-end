import React, { useState } from 'react';
import api from '../utils/api';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');

  const testConnection = async () => {
    try {
      setStatus('loading');
      const response = await api.get('/health');
      setStatus('success');
      setMessage(response.data.message);
      setTimestamp(response.data.timestamp);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.isNetworkError 
        ? error.message 
        : 'Failed to connect to the backend server');
    }
  };

  return (
    <Box sx={{ my: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        API Connection Test (Port 5001)
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={testConnection}
        disabled={status === 'loading'}
        sx={{ mb: 2 }}
      >
        {status === 'loading' ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
            Testing...
          </>
        ) : 'Test API Connection'}
      </Button>
      
      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 1 }}>
          {message}<br/>
          Server time: {timestamp}
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default ApiTest; 