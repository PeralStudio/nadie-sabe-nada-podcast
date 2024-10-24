import { configureStore } from '@reduxjs/toolkit';
import podcastReducer from './slices/podcastSlice';
import playerReducer from './slices/playerSlice';
import filterReducer from './slices/filterSlice';
import audioTimeReducer from './slices/audioTimeSlice';

export const store = configureStore({
  reducer: {
    podcast: podcastReducer,
    player: playerReducer,
    filter: filterReducer,
    audioTime: audioTimeReducer,
  },
});