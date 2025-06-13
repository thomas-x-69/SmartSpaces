// src/constants/roomConstants100M.js

// Constants for calculations
export const WIDTH_MULTIPLIER_100M = 2.5;
export const DEPTH_MULTIPLIER_100M = 2.3;
export const AREA_DIVISOR_100M = 25;

// Independent room dimensions and positions - not derived from room configs
export const ROOM_DIMENSIONS_100M = {
  KITCHEN: {
    width: 5 * WIDTH_MULTIPLIER_100M,
    depth: 4 * DEPTH_MULTIPLIER_100M,
    area: 20,
    position: [-7, 0.4, -8], // Independent position for constants
  },
  BATHROOM: {
    width: 4 * WIDTH_MULTIPLIER_100M,
    depth: 3.5 * DEPTH_MULTIPLIER_100M,
    area: 14,
    position: [6, 0.4, -8], // Independent position for constants
  },
  INVENTORY: {
    width: 3 * WIDTH_MULTIPLIER_100M,
    depth: 3 * DEPTH_MULTIPLIER_100M,
    area: 9,
    position: [-8, 0.4, 0], // Independent position for constants
  },
  ROOM1: {
    width: 5 * WIDTH_MULTIPLIER_100M,
    depth: 4 * DEPTH_MULTIPLIER_100M,
    area: 20,
    position: [-3, 0.4, 8], // Independent position for constants
  },
  "LIVING ROOM": {
    width: 6 * WIDTH_MULTIPLIER_100M,
    depth: 5 * DEPTH_MULTIPLIER_100M,
    area: 30,
    position: [4, 0.4, 8], // Independent position for constants
  },
  LOBBY: {
    width: 8 * WIDTH_MULTIPLIER_100M,
    depth: 6 * DEPTH_MULTIPLIER_100M,
    area: 48,
    position: [0, 0.4, 0], // Independent position for constants
  },
  ROOM2: {
    width: 4 * WIDTH_MULTIPLIER_100M,
    depth: 4 * DEPTH_MULTIPLIER_100M,
    area: 16,
    position: [7, 0.4, -2], // Independent position for constants
  },
  ROOM3: {
    width: 4 * WIDTH_MULTIPLIER_100M,
    depth: 3.5 * DEPTH_MULTIPLIER_100M,
    area: 14,
    position: [-6, 0.4, 5], // Independent position for constants
  },
};
