// src/components/RoomLabels100M.jsx
import { Text } from "@react-three/drei";

const RoomLabels100M = () => {
  // Independent label positions - not derived from room configs
  const rooms = [
    { name: "KITCHEN", position: [14, 0.4, 15.6], scale: 0.6 },
    { name: "BATHROOM", position: [7.5, 0.4, 15.6], scale: 0.5 },
    { name: "INVENTORY", position: [1, 0.4, -4.7], scale: 0.6 },
    { name: "ROOM1", position: [15.5, 0.4, 3.6], scale: 1.7 },
    { name: "LIVING ROOM", position: [2, 0.4, 3], scale: 1.7 },
    { name: "LOBBY", position: [2, 0.4, 17], scale: 2 },
    { name: "ROOM2", position: [15.5, 0.4, 10.8], scale: 1.5 },
    { name: "ROOM3", position: [10, 0.4, -2], scale: 1.3 },
  ];

  return rooms.map((room, index) => (
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
