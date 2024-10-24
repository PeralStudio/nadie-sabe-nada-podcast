import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentPodcast: null,
    isPlaying: false,
    showPlayer: false,
  },
  reducers: {
    setCurrentPodcast: (state, action) => {
      state.currentPodcast = action.payload;
    },
    togglePlay: (state, action) => {
      state.isPlaying = action.payload !== undefined ? action.payload : !state.isPlaying;
    },
    setShowPlayer: (state, action) => {
      state.showPlayer = action.payload;
    },
    closePersistentPlayer: (state) => {
      state.currentPodcast = null;
      state.isPlaying = false;
      state.showPlayer = false;
    },
  },
});

export const { 
  setCurrentPodcast, 
  togglePlay, 
  setShowPlayer, 
  closePersistentPlayer 
} = playerSlice.actions;

export default playerSlice.reducer;