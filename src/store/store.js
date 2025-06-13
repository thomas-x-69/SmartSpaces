// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import roomReducer from "./roomSlice";
import humanReducer from "./humanSlice";
import roomConfigsReducer from "./roomConfigsSlice";
import roomConfigs100MReducer from "./roomConfigs100MSlice";
import humanSlice100MReducer from "./humanSlice100M";

// Enable Map and Set support in Immer
enableMapSet();

const store = configureStore({
  reducer: {
    rooms: roomReducer,
    humans: humanReducer,
    roomConfigs: roomConfigsReducer,
    roomConfigs100M: roomConfigs100MReducer,
    humans100M: humanSlice100MReducer,
  },
});

export default store;
