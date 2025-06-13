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

import {
  WIDTH_MULTIPLIER_100M,
  DEPTH_MULTIPLIER_100M,
  AREA_DIVISOR_100M,
} from "../constants/roomConstants100M";
import House100M from "../components/House100M";
import RoomLabels100M from "../components/RoomLabels100M";
import Wall from "../components/Wall";
import RoomOccupancy100M from "./RoomOccupancy100M";

const HomeScene100M = forwardRef(
  ({ showCeiling, showOccupancy, isEditingRooms }, ref) => {
    const roomConfigs = useSelector(selectRoomConfigs100M);
    const dispatch = useDispatch();

    // Wall positions for 100M home - ORIGINAL positions (restored)
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
        position: [-20.8, -2.2, -1.05], // Between lobby and living room area
        rotation: [0, Math.PI / 2, 0], // Rotated 90 degrees
        scale: [1, 0.818, 1.8],
        initialX: -20.8,
        initialZ: -1.05,
      },
    ];

    // Handle wall movement completion - EXACTLY like 50M home mechanism
    const handleWallMoveComplete = (wallId, finalPosition) => {
      console.log("Wall move complete:", { wallId, finalPosition });
      const wallConfig = wallPositions.find((w) => w.id === wallId);
      if (!wallConfig) return;

      const movementDelta = (finalPosition.z - wallConfig.initialZ) * 0.65;

      if (wallId === "wall100m_1") {
        // Calculate new dimensions - FIXED directional logic
        const newRoom1Size = [
          roomConfigs.ROOM1.size[0],
          Math.max(3, 7.5 + movementDelta * 1.9), // Room1 increases when wall moves +Z
        ];
        const newRoom2Size = [
          roomConfigs.ROOM2.size[0],
          Math.max(3, 6.75 - movementDelta * 1.9), // Room2 decreases when wall moves +Z
        ];

        // Update sizes
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

        // Update room capacities with new areas - same calculation as 50M
        dispatch(
          updateRoomCapacity({
            roomName: "ROOM1",
            newConfig: {
              area:
                (newRoom1Size[0] *
                  WIDTH_MULTIPLIER_100M *
                  newRoom1Size[1] *
                  DEPTH_MULTIPLIER_100M) /
                AREA_DIVISOR_100M,
            },
          })
        );
        console.log("Updated Room1 capacity:", {
          size: newRoom1Size,
          area:
            (newRoom1Size[0] *
              WIDTH_MULTIPLIER_100M *
              newRoom1Size[1] *
              DEPTH_MULTIPLIER_100M) /
            AREA_DIVISOR_100M,
        });

        dispatch(
          updateRoomCapacity({
            roomName: "ROOM2",
            newConfig: {
              area:
                (newRoom2Size[0] *
                  WIDTH_MULTIPLIER_100M *
                  newRoom2Size[1] *
                  DEPTH_MULTIPLIER_100M) /
                AREA_DIVISOR_100M,
            },
          })
        );
        console.log("Updated Room2 capacity:", {
          size: newRoom2Size,
          area:
            (newRoom2Size[0] *
              WIDTH_MULTIPLIER_100M *
              newRoom2Size[1] *
              DEPTH_MULTIPLIER_100M) /
            AREA_DIVISOR_100M,
        });

        // Note: Adjust positions slightly so rooms grow/shrink from wall side, not center
        dispatch(
          updateRoomPosition({
            roomName: "ROOM1",
            newPosition: [
              4.5,
              -1.5,
              -5 + movementDelta * 0.5, // Room1 position shifts to show growth from wall side
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "ROOM2",
            newPosition: [
              4.5,
              -1.5,
              2 + movementDelta * 0.5, // Room2 position shifts to show shrinking from wall side
            ],
          })
        );
      } else if (wallId === "wall100m_2") {
        // Calculate new dimensions - FIXED directional logic
        const newLivingRoomSize = [
          roomConfigs["LIVING ROOM"].size[0],
          Math.max(4, 12 + movementDelta * 2), // Living Room increases when wall moves +Z
        ];
        const newLobbySize = [
          roomConfigs.LOBBY.size[0],
          Math.max(4, 14 - movementDelta * 2), // Lobby decreases when wall moves +Z
        ];

        // Update sizes
        dispatch(
          updateRoomSize({
            roomName: "LIVING ROOM",
            newSize: newLivingRoomSize,
          })
        );
        dispatch(
          updateRoomSize({
            roomName: "LOBBY",
            newSize: newLobbySize,
          })
        );

        // Update room capacities with new areas - same calculation as 50M
        dispatch(
          updateRoomCapacity({
            roomName: "LIVING ROOM",
            newConfig: {
              area:
                (newLivingRoomSize[0] *
                  WIDTH_MULTIPLIER_100M *
                  newLivingRoomSize[1] *
                  DEPTH_MULTIPLIER_100M) /
                AREA_DIVISOR_100M,
            },
          })
        );
        console.log("Updated Living Room capacity:", {
          size: newLivingRoomSize,
          area:
            (newLivingRoomSize[0] *
              WIDTH_MULTIPLIER_100M *
              newLivingRoomSize[1] *
              DEPTH_MULTIPLIER_100M) /
            AREA_DIVISOR_100M,
        });

        dispatch(
          updateRoomCapacity({
            roomName: "LOBBY",
            newConfig: {
              area:
                (newLobbySize[0] *
                  WIDTH_MULTIPLIER_100M *
                  newLobbySize[1] *
                  DEPTH_MULTIPLIER_100M) /
                AREA_DIVISOR_100M,
            },
          })
        );
        console.log("Updated Lobby capacity:", {
          size: newLobbySize,
          area:
            (newLobbySize[0] *
              WIDTH_MULTIPLIER_100M *
              newLobbySize[1] *
              DEPTH_MULTIPLIER_100M) /
            AREA_DIVISOR_100M,
        });

        // Note: Adjust positions slightly so rooms grow/shrink from wall side, not center
        dispatch(
          updateRoomPosition({
            roomName: "LIVING ROOM",
            newPosition: [
              -5.9,
              -1.5,
              -5.5 + movementDelta * 0.5, // Living Room position shifts to show growth from wall side
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "LOBBY",
            newPosition: [
              -5.9,
              -1.5,
              8 + movementDelta * 0.5, // Lobby position shifts to show shrinking from wall side
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
