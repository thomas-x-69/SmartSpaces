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
import { updateRoomCapacity } from "../store/humanSlice100M";

// Component Imports
import House100M from "../components/House100M";
import RoomLabels100M from "../components/RoomLabels100M";
import Wall from "../components/Wall";
import RoomOccupancy100M from "./RoomOccupancy100M";

const HomeScene100M = forwardRef(
  ({ showCeiling, showOccupancy, isEditingRooms }, ref) => {
    const roomConfigs = useSelector(selectRoomConfigs100M);
    const dispatch = useDispatch();

    // Wall positions for 100M home - ORIGINAL positions
    const wallPositions = [
      {
        id: "wall100m_1",
        position: [-13.2, -2.2, -2.2], // Between room1 and room2 area
        rotation: [0, Math.PI / 2, 0], // Rotated 90 degrees
        scale: [0.5, 0.818, 2.1],
        initialX: -13.2,
        initialZ: -2.2,
      },
      {
        id: "wall100m_2",
        position: [-20.8, -2.2, -1.05], // Between room1 and room2 area
        rotation: [0, Math.PI / 2, 0], // Rotated 90 degrees
        scale: [1, 0.818, 1.8],
        initialX: -20.8,
        initialZ: -1.05,
      },
    ];

    // Handle wall movement completion - ORIGINAL logic
    const handleWallMoveComplete = (wallId, finalPosition) => {
      console.log("Wall move complete:", { wallId, finalPosition });
      const wallConfig = wallPositions.find((w) => w.id === wallId);
      if (!wallConfig) return;

      if (wallId === "wall100m_1") {
        // Wall between room1 and room2 - adjust these rooms VERTICALLY (depth)
        const movementDelta = (finalPosition.z - wallConfig.initialZ) * 0.5;

        const newRoom1Size = [
          roomConfigs.ROOM1.size[0], // width stays the same
          Math.max(3, roomConfigs.ROOM1.size[1] - movementDelta), // depth changes
        ];
        const newRoom2Size = [
          roomConfigs.ROOM2.size[0], // width stays the same
          Math.max(3, roomConfigs.ROOM2.size[1] + movementDelta), // depth changes
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
        console.log("Updated Room1 capacity:", {
          size: newRoom1Size,
          area: newRoom1Size[0] * newRoom1Size[1],
        });

        dispatch(
          updateRoomCapacity({
            roomName: "ROOM2",
            newConfig: { area: newRoom2Size[0] * newRoom2Size[1] },
          })
        );
        console.log("Updated Room2 capacity:", {
          size: newRoom2Size,
          area: newRoom2Size[0] * newRoom2Size[1],
        });

        // Update Z positions with wall movement (vertical movement)
        dispatch(
          updateRoomPosition({
            roomName: "ROOM1",
            newPosition: [
              roomConfigs.ROOM1.position[0],
              roomConfigs.ROOM1.position[1],
              roomConfigs.ROOM1.position[2] - movementDelta * 0.5,
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "ROOM2",
            newPosition: [
              roomConfigs.ROOM2.position[0],
              roomConfigs.ROOM2.position[1],
              roomConfigs.ROOM2.position[2] + movementDelta * 0.5,
            ],
          })
        );
      } else if (wallId === "wall100m_2") {
        // Wall between lobby and living room - adjust VERTICALLY like wall1 (depth)
        const movementDelta = (finalPosition.z - wallConfig.initialZ) * 0.5;

        const newLobbySize = [
          roomConfigs.LOBBY.size[0], // width stays the same
          Math.max(4, roomConfigs.LOBBY.size[1] - movementDelta), // depth changes
        ];
        const newLivingRoomSize = [
          roomConfigs["LIVING ROOM"].size[0], // width stays the same
          Math.max(4, roomConfigs["LIVING ROOM"].size[1] + movementDelta), // depth changes
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

        // Update Z positions with wall movement (vertical movement like wall1)
        dispatch(
          updateRoomPosition({
            roomName: "LOBBY",
            newPosition: [
              roomConfigs.LOBBY.position[0],
              roomConfigs.LOBBY.position[1],
              roomConfigs.LOBBY.position[2] - movementDelta * 0.5,
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "LIVING ROOM",
            newPosition: [
              roomConfigs["LIVING ROOM"].position[0],
              roomConfigs["LIVING ROOM"].position[1],
              roomConfigs["LIVING ROOM"].position[2] + movementDelta * 0.5,
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
