// src/scenes/RoomOccupancy100M.jsx
import React from "react";
import { Html } from "@react-three/drei";
import { useSelector } from "react-redux";
import { Users, AlertCircle } from "lucide-react";
import { selectRoomOccupancy100M } from "../store/humanSlice100M";
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
  const humanRoomOccupancy = useSelector(selectRoomOccupancy100M);

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

        // Use room config position + offset for occupancy display
        const position = [
          config.position[0],
          config.position[1] + 2.2, // Show above the room
          config.position[2],
        ];

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
