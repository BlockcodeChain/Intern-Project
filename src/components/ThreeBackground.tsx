import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function AnimatedStars() {
    const group = useRef<any>(null);
    useFrame(({ clock }) => {
        if (group.current) {
            group.current.rotation.y = clock.getElapsedTime() * 0.03;
            group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
        }
    });
    return (
        <group ref={group}>
            <Stars
                radius={150}
                depth={90}
                count={6000}
                factor={12} // Make circles much bigger
                saturation={0.7}
                fade
                speed={1.1}
            />
        </group>
    );
}

const ThreeBackground: React.FC = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 7.5]} intensity={0.7} color="#1976d2" />
                <AnimatedStars />
            </Canvas>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 60% 40%, rgba(25,118,210,0.08) 0%, rgba(0,0,0,0.18) 100%)',
                zIndex: 0
            }} />
        </div>
    );
};

export default ThreeBackground;