import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Cubes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Cubes
    const count = 200;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Light blue color #4A9EFF
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x4A9EFF, 
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    
    // Position cubes randomly but with some spread
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
        dummy.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20
        );
        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        const scale = Math.random() * 1.5 + 0.5;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
    
    scene.add(mesh);

    // Animation
    let frameId: number;
    const animate = () => {
        frameId = requestAnimationFrame(animate);
        
        mesh.rotation.y += 0.001;
        mesh.rotation.x += 0.0005;
        
        // Gentle float effect
        mesh.position.y = Math.sin(Date.now() * 0.001) * 0.5;
        
        renderer.render(scene, camera);
    };
    
    animate();

    // Resize handler
    const handleResize = () => {
        if (!container) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

