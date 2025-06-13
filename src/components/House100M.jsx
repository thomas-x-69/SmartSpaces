// src/components/House100M.jsx
import { forwardRef, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Using the path provided in the request
const HOUSE_100M_MODEL = "/src/assets/models/100M-Home/10M.glb";

const House100M = forwardRef(({ onCollisionUpdate, showCeiling }, ref) => {
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

        // Handle ceiling visibility
        if (
          showCeiling === false &&
          node.name &&
          node.name.toLowerCase().includes("ceiling")
        ) {
          node.visible = false;
        } else if (showCeiling !== false) {
          node.visible = true;
        }

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
  }, [scene, showCeiling]);

  return (
    <primitive
      ref={houseRef}
      object={scene}
      scale={[0.8, 0.8, 0.8]}
      position={[0, 0.0, 0]} // This position only affects the visual house model
      userData={{ type: "houseModel", isVisualOnly: true }}
    />
  );
});

export default House100M;
