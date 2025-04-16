import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { ThreeDContainer } from './LoginStyles';
import * as THREE from 'three';

interface FloatingObjectProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: boolean;
  scale?: number;
  type?: 'sphere' | 'box';
}

const FloatingObject: React.FC<FloatingObjectProps> = ({ 
  position, 
  color, 
  speed = 1, 
  distort = false,
  scale = 1,
  type = 'sphere'
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    // Rotate the object
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2 * speed;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3 * speed;
    
    // Add subtle floating movement
    mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.3;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      {type === 'sphere' ? (
        <Sphere args={[1, 32, 32]}>
          {distort ? (
            <MeshDistortMaterial 
              color={color} 
              speed={3} 
              distort={0.5} 
              radius={1} 
              roughness={0.5}
              metalness={0.2}
            />
          ) : (
            <meshStandardMaterial 
              color={color} 
              roughness={0.5}
              metalness={0.2}
              transparent
              opacity={0.7}
            />
          )}
        </Sphere>
      ) : (
        <Box args={[1, 1, 1]}>
          {distort ? (
            <MeshDistortMaterial 
              color={color} 
              speed={3} 
              distort={0.5} 
              roughness={0.5}
              metalness={0.2}
            />
          ) : (
            <meshStandardMaterial 
              color={color} 
              roughness={0.5}
              metalness={0.2}
              transparent
              opacity={0.7}
            />
          )}
        </Box>
      )}
    </mesh>
  );
};

const Background3D: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine how many objects to render based on screen size
  const isMobile = windowWidth <= 768;
  const isSmallScreen = windowWidth <= 1024;
  
  return (
    <ThreeDContainer>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Main floating objects - always shown */}
        <FloatingObject position={[-5, 2, -5]} color="#6e48aa" speed={0.8} distort={true} scale={isMobile ? 1.5 : 2} />
        <FloatingObject position={[5, -2, -5]} color="#9d50bb" speed={1.2} distort={true} scale={isMobile ? 1 : 1.5} />
        <FloatingObject position={[0, 0, -8]} color="#fdbb2d" speed={1} distort={true} scale={isMobile ? 2 : 3} />
        
        {/* Medium priority objects - hide on mobile */}
        {!isMobile && (
          <>
            <FloatingObject position={[-3, -3, -3]} color="#1a2a6c" speed={0.5} scale={1} type="box" />
            <FloatingObject position={[3, 3, -6]} color="#b21f1f" speed={0.7} scale={1.2} type="box" />
          </>
        )}
        
        {/* Low priority objects - only on larger screens */}
        {!isSmallScreen && (
          <>
            <FloatingObject position={[-2, 4, -4]} color="#ffffff" speed={0.9} scale={0.8} />
            <FloatingObject position={[4, -4, -7]} color="#6e48aa" speed={1.1} scale={1.3} />
          </>
        )}
        
        {/* Modify controls based on device */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={isMobile ? 0.3 : 0.5}
        />
      </Canvas>
    </ThreeDContainer>
  );
};

export default Background3D; 