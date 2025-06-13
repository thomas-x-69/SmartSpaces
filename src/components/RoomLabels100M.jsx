// src/components/RoomLabels100M.jsx
import { Text } from "@react-three/drei";
import { useSelector } from "react-redux";
import { selectRoomConfigs100M } from "../store/roomConfigs100MSlice";

const RoomLabels100M = () => {
  const roomConfigs = useSelector(selectRoomConfigs100M);

  // Create labels dynamically based on room configurations
  const roomLabels = Object.entries(roomConfigs).map(([roomName, config]) => ({
    name: roomName,
    position: [
      config.position[0],
      config.position[1] + 0.2, // Slightly above the floor
      config.position[2],
    ],
    // Scale based on room size for better visibility
    scale: Math.min(Math.max(0.5, (config.size[0] + config.size[1]) / 20), 2.0),
  }));

  return roomLabels.map((room, index) => (
    <Text
      key={index}
      position={room.position}
      rotation={[-Math.PI / 2, 0, -1.57]}
      fontSize={room.scale}
      color="#e7ded6"
      fillOpacity={0.5}
      anchorX="center"
      anchorY="middle"
      opacity={0.1}
      renderOrder={1}
      depthWrite={false}
      userData={{ type: "roomLabel" }}
    >
      {room.name}
    </Text>
  ));
};

export default RoomLabels100M;
