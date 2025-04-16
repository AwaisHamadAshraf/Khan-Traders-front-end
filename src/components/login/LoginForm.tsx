import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FormContainer,
  FormTitle,
  FormGroup,
  FormInput,
  FormButton,
  FormLink,
  FormSwitch,
  SwitchButton,
  FormDivider,
  SocialLoginButton
} from './LoginStyles';
import { useAuth } from '../../context/AuthContext';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

type FormMode = 'signin' | 'signup' | 'forgot';

const LoginForm: React.FC = () => {
  const [formMode, setFormMode] = useState<FormMode>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage(null);
    
    try {
      // Handle form submission based on mode
      switch (formMode) {
        case 'signin':
          await login(username, password);
          break;
          
        case 'signup':
          // Validate password match
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
          }
          
          // In a real app, you would call an API to register the user
          // For this integration, we'll show a success message
          setSuccessMessage('Account creation would be handled by a backend API. Please use the login form.');
          break;
          
        case 'forgot':
          // In a real app, you would call an API to send password reset
          // For this integration, we'll show a success message
          setSuccessMessage('Password reset instructions would be sent to your email in a real application.');
          break;
      }
    } catch (err) {
      // Error handling is managed by the AuthContext
    }
  };

  const renderSignInForm = () => (
    <motion.form 
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {error && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'rgba(0, 255, 0, 0.1)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          {successMessage}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormButton 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </FormButton>
      </motion.div>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '15px' }}>
        <FormLink href="#" onClick={(e) => { e.preventDefault(); setFormMode('forgot'); }}>
          Forgot Password?
        </FormLink>
      </motion.div>

      <FormDivider>
        <span>OR</span>
      </FormDivider>

      <motion.div variants={itemVariants}>
        <SocialLoginButton type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" />
          </svg>
          Continue with Google
        </SocialLoginButton>
      </motion.div>

      <motion.div variants={itemVariants} style={{ 
        marginTop: '20px', 
        padding: '10px', 
        borderRadius: '5px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <strong>Demo Credentials:</strong><br />
        Admin: admin / admin123<br />
        Manager: manager / manager123<br />
        User: user / user123
      </motion.div>
    </motion.form>
  );

  const renderSignUpForm = () => (
    <motion.form 
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {error && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'rgba(0, 255, 0, 0.1)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          {successMessage}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormButton 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </FormButton>
      </motion.div>

      <motion.div variants={itemVariants} style={{ 
        marginTop: '20px', 
        padding: '10px', 
        borderRadius: '5px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <strong>Note:</strong> This is a demo app. User registration is not connected to a backend yet.
      </motion.div>
    </motion.form>
  );

  const renderForgotPasswordForm = () => (
    <motion.form 
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {error && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'rgba(0, 255, 0, 0.1)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          {successMessage}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <FormGroup>
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormButton 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </FormButton>
      </motion.div>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '15px' }}>
        <FormLink href="#" onClick={(e) => { e.preventDefault(); setFormMode('signin'); }}>
          Back to Login
        </FormLink>
      </motion.div>

      <motion.div variants={itemVariants} style={{ 
        marginTop: '20px', 
        padding: '10px', 
        borderRadius: '5px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <strong>Note:</strong> This is a demo app. Password reset is not connected to a backend yet.
      </motion.div>
    </motion.form>
  );

  return (
    <FormContainer>
      <FormTitle>
        Khan Traders
      </FormTitle>

      {formMode !== 'forgot' && (
        <FormSwitch>
          <SwitchButton 
            type="button"
            active={formMode === 'signin'} 
            onClick={() => setFormMode('signin')}
          >
            Sign In
          </SwitchButton>
          <SwitchButton 
            type="button"
            active={formMode === 'signup'} 
            onClick={() => setFormMode('signup')}
          >
            Sign Up
          </SwitchButton>
        </FormSwitch>
      )}

      <AnimatePresence mode="wait">
        {formMode === 'signin' && renderSignInForm()}
        {formMode === 'signup' && renderSignUpForm()}
        {formMode === 'forgot' && renderForgotPasswordForm()}
      </AnimatePresence>
    </FormContainer>
  );
};

export default LoginForm; 