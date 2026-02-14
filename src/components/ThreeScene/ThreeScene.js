"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ThreeScene.module.css';

/**
 * ThreeScene - Dual Opposing Waveforms Engine
 * 
 * Features two intersecting wave systems on opposite diagonals.
 * One is high-density (Primary) and the other is ethereal (Secondary).
 * They pulse and alternate in prominence for a rich, deep aesthetic.
 */
const ThreeScene = () => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const frameIdRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Scene Setup
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 4000);
        camera.position.set(0, 400, 1400);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const colors = [
            0x111d35, // Deep Navy
            0xAF1C30, // Subtle Crimson
            0x1b2d4f  // Secondary Navy
        ];

        // 2. Wave Generator Utility
        const createWaveSystem = (linesCount, segmentsCount, tiltZ, opacityBase) => {
            const group = new THREE.Group();
            group.rotation.z = tiltZ;
            const lines = [];
            const geometries = [];

            for (let j = 0; j < linesCount; j++) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(segmentsCount * 3);

                for (let i = 0; i < segmentsCount; i++) {
                    positions[i * 3] = (i - segmentsCount / 2) * 15;
                    positions[i * 3 + 1] = 0;
                    positions[i * 3 + 2] = (j - linesCount / 2) * 45;
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometries.push(geometry);

                const material = new THREE.LineBasicMaterial({
                    color: colors[j % colors.length],
                    transparent: true,
                    opacity: opacityBase,
                    linewidth: 1
                });

                const line = new THREE.Line(geometry, material);
                lines.push(line);
                group.add(line);
            }
            return { group, lines, geometries };
        };

        // Create two opposing systems
        // System 1: Denser, Positive Diagonal
        const system1 = createWaveSystem(30, 400, Math.PI / 8, 0.5);
        // System 2: Lighter, Negative Diagonal
        const system2 = createWaveSystem(15, 300, -Math.PI / 6, 0.2);

        scene.add(system1.group);
        scene.add(system2.group);

        // 3. Animation Logic
        let time = 0;
        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);
            time += 0.005;

            // Pulse factor for organic alternation (0 to 1)
            const pulse = (Math.sin(time * 0.4) + 1) / 2;

            // Update System 1 (Dense)
            system1.lines.forEach((line, j) => {
                const positions = line.geometry.attributes.position.array;
                const offset = j * 0.2;
                // Alternate opacity based on pulse
                line.material.opacity = (0.2 + (pulse * 0.4)) * 0.8;

                for (let i = 0; i < line.geometry.attributes.position.count; i++) {
                    const x = positions[i * 3];
                    positions[i * 3 + 1] = Math.sin(x * 0.003 + time + offset) * (70 + pulse * 40);
                }
                line.geometry.attributes.position.needsUpdate = true;
            });

            // Update System 2 (Lighter)
            system2.lines.forEach((line, j) => {
                const positions = line.geometry.attributes.position.array;
                const offset = j * 0.4;
                // Inverse pulse for System 2
                line.material.opacity = (0.5 - (pulse * 0.4)) * 0.6;

                for (let i = 0; i < line.geometry.attributes.position.count; i++) {
                    const x = positions[i * 3];
                    positions[i * 3 + 1] = Math.cos(x * 0.004 - time * 0.7 + offset) * (40 + (1 - pulse) * 30);
                }
                line.geometry.attributes.position.needsUpdate = true;
            });

            // Subtle orbital drift
            system1.group.rotation.y += 0.0006;
            system2.group.rotation.y -= 0.0009;
            system1.group.rotation.x = Math.sin(time * 0.1) * 0.1 + 0.25;
            system2.group.rotation.x = Math.cos(time * 0.08) * 0.05 + 0.2;

            renderer.render(scene, camera);
        };

        animate();

        // 4. Handle Resize
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // 5. Disposal
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameIdRef.current);
            if (rendererRef.current) rendererRef.current.dispose();

            [system1, system2].forEach(sys => {
                sys.geometries.forEach(g => g.dispose());
                sys.lines.forEach(l => l.material.dispose());
            });
        };
    }, []);

    return <div ref={containerRef} className={styles.canvasContainer} />;
};

export default ThreeScene;
