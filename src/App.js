import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import RingLoader from "react-spinners/RingLoader";

import PodcastList from "./components/PodcastList/PodcastList";
import PodcastDetail from "./components/PodcastDetail/PodcastDetail";
import LastPodcast from "./components/LastPodcast/LastPodcast";
import PersistentPlayer from "./components/PersistentPlayer/PersistentPlayer";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchPodcasts, setSearchTerm } from "./store/slices/podcastSlice";
import { setFilter } from "./store/slices/filterSlice";
import {
    setCurrentPodcast,
    togglePlay,
    setShowPlayer,
    closePersistentPlayerAsync
} from "./store/slices/playerSlice";

const App = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { loading, error, searchTerm } = useSelector((state) => state.podcast);
    const { currentPodcast, showPlayer } = useSelector((state) => state.player);

    useEffect(() => {
        dispatch(fetchPodcasts());
    }, [dispatch]);

    const handleClear = () => {
        dispatch(setSearchTerm(""));
    };

    const handleSearchChange = (e) => {
        dispatch(setFilter("todos"));
        dispatch(setSearchTerm(e.target.value));
    };

    const handlePlayPodcast = (podcast) => {
        if (currentPodcast && currentPodcast.title === podcast.title) {
            dispatch(togglePlay());
        } else {
            dispatch(setCurrentPodcast(podcast));
            dispatch(togglePlay(true));
        }
        dispatch(setShowPlayer(true));
    };

    const override = {
        margin: "30px auto",
        borderColor: "#16db93"
    };

    return (
        <div className={styles.container}>
            {location.pathname === "/" && !loading && (
                <TextField
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar Podcast..."
                    variant="outlined"
                    className={styles.searchInput}
                    fullWidth
                    size="small"
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "black",
                            fontWeight: "bold"
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#16DB93",
                                borderRadius: "60px"
                            },
                            "&:hover fieldset": {
                                borderColor: "#16DB93",
                                borderRadius: "60px"
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#16DB93",
                                borderRadius: "60px"
                            }
                        }
                    }}
                    InputProps={{
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClear}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            )}
            {loading && (
                <div className={styles.loaderContainer}>
                    <p className={styles.pLoading}>Cargando Podcast...</p>
                    <RingLoader
                        loading={loading}
                        cssOverride={override}
                        size={60}
                        aria-label="Loading podcast"
                        data-testid="loading"
                        speedMultiplier={0.8}
                        color={override.borderColor}
                    />
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && (
                <Routes>
                    <Route path="/" element={<PodcastList onPlayPodcast={handlePlayPodcast} />} />
                    <Route
                        path="/podcast/:id"
                        element={<PodcastDetail onPlayPodcast={handlePlayPodcast} />}
                    />
                    <Route
                        path="/ultimo-episodio"
                        element={<LastPodcast onPlayPodcast={handlePlayPodcast} />}
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            )}
            <AnimatePresence>
                {showPlayer && (
                    <PersistentPlayer onClose={() => dispatch(closePersistentPlayerAsync())} />
                )}
            </AnimatePresence>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={true}
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default App;
