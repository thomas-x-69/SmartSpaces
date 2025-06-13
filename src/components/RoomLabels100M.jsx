// src/components/RoomLabels100M.jsx
import { Text } from "@react-three/drei";

const RoomLabels100M = () => {
  const rooms = [
    { name: "KITCHEN", position: [6, -1.4, 7], scale: 0.7 },
    { name: "BATHROOM", position: [0, -1.4, 7], scale: 0.5 },
    { name: "INVENTORY", position: [-6, -1.4, -13.2], scale: 0.6 },
    { name: "ROOM1", position: [8.5, -1.4, -5], scale: 1.5 },
    { name: "LIVING ROOM", position: [-6, -1.4, -5.5], scale: 1.7 },
    { name: "LOBBY", position: [-6, -1.4, 8], scale: 2 },
    { name: "ROOM2", position: [8.5, -1.4, 1.6], scale: 1.2 },
    { name: "ROOM3", position: [2.5, -1.4, -10.6], scale: 1.3 },
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
