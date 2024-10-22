import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";

import PodcastList from "./components/PodcastList/PodcastList";
import PodcastDetail from "./components/PodcastDetail/PodcastDetail";
import LastPodcast from "./components/LastPodcast/LastPodcast";
import PersistentPlayer from "./components/PersistentPlayer/PersistentPlayer";
import NotFound from "./components/NotFound/NotFound";

const localStorageKey = "nsnPodcastSongs";
const lastUpdatedKey = "nsnPodcastLastUpdated";
const listenedKey = "nsnPodcastListened";

const App = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [listenedEpisodes, setListenedEpisodes] = useState([]);
    const [filter, setFilter] = useState("todos");
    const [currentPodcast, setCurrentPodcast] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    const location = useLocation();

    const checkForNewSongs = useCallback(async () => {
        try {
            const response = await axios.get(
                "https://nsn-podcast-api-rapidapi.netlify.app/last-podcast"
            );
            const latestSong = response.data;
            const storedPubDate = localStorage.getItem(lastUpdatedKey);

            if (!storedPubDate || latestSong.pubDate !== storedPubDate) {
                await fetchSongsFromAPI();
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error al verificar nuevas canciones", error);
            setError("Error al verificar nuevas canciones");
            setLoading(false);
        }
    }, []);

    const fetchSongsFromAPI = async () => {
        try {
            const response = await axios.get(
                "https://nsn-podcast-api-rapidapi.netlify.app/podcast"
            );
            const fetchedSongs = response.data.allEpisodes;

            setSongs(fetchedSongs);
            localStorage.setItem(localStorageKey, JSON.stringify(fetchedSongs));
            const latestPubDate = fetchedSongs[0].pubDate;
            localStorage.setItem(lastUpdatedKey, latestPubDate);
        } catch (error) {
            console.error("Error al obtener los MP3s", error);
            setError("Error al obtener los MP3s");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedSongs = localStorage.getItem(localStorageKey);
        const storedListened = localStorage.getItem(listenedKey);

        if (storedSongs) {
            setSongs(JSON.parse(storedSongs));
            setLoading(false);
        }

        if (storedListened) {
            setListenedEpisodes(JSON.parse(storedListened));
        }

        checkForNewSongs();
    }, [checkForNewSongs]);

    const toggleListened = (song) => {
        const newListened = listenedEpisodes.includes(song.title)
            ? listenedEpisodes.filter((title) => title !== song.title)
            : [...listenedEpisodes, song.title];

        setListenedEpisodes(newListened);
        localStorage.setItem(listenedKey, JSON.stringify(newListened));
    };

    const filteredSongs = songs.filter((song) => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "escuchados") {
            return matchesSearch && listenedEpisodes.includes(song.title);
        } else if (filter === "no-escuchados") {
            return matchesSearch && !listenedEpisodes.includes(song.title);
        }

        return matchesSearch;
    });

    const override = {
        margin: "30px auto",
        borderColor: "#16db93"
    };

    const handleClear = () => {
        setSearchTerm("");
    };

    const handlePlayPodcast = (podcast) => {
        if (currentPodcast && currentPodcast.title === podcast.title) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentPodcast(podcast);
            setIsPlaying(true);
        }
        setShowPlayer(true);
    };

    const stopPlayingAudio = () => {
        setIsPlaying(false);
    };

    const handleClosePersistentPlayer = () => {
        setCurrentPodcast(null);
        setIsPlaying(false);
        setShowPlayer(false);
    };

    const handleTogglePlay = (playing) => {
        setIsPlaying(playing);
    };

    return (
        <div className={styles.container}>
            {/* <h1 className={styles.title}>Nadie Sabe Nada Podcast</h1> */}
            {location.pathname === "/" && !loading && (
                <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <Route
                        path="/"
                        element={
                            <PodcastList
                                filteredSongs={filteredSongs}
                                filter={filter}
                                setFilter={setFilter}
                                listenedEpisodes={listenedEpisodes}
                                toggleListened={toggleListened}
                                onPlayPodcast={handlePlayPodcast}
                                isPlaying={isPlaying}
                                currentPodcast={currentPodcast}
                            />
                        }
                    />
                    <Route
                        path="/podcast/:id"
                        element={
                            <PodcastDetail
                                songs={songs}
                                listenedEpisodes={listenedEpisodes}
                                toggleListened={toggleListened}
                                onPlayPodcast={handlePlayPodcast}
                                isPlaying={isPlaying}
                                currentPodcast={currentPodcast}
                                stopPlayingAudio={stopPlayingAudio}
                            />
                        }
                    />
                    <Route
                        path="/ultimo-episodio"
                        element={
                            <LastPodcast
                                songs={songs}
                                listenedEpisodes={listenedEpisodes}
                                toggleListened={toggleListened}
                                onPlayPodcast={handlePlayPodcast}
                                isPlaying={isPlaying}
                                currentPodcast={currentPodcast}
                                stopPlayingAudio={stopPlayingAudio}
                            />
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            )}
            <AnimatePresence>
                {showPlayer && (
                    <PersistentPlayer
                        currentPodcast={currentPodcast}
                        onClose={handleClosePersistentPlayer}
                        isPlaying={isPlaying}
                        onTogglePlay={handleTogglePlay}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
