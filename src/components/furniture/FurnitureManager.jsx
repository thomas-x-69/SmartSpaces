// src/components/furniture/FurnitureManager.jsx
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Html, Text } from "@react-three/drei";
import { RotateCw, Move, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectRoomConfigs } from "../../store/roomConfigsSlice";
import { selectRoomConfigs100M } from "../../store/roomConfigs100MSlice";
import LoadingIndicator from "../../scenes/LoadingIndicator";

const FurnitureHoverMenu = ({
  visible,
  position,
  onStartRotating,
  onStartMoving,
  onDelete,
}) => {
  if (!visible) return null;

  return (
    <Html position={[position.x, position.y + 1, position.z]} center>
      <div className="flex gap-2 bg-white/90 p-1.5 rounded-lg shadow-lg backdrop-blur-sm transform -translate-y-2 transition-all duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartRotating();
          }}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title="Rotate"
        >
          <RotateCw className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartMoving();
          }}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title="Move"
        >
          <Move className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-md hover:bg-red-100 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </Html>
  );
};

const loadModel = async (path, gltfLoader, fbxLoader) => {
  const extension = path.split(".").pop().toLowerCase();

  try {
    if (extension === "fbx") {
      return await new Promise((resolve, reject) => {
        fbxLoader.load(path, resolve, undefined, reject);
      });
    } else {
      return await new Promise((resolve, reject) => {
        gltfLoader.load(path, resolve, undefined, reject);
      });
    }
  } catch (error) {
    console.error(`Error loading ${extension} model:`, error);
    throw error;
  }
};

const FurnitureManager = ({ selectedFurniture, homeRef, homeType = "50m" }) => {
  const { scene, gl, camera } = useThree();
  const mousePosition = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const placementPlanes = useRef({});
  const previewMesh = useRef();
  const gltfLoader = useRef(new GLTFLoader());
  const fbxLoader = useRef(new FBXLoader());
  const [isPlacing, setIsPlacing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const placedFurniture = useRef([]);
  const [hoveredFurniture, setHoveredFurniture] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const loadingPosition = useRef(new THREE.Vector3());

  // Use appropriate room configs based on home type
  const is100M = homeType === "100m";
  const roomConfigs = useSelector(
    is100M ? selectRoomConfigs100M : selectRoomConfigs
  );

  useEffect(() => {
    // Clear any existing planes first
    Object.values(placementPlanes.current).forEach((plane) => {
      scene.remove(plane);
    });
    placementPlanes.current = {};

    // Create room placement planes at ABSOLUTE world coordinates
    // Completely independent of house position/size/transforms
    Object.entries(roomConfigs).forEach(([roomName, config]) => {
      const planeGeometry = new THREE.PlaneGeometry(
        config.size[0],
        config.size[1]
      );
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      // Set position directly from config - NO inheritance from house
      plane.position.set(
        config.position[0],
        config.position[1],
        config.position[2]
      );
      plane.userData.roomName = roomName;
      plane.receiveShadow = true;

      // Store reference
      placementPlanes.current[roomName] = plane;

      // Add directly to scene root - NOT to any house group
      scene.add(plane);
    });

    return () => {
      // Clean up on unmount
      Object.values(placementPlanes.current).forEach((plane) => {
        scene.remove(plane);
      });
      placementPlanes.current = {};
    };
  }, [scene, roomConfigs]);

  const handleFurnitureHover = (event) => {
    if (isPlacing || isRotating) return;

    raycaster.current.setFromCamera(mousePosition.current, camera);
    const intersects = raycaster.current.intersectObjects(
      placedFurniture.current.map((f) => f.children).flat()
    );

    const menuElement = document.elementFromPoint(event.clientX, event.clientY);
    const isOverMenu = menuElement?.closest(".furniture-hover-menu");

    if (isOverMenu && hoveredFurniture) return;

    if (intersects.length > 0) {
      gl.domElement.style.cursor = "pointer";
      const hoveredMesh = intersects[0].object;
      const furnitureParent = hoveredMesh.parent;
      setHoveredFurniture(furnitureParent);
    } else if (!isOverMenu) {
      gl.domElement.style.cursor = "default";
      setHoveredFurniture(null);
    }
  };

  const handleDelete = () => {
    if (hoveredFurniture) {
      scene.remove(hoveredFurniture);
      placedFurniture.current = placedFurniture.current.filter(
        (f) => f !== hoveredFurniture
      );
      setHoveredFurniture(null);
      gl.domElement.style.cursor = "default";
    }
  };

  const handleStartMoving = () => {
    if (hoveredFurniture && !isPlacing) {
      loadingPosition.current.copy(hoveredFurniture.position);
      setIsLoading(true);

      setTimeout(() => {
        const newObject = hoveredFurniture.clone();
        newObject.traverse((node) => {
          if (node.isMesh) {
            node.material = node.material.clone();
            node.material.transparent = true;
            node.material.opacity = 0.7;
            node.material.emissive = new THREE.Color(0x666666);
            node.material.emissiveIntensity = 0.5;
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        newObject.userData = {
          ...hoveredFurniture.userData,
          isFurniture: true,
        };

        scene.remove(hoveredFurniture);
        placedFurniture.current = placedFurniture.current.filter(
          (f) => f !== hoveredFurniture
        );

        previewMesh.current = newObject;
        scene.add(previewMesh.current);

        setIsPlacing(true);
        setHoveredFurniture(null);
        setIsLoading(false);
        gl.domElement.style.cursor = "grab";
      }, 600);
    }
  };

  const handleStartRotating = () => {
    if (hoveredFurniture) {
      setIsRotating(true);
      gl.domElement.style.cursor = "ew-resize";
    }
  };

  const checkFurnitureCollision = (position, roomName) => {
    if (!previewMesh.current) return false;

    const previewBox = new THREE.Box3().setFromObject(previewMesh.current);
    const roomBounds = new THREE.Box3(
      new THREE.Vector3(
        roomConfigs[roomName].position[0] - roomConfigs[roomName].size[0] / 2,
        roomConfigs[roomName].position[1] - 1,
        roomConfigs[roomName].position[2] - roomConfigs[roomName].size[1] / 2
      ),
      new THREE.Vector3(
        roomConfigs[roomName].position[0] + roomConfigs[roomName].size[0] / 2,
        roomConfigs[roomName].position[1] + 1,
        roomConfigs[roomName].position[2] + roomConfigs[roomName].size[1] / 2
      )
    );

    if (!roomBounds.containsBox(previewBox)) {
      return true;
    }

    for (const furniture of placedFurniture.current) {
      const furnitureBox = new THREE.Box3().setFromObject(furniture);
      if (previewBox.intersectsBox(furnitureBox)) {
        return true;
      }
    }

    // Check collision with house model only if it's visual collision (not position-dependent)
    if (homeRef.current) {
      const homeMeshes = [];
      homeRef.current.traverse((child) => {
        if (
          child.isMesh &&
          !child.userData?.type?.includes("roomLabel") &&
          !child.userData?.isVisualOnly
        ) {
          homeMeshes.push(child);
        }
      });

      for (const mesh of homeMeshes) {
        const meshBox = new THREE.Box3().setFromObject(mesh);
        if (previewBox.intersectsBox(meshBox)) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    if (selectedFurniture) {
      const isFbx = selectedFurniture.includes("_FBX");
      const modelPath = isFbx
        ? `/src/assets/models/furniture_FBX/${selectedFurniture}.glb`
        : `/src/assets/models/furniture/${selectedFurniture}.glb`;

      // Set loading position to world center, independent of house model
      loadingPosition.current.set(0, 0, 0);
      setIsInitialLoad(true);
      setIsLoading(true);

      loadModel(modelPath, gltfLoader.current, fbxLoader.current)
        .then((result) => {
          setTimeout(() => {
            if (previewMesh.current) {
              scene.remove(previewMesh.current);
            }

            const modelScene = isFbx ? result : result.scene;

            if (isFbx) {
              modelScene.scale.setScalar(0.01);
            }

            previewMesh.current = modelScene;
            previewMesh.current.userData.modelType = selectedFurniture;

            previewMesh.current.traverse((node) => {
              if (node.isMesh) {
                node.material = node.material.clone();
                node.material.transparent = true;
                node.material.opacity = 0.7;
                node.material.emissive = new THREE.Color(0x666666);
                node.material.emissiveIntensity = 0.5;
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            scene.add(previewMesh.current);
            setIsPlacing(true);
            setIsLoading(false);
          }, 600);
        })
        .catch((error) => {
          console.error("Error loading model:", error);
          setIsLoading(false);
        });
    }
  }, [selectedFurniture, scene]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const newX = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      const newY = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
      mousePosition.current.set(newX, newY);

      if (isRotating && hoveredFurniture) {
        const rotationDelta = newX * 5;
        hoveredFurniture.rotation.y = rotationDelta;
      } else if (!isPlacing) {
        handleFurnitureHover(event);
      }
    };

    const handleClick = () => {
      if (isRotating) {
        setIsRotating(false);
        gl.domElement.style.cursor = "default";
      } else if (isPlacing && previewMesh.current && currentRoom) {
        const position = previewMesh.current.position;

        if (!checkFurnitureCollision(position, currentRoom)) {
          const placedMesh = previewMesh.current.clone();
          placedMesh.traverse((node) => {
            if (node.isMesh) {
              node.material = node.material.clone();
              node.material.transparent = false;
              node.material.opacity = 1;
              node.material.emissive = new THREE.Color(0x000000);
              node.material.emissiveIntensity = 0;
            }
          });

          placedMesh.userData = {
            modelType: previewMesh.current.userData.modelType,
            room: currentRoom,
            isFurniture: true,
          };

          scene.add(placedMesh);
          placedFurniture.current.push(placedMesh);

          scene.remove(previewMesh.current);
          previewMesh.current = null;

          setIsPlacing(false);
          setCurrentRoom(null);
          gl.domElement.style.cursor = "default";
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [
    isPlacing,
    isRotating,
    hoveredFurniture,
    currentRoom,
    scene,
    gl.domElement,
  ]);

  useFrame(() => {
    if (isPlacing && previewMesh.current) {
      raycaster.current.setFromCamera(mousePosition.current, camera);
      const intersects = raycaster.current.intersectObjects(
        Object.values(placementPlanes.current)
      );

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const roomName = intersection.object.userData.roomName;

        if (roomName !== currentRoom) {
          setCurrentRoom(roomName);
        }

        previewMesh.current.position.copy(point);

        const hasCollision = checkFurnitureCollision(point, roomName);
        previewMesh.current.traverse((node) => {
          if (node.isMesh) {
            node.material.emissive.setHex(hasCollision ? 0xff0000 : 0x00ff00);
            node.material.emissiveIntensity = hasCollision ? 1 : 0.5;
          }
        });
      }
    }
  });

  return (
    <>
      {isLoading && (
        <LoadingIndicator
          position={loadingPosition.current}
          isInitialLoad={isInitialLoad}
        />
      )}
      {hoveredFurniture && !isLoading && (
        <FurnitureHoverMenu
          visible={!isPlacing && !isRotating}
          position={hoveredFurniture.position}
          onStartRotating={handleStartRotating}
          onStartMoving={handleStartMoving}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default FurnitureManager;
