// src/scenes/HomeScene100M.jsx
import { forwardRef, Suspense, useRef } from "react";
import {
  Stage,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRoomConfigs100M,
  updateRoomSize,
  updateRoomPosition,
} from "../store/roomConfigs100MSlice";
import { updateRoomCapacity } from "../store/humanSlice";
import {
  WIDTH_MULTIPLIER_100M,
  DEPTH_MULTIPLIER_100M,
  AREA_DIVISOR_100M,
} from "../constants/roomConstants100M";

// Component Imports
import House100M from "../components/House100M";
import RoomLabels100M from "../components/RoomLabels100M";
import Wall from "../components/Wall";
import RoomOccupancy100M from "./RoomOccupancy100M";

const HomeScene100M = forwardRef(
  ({ showCeiling, showOccupancy, isEditingRooms }, ref) => {
    const roomConfigs = useSelector(selectRoomConfigs100M);
    const dispatch = useDispatch();

    // Wall positions for 100M home - 2 walls as specified
    const wallPositions = [
      {
        id: "wall100m_1",
        position: [0.5, -0.3, 8], // Between room1 and room2 area
        rotation: [0, Math.PI / 2, 0], // Rotated 90 degrees
        scale: [0.75, 0.818, 0.9],
        initialX: 0.5,
        initialZ: 8,
      },
      {
        id: "wall100m_2",
        position: [2, -0.3, 4], // Between lobby and living room
        rotation: [0, 0, 0],
        scale: [0.75, 0.818, 0.9],
        initialX: 2,
        initialZ: 4,
      },
    ];

    // Handle wall movement completion
    const handleWallMoveComplete = (wallId, finalPosition) => {
      // Only update room sizes/positions when walls are actually moved by user
      // Not when house model is moved
      if (!isEditingRooms) return;

      console.log("Wall move complete:", { wallId, finalPosition });
      const wallConfig = wallPositions.find((w) => w.id === wallId);
      if (!wallConfig) return;

      if (wallId === "wall100m_1") {
        // Wall between room1 and room2 - adjust these rooms
        const movementDelta = (finalPosition.x - wallConfig.initialX) * 0.5;

        const newRoom1Size = [
          Math.max(3, roomConfigs.ROOM1.size[0] - movementDelta),
          roomConfigs.ROOM1.size[1],
        ];
        const newRoom2Size = [
          Math.max(3, roomConfigs.ROOM2.size[0] + movementDelta),
          roomConfigs.ROOM2.size[1],
        ];

        dispatch(
          updateRoomSize({
            roomName: "ROOM1",
            newSize: newRoom1Size,
          })
        );
        dispatch(
          updateRoomSize({
            roomName: "ROOM2",
            newSize: newRoom2Size,
          })
        );

        // Update room capacities
        dispatch(
          updateRoomCapacity({
            roomName: "ROOM1",
            newConfig: { area: newRoom1Size[0] * newRoom1Size[1] },
          })
        );
        dispatch(
          updateRoomCapacity({
            roomName: "ROOM2",
            newConfig: { area: newRoom2Size[0] * newRoom2Size[1] },
          })
        );

        // Update positions
        dispatch(
          updateRoomPosition({
            roomName: "ROOM1",
            newPosition: [
              roomConfigs.ROOM1.position[0] - movementDelta * 0.5,
              roomConfigs.ROOM1.position[1],
              roomConfigs.ROOM1.position[2],
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "ROOM2",
            newPosition: [
              roomConfigs.ROOM2.position[0] + movementDelta * 0.5,
              roomConfigs.ROOM2.position[1],
              roomConfigs.ROOM2.position[2],
            ],
          })
        );
      } else if (wallId === "wall100m_2") {
        // Wall between lobby and living room
        const movementDelta = (finalPosition.x - wallConfig.initialX) * 0.5;

        const newLobbySize = [
          Math.max(4, roomConfigs.LOBBY.size[0] - movementDelta),
          roomConfigs.LOBBY.size[1],
        ];
        const newLivingRoomSize = [
          Math.max(4, roomConfigs["LIVING ROOM"].size[0] + movementDelta),
          roomConfigs["LIVING ROOM"].size[1],
        ];

        dispatch(
          updateRoomSize({
            roomName: "LOBBY",
            newSize: newLobbySize,
          })
        );
        dispatch(
          updateRoomSize({
            roomName: "LIVING ROOM",
            newSize: newLivingRoomSize,
          })
        );

        // Update room capacities
        dispatch(
          updateRoomCapacity({
            roomName: "LOBBY",
            newConfig: { area: newLobbySize[0] * newLobbySize[1] },
          })
        );
        dispatch(
          updateRoomCapacity({
            roomName: "LIVING ROOM",
            newConfig: { area: newLivingRoomSize[0] * newLivingRoomSize[1] },
          })
        );

        // Update positions
        dispatch(
          updateRoomPosition({
            roomName: "LOBBY",
            newPosition: [
              roomConfigs.LOBBY.position[0] - movementDelta * 0.5,
              roomConfigs.LOBBY.position[1],
              roomConfigs.LOBBY.position[2],
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "LIVING ROOM",
            newPosition: [
              roomConfigs["LIVING ROOM"].position[0] + movementDelta * 0.5,
              roomConfigs["LIVING ROOM"].position[1],
              roomConfigs["LIVING ROOM"].position[2],
            ],
          })
        );
      }
    };

    return (
      <>
        {/* HOUSE 3D MODEL - Completely separate group */}
        <group>
          <Suspense fallback={null}>
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <ambientLight intensity={0.2} />
            <Environment preset="apartment" background blur={0.6}>
              <Lightformer
                position={[10, 5, 0]}
                scale={[10, 1, 1]}
                intensity={2}
                color="#ffeded"
              />
              <Lightformer
                position={[-10, 5, 0]}
                scale={[10, 1, 1]}
                intensity={2}
                color="#edefff"
              />
            </Environment>

            <Stage
              environment="apartment"
              intensity={0.5}
              contactShadow={{ blur: 2, opacity: 0.5 }}
              shadowBias={-0.0015}
            >
              {/* ONLY the house 3D model is in Stage - can be moved independently */}
              <House100M showCeiling={showCeiling} />
            </Stage>

            <ContactShadows
              position={[0, 0, 0]}
              scale={15}
              resolution={1024}
              far={1}
              opacity={0.6}
              blur={1}
            />
          </Suspense>
        </group>

        {/* ROOM PLANS - Completely independent group at world coordinates */}
        <group ref={ref}>
          {/* Walls - independent of house */}
          {wallPositions.map((wallProps) => (
            <Wall
              key={wallProps.id}
              id={wallProps.id}
              {...wallProps}
              isEditMode={isEditingRooms}
              onMoveComplete={(finalPosition) =>
                handleWallMoveComplete(wallProps.id, finalPosition)
              }
            />
          ))}

          {/* Labels and occupancy - completely independent at world coordinates */}
          <RoomLabels100M />
          {showOccupancy && <RoomOccupancy100M roomOccupants={{}} />}
        </group>
      </>
    );
  }
);

export default HomeScene100M;
