import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const closePersistentPlayerAsync = createAsyncThunk(
    "player/closePersistentPlayerAsync",
    (_, { dispatch }) => {
        dispatch(playerSlice.actions.closePlayer());

        setTimeout(() => {
            dispatch(playerSlice.actions.clearCurrentPodcast());
        }, 800);
    }
);

const playerSlice = createSlice({
    name: "player",
    initialState: {
        currentPodcast: null,
        isPlaying: false,
        showPlayer: false
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
        closePlayer: (state) => {
            state.isPlaying = false;
            state.showPlayer = false;
        },
        clearCurrentPodcast: (state) => {
            state.currentPodcast = null;
        }
    }
});

export const { setCurrentPodcast, togglePlay, setShowPlayer, closePlayer, clearCurrentPodcast } =
    playerSlice.actions;

export default playerSlice.reducer;
