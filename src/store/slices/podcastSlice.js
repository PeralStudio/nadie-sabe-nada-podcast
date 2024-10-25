import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPodcasts = createAsyncThunk("podcast/fetchPodcasts", async () => {
    const response = await axios.get("https://nsn-podcast-api-rapidapi.netlify.app/podcast");
    return response.data.allEpisodes;
});

const podcastSlice = createSlice({
    name: "podcast",
    initialState: {
        songs: [],
        loading: true,
        error: null,
        listenedEpisodes: JSON.parse(localStorage.getItem("nsnPodcastListened") || "[]"),
        favoriteEpisodes: JSON.parse(localStorage.getItem("nsnPodcastFavorites") || "[]"),
        completedEpisodes: JSON.parse(localStorage.getItem("nsnPodcastCompleted") || "[]"),
        listenLaterEpisodes: JSON.parse(localStorage.getItem("nsnPodcastListenLater") || "[]"),
        searchTerm: ""
    },
    reducers: {
        toggleFavorite: (state, action) => {
            const songTitle = action.payload.title;
            const isFavorite = state.favoriteEpisodes.includes(songTitle);

            if (isFavorite) {
                state.favoriteEpisodes = state.favoriteEpisodes.filter(
                    (title) => title !== songTitle
                );
            } else {
                state.favoriteEpisodes.push(songTitle);
            }

            localStorage.setItem("nsnPodcastFavorites", JSON.stringify(state.favoriteEpisodes));
        },
        toggleListenLater: (state, action) => {
            const songTitle = action.payload.title;
            const isListenLater = state.listenLaterEpisodes.includes(songTitle);

            if (isListenLater) {
                state.listenLaterEpisodes = state.listenLaterEpisodes.filter(
                    (title) => title !== songTitle
                );
            } else {
                state.listenLaterEpisodes.push(songTitle);
            }

            localStorage.setItem("nsnPodcastListenLater", JSON.stringify(state.listenLaterEpisodes));
        },
        markAsCompleted: (state, action) => {
            const songTitle = action.payload;
            if (!state.completedEpisodes.includes(songTitle)) {
                state.completedEpisodes.push(songTitle);
                localStorage.setItem(
                    "nsnPodcastCompleted",
                    JSON.stringify(state.completedEpisodes)
                );
            }
        },
        removeFromCompleted: (state, action) => {
            const songTitle = action.payload;
            state.completedEpisodes = state.completedEpisodes.filter(
                (title) => title !== songTitle
            );
            localStorage.setItem("nsnPodcastCompleted", JSON.stringify(state.completedEpisodes));
        },
        deleteEpisode: (state, action) => {},
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearFavorites: (state) => {
            state.favoriteEpisodes = [];
            localStorage.setItem("nsnPodcastFavorites", JSON.stringify([]));
        },
        clearListenLater: (state) => {
            state.listenLaterEpisodes = [];
            localStorage.setItem("nsnPodcastListenLater", JSON.stringify([]));
        },
        clearStarted: (state) => {
            state.listenedEpisodes = [];
            localStorage.setItem("nsnPodcastListened", JSON.stringify([]));
        },
        clearCompleted: (state) => {
            state.completedEpisodes = [];
            localStorage.setItem("nsnPodcastCompleted", JSON.stringify([]));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPodcasts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPodcasts.fulfilled, (state, action) => {
                state.loading = false;
                state.songs = action.payload;
                state.error = null;
            })
            .addCase(fetchPodcasts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const {
    toggleFavorite,
    toggleListenLater,
    setSearchTerm,
    deleteEpisode,
    markAsCompleted,
    removeFromCompleted,
    clearFavorites,
    clearListenLater,
    clearStarted,
    clearCompleted
} = podcastSlice.actions;
export default podcastSlice.reducer;