import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",
    initialState: {
        currentFilter: "todos",
        currentPage: 1,
        songsPerPage: 12
    },
    reducers: {
        setFilter: (state, action) => {
            state.currentFilter = action.payload;
            state.currentPage = 1;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }
});

export const { setFilter, setCurrentPage } = filterSlice.actions;
export default filterSlice.reducer;
