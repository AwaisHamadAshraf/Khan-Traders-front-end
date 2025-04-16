import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LoginContainer } from './LoginStyles';
import Background3D from './Background3D';
import LoginForm from './LoginForm';

const LoginPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Add a cursor spotlight effect that follows mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };
    
    // Add touch movement support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX / window.innerWidth;
        const y = touch.clientY / window.innerHeight;
        
        document.documentElement.style.setProperty('--mouse-x', x.toString());
        document.documentElement.style.setProperty('--mouse-y', y.toString());
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    // Set mounted after a delay to ensure smooth animations
    const timer = setTimeout(() => setIsMounted(true), 100);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <LoginContainer>
      {/* 3D Background */}
      <Background3D />
      
      {/* Login Form with Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isMounted ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      >
        <LoginForm />
      </motion.div>
    </LoginContainer>
  );
};

export default LoginPage; 