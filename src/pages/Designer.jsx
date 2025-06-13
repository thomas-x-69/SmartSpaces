// src/pages/Designer.jsx
import { useState, useEffect, Suspense, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import * as THREE from "three";
import HomeScene from "../scenes/HomeScene";
import HomeScene100M from "../scenes/HomeScene100M";
import LoadingScreen from "../components/LoadingScreen";
import CameraAnimation from "../components/CameraAnimation";
import FurnitureMenu from "../components/FurnitureMenu";
import TemplateMenu from "../components/TemplateMenu";
import FurnitureManager from "../components/furniture/FurnitureManager";
import HumanManager from "../components/human/HumanManager";
import { useProgress } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";

// 50M Home imports
import {
  updateRoomSize as updateRoomSize50M,
  updateRoomPosition as updateRoomPosition50M,
  initialState as initialRoomConfigs50M,
} from "../store/roomConfigsSlice";
import {
  updateRoomCapacity as updateRoomCapacity50M,
  addHuman as addHuman50M,
  selectRoomOccupancy as selectRoomOccupancy50M,
} from "../store/humanSlice";

// 100M Home imports
import {
  updateRoomSize as updateRoomSize100M,
  updateRoomPosition as updateRoomPosition100M,
  initialState as initialRoomConfigs100M,
} from "../store/roomConfigs100MSlice";
import {
  updateRoomCapacity as updateRoomCapacity100M,
  addHuman as addHuman100M,
  selectRoomOccupancy100M,
} from "../store/humanSlice100M";

import {
  Eye,
  EyeOff,
  Users,
  UserPlus,
  X,
  MousePointer2,
  MoveHorizontal,
  Save,
  Headset,
  ArrowLeft,
} from "lucide-react";

const MenuButton = ({
  onClick,
  isActive,
  icon: Icon,
  text,
  variant = "primary",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 font-medium";

  const variants = {
    primary: isActive
      ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
      : "bg-gradient-to-r from-indigo-500 to-blue-400 text-white hover:from-indigo-600 hover:to-blue-500",
    secondary: isActive
      ? "bg-white/90 text-gray-900"
      : "bg-white/80 text-gray-800 hover:bg-white/90",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-400 text-white hover:from-red-600 hover:to-rose-500",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
};

const exportScene = (scene) => {
  const exporter = new GLTFExporter();

  // Create a clean copy of the scene
  const cleanScene = new THREE.Scene();

  // Copy relevant objects from the original scene
  scene.traverse((object) => {
    // Skip UI elements, helpers, and non-mesh objects
    if (
      object.userData?.type === "roomLabel" ||
      object.userData?.isHelper ||
      object.isHelper ||
      object instanceof THREE.Light ||
      object instanceof THREE.Camera ||
      object instanceof THREE.GridHelper ||
      object instanceof THREE.AxesHelper
    ) {
      return;
    }

    // Clone mesh objects
    if (object.isMesh) {
      const clonedObject = object.clone();

      // Create basic material without textures
      if (clonedObject.material) {
        const newMaterial = new THREE.MeshBasicMaterial({
          color: clonedObject.material.color || 0xcccccc,
          transparent: false,
          opacity: 1,
        });
        clonedObject.material = newMaterial;
      }

      // Maintain original position, rotation, and scale
      clonedObject.position.copy(object.position);
      clonedObject.rotation.copy(object.rotation);
      clonedObject.scale.copy(object.scale);

      cleanScene.add(clonedObject);
    }
  });

  // Export options
  const options = {
    binary: true,
    onlyVisible: true,
    maxTextureSize: 0, // Disable textures
    embedImages: false,
  };

  // Perform the export
  exporter.parse(
    cleanScene,
    (gltf) => {
      const blob = new Blob([gltf], { type: "model/gltf-binary" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `home-scene-${homeType}.glb`;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error("Error exporting scene:", error);
    },
    options
  );
};

export default function Designer() {
  const { homeType } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Determine which selectors and actions to use based on home type
  const is100M = homeType === "100m";
  const roomOccupancy = useSelector(
    is100M ? selectRoomOccupancy100M : selectRoomOccupancy50M
  );

  const [showOccupancy, setShowOccupancy] = useState(true);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [isPlacingHuman, setIsPlacingHuman] = useState(false);
  const [isEditingRooms, setIsEditingRooms] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);
  const [showScene, setShowScene] = useState(false);
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const [showARView, setShowARView] = useState(false);
  const homeRef = useRef();
  const scene = useRef();

  // Validate home type
  useEffect(() => {
    if (!homeType || (homeType !== "50m" && homeType !== "100m")) {
      navigate("/");
      return;
    }
  }, [homeType, navigate]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowScene(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const resetSceneForTemplate = () => {
    // Only reset when explicitly loading a template, not on app start
    if (!scene.current) return;

    // Clear existing objects
    const furnitureManager = scene.current?.getObjectByName("FurnitureManager");
    const humanManager = scene.current?.getObjectByName("HumanManager");

    if (furnitureManager) {
      while (furnitureManager.children.length) {
        furnitureManager.remove(furnitureManager.children[0]);
      }
      scene.current.remove(furnitureManager);
    }

    if (humanManager) {
      while (humanManager.children.length) {
        humanManager.remove(humanManager.children[0]);
      }
      scene.current.remove(humanManager);
    }

    // Reset wall positions to initial state
    const walls = scene.current.children.filter((obj) => obj.userData?.isWall);
    walls.forEach((wall) => {
      if (is100M) {
        // Reset 100M walls
        if (wall.userData.id === "wall100m_1") {
          wall.position.set(0.5, -0.3, 8);
          wall.rotation.set(0, Math.PI / 2, 0);
        } else if (wall.userData.id === "wall100m_2") {
          wall.position.set(2, -0.3, 4);
          wall.rotation.set(0, 0, 0);
        }
      } else {
        // Reset 50M walls
        if (wall.userData.id === "wall1" || wall.userData.id === "wall2") {
          wall.position.set(
            -0.325,
            -0.3,
            wall.userData.id === "wall1" ? -12.9 : -0.8
          );
          wall.rotation.set(0, 0, 0);
        }
      }
    });

    // Reset Redux states ONLY for template loading - don't touch room positions
    const initialConfigs = is100M
      ? initialRoomConfigs100M
      : initialRoomConfigs50M;
    const updateRoomSizeAction = is100M
      ? updateRoomSize100M
      : updateRoomSize50M;
    const updateRoomCapacityAction = is100M
      ? updateRoomCapacity100M
      : updateRoomCapacity50M;

    Object.entries(initialConfigs).forEach(([roomName, config]) => {
      // Only reset sizes and capacities, NOT positions
      dispatch(updateRoomSizeAction({ roomName, newSize: config.size }));
      dispatch(
        updateRoomCapacityAction({
          roomName,
          newConfig: {
            currentOccupancy: 0,
            maxCapacity: config.maxCapacity || Math.floor(config.area / 2.5),
            humanIds: [],
            area: config.area,
          },
        })
      );
    });
  };

  const handleLoadTemplate = async (template) => {
    try {
      if (!template?.objects) {
        console.error("Invalid template data:", template);
        return;
      }

      // Reset all states first
      setSelectedFurniture(null);
      setIsPlacingHuman(false);
      setIsEditingRooms(false);

      // Reset scene and Redux state
      resetSceneForTemplate();

      // Create new groups
      const furnitureGroup = new THREE.Group();
      furnitureGroup.name = "FurnitureManager";
      scene.current.add(furnitureGroup);

      const humanGroup = new THREE.Group();
      humanGroup.name = "HumanManager";
      scene.current.add(humanGroup);

      // Handle walls first since they affect room sizes
      if (template.objects.walls?.length) {
        for (const wall of template.objects.walls) {
          const wallObject = scene.current.getObjectByProperty(
            "userData.id",
            wall.id
          );
          if (wallObject) {
            wallObject.position.fromArray(wall.position);
            wallObject.rotation.fromArray(wall.rotation);
            // Wall handling logic would be different for 100M vs 50M
          }
        }
      }

      // Load all furniture
      if (template.objects.furniture?.length) {
        const loader = new GLTFLoader();
        for (const furniture of template.objects.furniture) {
          try {
            const gltf = await new Promise((resolve, reject) => {
              loader.load(
                `/src/assets/models/furniture/${furniture.type}.glb`,
                resolve,
                undefined,
                reject
              );
            });

            const model = gltf.scene;
            model.position.fromArray(furniture.position);
            model.rotation.fromArray(furniture.rotation);
            model.userData = {
              isFurniture: true,
              modelType: furniture.type,
              room: furniture.room,
            };

            // Apply materials and shadows
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            furnitureGroup.add(model);
          } catch (error) {
            console.error(`Error loading furniture ${furniture.type}:`, error);
          }
        }
      }

      // Load all humans
      if (template.objects.humans?.length) {
        const loader = new GLTFLoader();
        for (const human of template.objects.humans) {
          try {
            const gltf = await new Promise((resolve, reject) => {
              loader.load(
                "/src/assets/models/human/Human.glb",
                resolve,
                undefined,
                reject
              );
            });

            const model = gltf.scene;
            model.position.fromArray(human.position);
            model.rotation.fromArray(human.rotation);
            model.scale.set(20, 20, 20);
            model.userData = {
              isHuman: true,
              room: human.room,
            };

            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            humanGroup.add(model);

            // Update Redux state for human using appropriate action
            const addHumanAction = is100M ? addHuman100M : addHuman50M;
            dispatch(
              addHumanAction({
                id: `human_${Date.now()}_${Math.random()}`,
                position: human.position,
                rotation: human.rotation,
                room: human.room,
              })
            );
          } catch (error) {
            console.error("Error loading human:", error);
          }
        }
      }

      // Update room occupancy after loading humans
      const initialConfigs = is100M
        ? initialRoomConfigs100M
        : initialRoomConfigs50M;
      const updateRoomCapacityAction = is100M
        ? updateRoomCapacity100M
        : updateRoomCapacity50M;

      Object.keys(initialConfigs).forEach((roomName) => {
        const humansInRoom = humanGroup.children.filter(
          (human) => human.userData.room === roomName
        );

        if (humansInRoom.length > 0) {
          dispatch(
            updateRoomCapacityAction({
              roomName,
              newConfig: {
                currentOccupancy: humansInRoom.length,
                humanIds: humansInRoom.map((h) => h.uuid),
                maxCapacity: Math.floor(initialConfigs[roomName].area / 2.5),
                area: initialConfigs[roomName].area,
              },
            })
          );
        }
      });

      setShowTemplateMenu(false);
    } catch (error) {
      console.error("Error loading template:", error);
      // Reset states in case of error
      setSelectedFurniture(null);
      setIsPlacingHuman(false);
      setIsEditingRooms(false);
    }
  };

  const handleFurnitureSelect = (furniture) => {
    setSelectedFurniture(furniture);
    setIsPlacingHuman(false);
    setIsEditingRooms(false);
  };

  const handleHumanPlacementComplete = () => {
    setIsPlacingHuman(false);
  };

  const handleAddHuman = () => {
    setIsPlacingHuman(!isPlacingHuman);
    setSelectedFurniture(null);
    setIsEditingRooms(false);
  };

  const handleToggleRoomEditing = () => {
    setIsEditingRooms(!isEditingRooms);
    setIsPlacingHuman(false);
    setSelectedFurniture(null);
  };

  const handleARViewTransition = () => {
    navigate(`/ar/${homeType}`);
  };

  const handleBackToSelection = () => {
    navigate("/");
  };

  // Don't render if invalid home type
  if (!homeType || (homeType !== "50m" && homeType !== "100m")) {
    return null;
  }

  return (
    <>
      {isLoading && <LoadingScreen progress={progress} />}

      <div
        className={`w-full h-screen bg-gray-900 relative transition-opacity duration-1000 ${
          showScene ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Home Type Indicator */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-4">
          <button
            onClick={handleBackToSelection}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{is100M ? "100M²" : "50M²"} Home</span>
          </button>
        </div>

        {/* Main Menu Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <MenuButton
            onClick={handleAddHuman}
            icon={isPlacingHuman ? X : UserPlus}
            text={isPlacingHuman ? "Cancel Placement" : "Add Human"}
            variant={isPlacingHuman ? "danger" : "primary"}
            isActive={isPlacingHuman}
          />
          <MenuButton
            onClick={handleToggleRoomEditing}
            icon={isEditingRooms ? X : MoveHorizontal}
            text={isEditingRooms ? "Exit Room Edit" : "Adjust Room Size"}
            variant={isEditingRooms ? "danger" : "primary"}
            isActive={isEditingRooms}
          />
        </div>

        {/* View Controls */}
        <div className="absolute top-28 right-4 z-20 flex flex-col gap-2">
          <MenuButton
            onClick={() => setShowOccupancy(!showOccupancy)}
            icon={Users}
            text={showOccupancy ? "Hide Occupancy" : "Show Occupancy"}
            variant="secondary"
            isActive={showOccupancy}
          />
        </div>

        {/* Bottom Right Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <MenuButton
            onClick={() => scene.current && exportScene(scene.current)}
            icon={Save}
            text="Export Scene"
            variant="secondary"
          />
          <MenuButton
            onClick={handleARViewTransition}
            icon={Headset}
            text="Enter AR View"
            variant="primary"
          />
        </div>

        {/* Add Template Menu Button */}
        <div className="absolute left-4 top-28 z-30">
          <MenuButton
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            icon={Save}
            text="Templates"
            variant="secondary"
            isActive={showTemplateMenu}
          />
        </div>

        {/* Template Menu */}
        <TemplateMenu
          isOpen={showTemplateMenu}
          onClose={() => setShowTemplateMenu(false)}
          onLoadTemplate={handleLoadTemplate}
          scene={scene.current}
          homeType={homeType}
        />

        {/* Furniture Menu */}
        <FurnitureMenu
          onFurnitureSelect={handleFurnitureSelect}
          isExpanded={isExpanded}
          onSetExpanded={setIsExpanded}
        />

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-start gap-3">
            <MousePointer2 className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">Controls</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Use mouse to orbit around the house</p>
                <p>• Toggle ceiling view for better visibility</p>
                <p>• Drag furniture from the menu</p>
                <p>• Click Add Human to place people</p>
                <p>• Save and load layouts from Templates</p>
                {isEditingRooms && (
                  <p>• Drag walls horizontally to adjust room size</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3D Scene */}
        <Canvas
          shadows
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputEncoding: THREE.sRGBEncoding,
            shadowMap: {
              enabled: true,
              type: THREE.PCFSoftShadowMap,
              basicShadowMap: false,
            },
          }}
          camera={{
            position: is100M ? [3, 2, 3] : [2, 1, 2],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]}
          onCreated={({ scene: threeScene }) => {
            scene.current = threeScene;
          }}
        >
          <Suspense fallback={null}>
            {is100M ? (
              <HomeScene100M
                ref={homeRef}
                showOccupancy={showOccupancy}
                isEditingRooms={isEditingRooms}
                onSurfacesDetected={(surfaces) => {
                  console.log("Surfaces detected:", surfaces);
                }}
              />
            ) : (
              <HomeScene
                ref={homeRef}
                showOccupancy={showOccupancy}
                isEditingRooms={isEditingRooms}
                onSurfacesDetected={(surfaces) => {
                  console.log("Surfaces detected:", surfaces);
                }}
              />
            )}
            <FurnitureManager
              selectedFurniture={selectedFurniture}
              homeRef={homeRef}
              homeType={homeType}
            />
            <HumanManager
              isPlacingHuman={isPlacingHuman}
              onPlacementComplete={handleHumanPlacementComplete}
              homeRef={homeRef}
              homeType={homeType}
            />
            <CameraAnimation
              isLoading={!showScene}
              onAnimationComplete={() => setControlsEnabled(true)}
            />
            <OrbitControls
              makeDefault
              enabled={controlsEnabled && !isEditingRooms}
              minDistance={2}
              maxDistance={is100M ? 25 : 20}
              maxPolarAngle={Math.PI / 2}
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={1}
              zoomSpeed={1}
              target={new THREE.Vector3(is100M ? 0 : -1.3, 0, 0)}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
