// src/constants/roomConstants100M.js
import { initialState as initialRoomConfigs100M } from "../store/roomConfigs100MSlice";

// Constants for calculations
export const WIDTH_MULTIPLIER_100M = 2.5;
export const DEPTH_MULTIPLIER_100M = 2.3;
export const AREA_DIVISOR_100M = 25;

// Room dimensions using consistent positions from room configs
export const ROOM_DIMENSIONS_100M = {
  KITCHEN: {
    width: initialRoomConfigs100M.KITCHEN.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.KITCHEN.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.KITCHEN.area,
    position: initialRoomConfigs100M.KITCHEN.position,
  },
  BATHROOM: {
    width: initialRoomConfigs100M.BATHROOM.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.BATHROOM.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.BATHROOM.area,
    position: initialRoomConfigs100M.BATHROOM.position,
  },
  INVENTORY: {
    width: initialRoomConfigs100M.INVENTORY.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.INVENTORY.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.INVENTORY.area,
    position: initialRoomConfigs100M.INVENTORY.position,
  },
  ROOM1: {
    width: initialRoomConfigs100M.ROOM1.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.ROOM1.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.ROOM1.area,
    position: initialRoomConfigs100M.ROOM1.position,
  },
  "LIVING ROOM": {
    width:
      initialRoomConfigs100M["LIVING ROOM"].size[0] * WIDTH_MULTIPLIER_100M,
    depth:
      initialRoomConfigs100M["LIVING ROOM"].size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M["LIVING ROOM"].area,
    position: initialRoomConfigs100M["LIVING ROOM"].position,
  },
  LOBBY: {
    width: initialRoomConfigs100M.LOBBY.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.LOBBY.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.LOBBY.area,
    position: initialRoomConfigs100M.LOBBY.position,
  },
  ROOM2: {
    width: initialRoomConfigs100M.ROOM2.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.ROOM2.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.ROOM2.area,
    position: initialRoomConfigs100M.ROOM2.position,
  },
  ROOM3: {
    width: initialRoomConfigs100M.ROOM3.size[0] * WIDTH_MULTIPLIER_100M,
    depth: initialRoomConfigs100M.ROOM3.size[1] * DEPTH_MULTIPLIER_100M,
    area: initialRoomConfigs100M.ROOM3.area,
    position: initialRoomConfigs100M.ROOM3.position,
  },
};
