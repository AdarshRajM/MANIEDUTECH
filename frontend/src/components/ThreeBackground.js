import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';

const FloatingShapes = () => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {[...Array(15)].map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
                    <mesh 
                        position={[
                            (Math.random() - 0.5) * 20, 
                            (Math.random() - 0.5) * 20, 
                            (Math.random() - 0.5) * 10 - 5
                        ]}
                    >
                        {i % 3 === 0 ? <boxGeometry args={[0.5, 0.5, 0.5]} /> : i % 3 === 1 ? <sphereGeometry args={[0.4, 16, 16]} /> : <torusGeometry args={[0.3, 0.1, 16, 32]} />}
                        <meshStandardMaterial color={['#667eea', '#764ba2', '#4facfe', '#00f2fe'][i % 4]} opacity={0.6} transparent roughness={0.1} metalness={0.5} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

const ThreeBackground = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <FloatingShapes />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
