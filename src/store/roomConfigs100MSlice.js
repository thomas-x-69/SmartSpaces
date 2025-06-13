// src/store/roomConfigs100MSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  KITCHEN: {
    size: [8.5, 3.7],
    position: [6, -1.5, 7],
    color: "green",
    area: 20,
  },
  BATHROOM: {
    size: [3.5, 3.5],
    position: [0, -1.5, 7],
    color: "yellow",
    area: 14,
  },
  INVENTORY: {
    size: [8.5, 3.75],
    position: [-6.2, -1.5, -13.2],
    color: "purple",
    area: 9,
  },
  ROOM1: {
    size: [11, 7.5],
    position: [4.5, -1.5, -5],
    color: "red",
    area: 20,
  },
  "LIVING ROOM": {
    size: [9.4, 12],
    position: [-5.9, -1.5, -5.5],
    color: "blue",
    area: 30,
  },
  LOBBY: {
    size: [9.4, 14],
    position: [-5.9, -1.5, 8],
    color: "black",
    area: 48,
  },
  ROOM2: {
    size: [11, 6.75],
    position: [4.5, -1.5, 2],
    color: "orange",
    area: 16,
  },
  ROOM3: {
    size: [8, 7],
    position: [1.9, -1.5, -10.5],
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
