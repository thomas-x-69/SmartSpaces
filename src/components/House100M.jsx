// src/components/House100M.jsx
import { forwardRef, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Using the path provided in the request
const HOUSE_100M_MODEL = "/src/assets/models/100M-Home/10M.glb";

const House100M = forwardRef(({ onCollisionUpdate }, ref) => {
  const { scene } = useGLTF(HOUSE_100M_MODEL);
  const houseRef = useRef();

  useEffect(() => {
    if (houseRef.current) {
      const box = new THREE.Box3().setFromObject(houseRef.current);
      onCollisionUpdate?.({
        type: "house",
        box,
        ref: houseRef.current,
      });
    }
  }, [onCollisionUpdate]);

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.roughness = 0.8;
          node.material.metalness = 0.2;
          node.material.envMapIntensity = 1;
          if (node.material.map) {
            node.material.map.anisotropy = 16;
          }
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={houseRef}
      object={scene}
      scale={[0.8, 0.8, 0.8]}
      position={[3, 0.0, 0]}
    />
  );
});

export default House100M;
