import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new login page
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Login; 