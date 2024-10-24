import { createSlice } from "@reduxjs/toolkit";

const audioTimeSlice = createSlice({
    name: "audioTime",
    initialState: {
        playbackTimes: JSON.parse(localStorage.getItem("nsnPlaybackTimes") || "{}"),
        savePlaybackTime: JSON.parse(localStorage.getItem("nsnSavePlaybackTime") ?? "true")
    },
    reducers: {
        updatePlaybackTime: (state, action) => {
            if (!state.savePlaybackTime) return;

            const { title, time } = action.payload;
            state.playbackTimes[title] = time;
            localStorage.setItem("nsnPlaybackTimes", JSON.stringify(state.playbackTimes));
        },
        toggleSavePlaybackTime: (state) => {
            state.savePlaybackTime = !state.savePlaybackTime;
            localStorage.setItem("nsnSavePlaybackTime", JSON.stringify(state.savePlaybackTime));

            if (!state.savePlaybackTime) {
                state.playbackTimes = {};
                localStorage.removeItem("nsnPlaybackTimes");
            }
        },
        clearPlaybackTimes: (state) => {
            state.playbackTimes = {};
            localStorage.removeItem("nsnPlaybackTimes");
        },
        removePlaybackTime: (state, action) => {
            const episodeId = action.payload;
            delete state.playbackTimes[episodeId];
            localStorage.setItem("nsnPlaybackTimes", JSON.stringify(state.playbackTimes));
        }
    }
});

export const {
    updatePlaybackTime,
    toggleSavePlaybackTime,
    clearPlaybackTimes,
    removePlaybackTime
} = audioTimeSlice.actions;

export default audioTimeSlice.reducer;
