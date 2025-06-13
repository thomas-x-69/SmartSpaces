// src/scenes/RoomOccupancy100M.jsx
import React from "react";
import { Html } from "@react-three/drei";
import { useSelector } from "react-redux";
import { Users, AlertCircle } from "lucide-react";
import { selectRoomOccupancy } from "../store/humanSlice";
import { selectRoomConfigs100M } from "../store/roomConfigs100MSlice";

const SPACE_PER_PERSON = 3.0; // 1 person per 3m²

const OccupancyDisplay = ({ roomName, data, currentCount, position }) => {
  const isAtCapacity = currentCount >= data.maxCapacity;
  const occupancyPercentage = (currentCount / data.maxCapacity) * 100;
  const spacePerPerson =
    currentCount > 0 ? data.area / currentCount : data.area;

  let statusColor = "bg-green-500";
  if (occupancyPercentage >= 90) {
    statusColor = "bg-red-500";
  } else if (occupancyPercentage >= 75) {
    statusColor = "bg-yellow-500";
  }

  return (
    <Html position={position} center>
      <div
        className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm
                     shadow-lg border border-white/10 min-w-[300px]"
      >
        <div className="flex flex-col gap-2">
          {/* Room Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="font-medium">{roomName}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          </div>

          {/* Occupancy Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              People: {currentCount}/{data.maxCapacity}
            </div>
            <div className="flex gap-1">
              {/* Space Info */}
              <div className="text-xs text-white/60 flex items-center gap-1">
                <span>Area: {data.area.toFixed(1)}m²</span>
                <span className="mx-1">•</span>
                <span>{spacePerPerson.toFixed(1)}m² per person</span>
              </div>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${statusColor}`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>

          {/* Warnings */}
          {isAtCapacity && (
            <div className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Maximum capacity reached</span>
            </div>
          )}
        </div>
      </div>
    </Html>
  );
};

const RoomOccupancy100M = ({ homeRef }) => {
  const roomConfigs = useSelector(selectRoomConfigs100M);
  const humanRoomOccupancy = useSelector(selectRoomOccupancy);

  // Independent occupancy display positions - only display is at 0,0,0 from its label
  const occupancyPositions = {
    KITCHEN: [-20, 1.2, -6], // Independent position (0,0,0 from label at [-5, 0.4, -6])
    BATHROOM: [8, 1.2, -6], // Independent position (0,0,0 from label at [8, 0.4, -6])
    INVENTORY: [-10, 1.2, 2], // Independent position (0,0,0 from label at [-10, 0.4, 2])
    ROOM1: [-1, 1.2, 10], // Independent position (0,0,0 from label at [-1, 0.4, 10])
    "LIVING ROOM": [6, 1.2, 10], // Independent position (0,0,0 from label at [6, 0.4, 10])
    LOBBY: [2, 1.2, 2], // Independent position (0,0,0 from label at [2, 0.4, 2])
    ROOM2: [9, 1.2, 0], // Independent position (0,0,0 from label at [9, 0.4, 0])
    ROOM3: [-4, 1.2, 7], // Independent position (0,0,0 from label at [-4, 0.4, 7])
  };

  return (
    <group>
      {Object.entries(roomConfigs).map(([roomName, config]) => {
        const area = config.area;

        // Get the current occupancy data
        const occupancyData = humanRoomOccupancy[roomName] || {
          currentOccupancy: 0,
          maxCapacity: Math.floor(area / SPACE_PER_PERSON),
        };

        const data = {
          maxCapacity: occupancyData.maxCapacity,
          area: area,
        };

        // Use independent occupancy position
        const position = occupancyPositions[roomName];
        if (!position) return null;

        return (
          <OccupancyDisplay
            key={roomName}
            roomName={roomName.replace("_", " ")}
            data={data}
            currentCount={occupancyData.currentOccupancy}
            position={position}
          />
        );
      })}
    </group>
  );
};

export default RoomOccupancy100M;
