import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
export const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  overflow: hidden;
  position: relative;
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Adjust for iOS devices with bottom bar */
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 40px;
  margin: auto;
  z-index: 10;
  transition: all 0.3s ease;
  animation: ${fadeIn} 1s ease-out forwards;

  @media (max-width: 1024px) {
    width: 60%;
    padding: 30px;
  }

  @media (max-width: 768px) {
    width: 80%;
    padding: 25px;
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 20px;
    margin: 20px;
  }
`;

export const FormTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
`;

export const FormGroup = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 25px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

export const FormButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #6e48aa, #9d50bb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(157, 80, 187, 0.4);

  &:hover {
    background: linear-gradient(45deg, #9d50bb, #6e48aa);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(157, 80, 187, 0.6);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(150, 150, 150, 0.5);
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 1rem;
  }
`;

export const FormLink = styled.a`
  color: white;
  margin-top: 15px;
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
`;

export const ThreeDContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const FormSwitch = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px;
  width: 100%;
`;

export const SwitchButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

export const FormDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: white;
  
  &:before,
  &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
  
  span {
    padding: 0 10px;
    font-size: 0.8rem;
    opacity: 0.8;
  }
`;

export const SocialLoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.9rem;
  margin-bottom: 10px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`; 