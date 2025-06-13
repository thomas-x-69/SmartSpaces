// src/store/roomConfigs100MSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  KITCHEN: {
    size: [8.5, 3.7],
    position: [8.5, -1.5, 7.6],
    color: "green",
    area: 20,
  },
  BATHROOM: {
    size: [3.5, 3.5],
    position: [2.6, -1.5, 7.5],
    color: "yellow",
    area: 14,
  },
  INVENTORY: {
    size: [8.5, 3.75],
    position: [-3.5, -1.5, -12.5],
    color: "purple",
    area: 9,
  },
  ROOM1: {
    size: [11, 7.5],
    position: [7.5, -1.5, -4.6],
    color: "red",
    area: 20,
  },
  "LIVING ROOM": {
    size: [9.4, 12],
    position: [-2.9, -1.5, -4.6],
    color: "blue",
    area: 30,
  },
  LOBBY: {
    size: [9.4, 14],
    position: [-2.9, -1.5, 8.6],
    color: "black",
    area: 48,
  },
  ROOM2: {
    size: [11, 6.75],
    position: [7.5, -1.5, 2.5],
    color: "orange",
    area: 16,
  },
  ROOM3: {
    size: [8, 7],
    position: [4.9, -1.5, -10],
    color: "cyan",
    area: 14,
  },
};

const roomConfigs100MSlice = createSlice({
  name: "roomConfigs100M",
  initialState,
  reducers: {
    updateRoomSize: (state, action) => {
      const { roomName, newSize } = action.payload;
      if (state[roomName]) {
        state[roomName].size = newSize;
        // Update area when size changes
        state[roomName].area = newSize[0] * newSize[1];
      }
    },
    updateRoomPosition: (state, action) => {
      const { roomName, newPosition } = action.payload;
      if (state[roomName]) {
        state[roomName].position = newPosition;
      }
    },
  },
});

export const { updateRoomSize, updateRoomPosition } =
  roomConfigs100MSlice.actions;
export const selectRoomConfigs100M = (state) => state.roomConfigs100M;
export default roomConfigs100MSlice.reducer;
