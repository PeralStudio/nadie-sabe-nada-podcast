import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastList.module.css";
import MP3Player from "../MP3Player/MP3Player";
import Pagination from "../Pagination/Pagination";
import NoResults from "../NoResults/NoResults";
import { slugify } from "../../utils/slugify";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
    Headphones,
    HeadsetOff,
    Favorite,
    FormatListBulleted,
    CheckCircle,
    WatchLater
} from "@mui/icons-material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Fade } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite, toggleListenLater } from "../../store/slices/podcastSlice";
import { setFilter, setCurrentPage } from "../../store/slices/filterSlice";
import useMobileDetect from "../../hooks/useMobileDetect";

const PodcastList = ({ onPlayPodcast }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMobileDetect();

    const { songs, favoriteEpisodes, listenLaterEpisodes, searchTerm, completedEpisodes } =
        useSelector((state) => state.podcast);
    const { currentFilter, currentPage, songsPerPage } = useSelector((state) => state.filter);
    const { currentPodcast, isPlaying } = useSelector((state) => state.player);
    const { playbackTimes } = useSelector((state) => state.audioTime);

    const filteredSongs = songs.filter((song) => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase());
        const isStarted = playbackTimes[song.title] > 0;
        const isCompleted = completedEpisodes.includes(song.title);

        switch (currentFilter) {
            case "empezados":
                return matchesSearch && isStarted && !isCompleted;
            case "no-empezados":
                return matchesSearch && !isStarted && !isCompleted;
            case "favoritos":
                return matchesSearch && favoriteEpisodes.includes(song.title);
            case "escuchar-mas-tarde":
                return matchesSearch && listenLaterEpisodes.includes(song.title);
            case "completados":
                return matchesSearch && isCompleted;
            default:
                return matchesSearch;
        }
    });

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

    const handleCardClick = (song) => {
        navigate(`/podcast/${slugify(song.title)}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 12,
                mass: 0.95
            }
        },
        hover: {
            scale: 1.05,
            rotate: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 12
            }
        }
    };

    const BootstrapTooltip = useMemo(
        () =>
            styled(({ className, ...props }) => (
                <Tooltip {...props} arrow classes={{ popper: className }} />
            ))(({ theme }) => ({
                [`& .${tooltipClasses.arrow}`]: {
                    color: "#14D993"
                },
                [`& .${tooltipClasses.tooltip}`]: {
                    backgroundColor: "#14DB93",
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "5px 10px",
                    borderRadius: "5px"
                }
            })),
        []
    );

    return (
        <>
            <Helmet>
                <title>
                    Nadie Sabe Nada | Podcast de Humor y Comedia con Andreu Buenafuente y Berto
                    Romero
                </title>
            </Helmet>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={(page) => dispatch(setCurrentPage(page))}
                songsPerPage={songsPerPage}
                songs={filteredSongs}
            />
            <motion.div
                style={{
                    display: "flex",
                    maxHeight: "2rem",
                    justifyContent: "center",
                    marginBottom: "2.5rem",
                    gap: isMobile ? "0.1rem" : "0.3rem"
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BootstrapTooltip
                    title="Todos los Podcasts"
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <motion.button
                            whileHover={{ scale: 1.1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            className={
                                currentFilter === "todos" ? styles.activeButton : styles.button
                            }
                            onClick={() => dispatch(setFilter("todos"))}
                        >
                            <FormatListBulleted className={styles.headphonesIcon} />
                        </motion.button>
                    </span>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title="Podcasts empezados"
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <motion.button
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={
                                currentFilter === "empezados" ? styles.activeButton : styles.button
                            }
                            onClick={() => dispatch(setFilter("empezados"))}
                        >
                            <Headphones className={styles.headphonesIcon} />
                        </motion.button>
                    </span>
                </BootstrapTooltip>

                <BootstrapTooltip
                    title="Podcasts no empezados"
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={
                                currentFilter === "no-empezados"
                                    ? styles.activeButton
                                    : styles.button
                            }
                            onClick={() => dispatch(setFilter("no-empezados"))}
                        >
                            <HeadsetOff className={styles.headphonesIcon} />
                        </motion.button>
                    </span>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title="Podcasts favoritos"
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={
                                currentFilter === "favoritos" ? styles.activeButton : styles.button
                            }
                            onClick={() => dispatch(setFilter("favoritos"))}
                        >
                            <Favorite className={styles.headphonesIcon} />
                        </motion.button>
                    </span>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title="Escuchar más tarde"
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={
                                currentFilter === "escuchar-mas-tarde"
                                    ? styles.activeButton
                                    : styles.button
                            }
                            onClick={() => dispatch(setFilter("escuchar-mas-tarde"))}
                        >
                            <WatchLater className={styles.headphonesIcon} />
                        </motion.button>
                    </span>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title="Podcasts completados"
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={
                                currentFilter === "completados"
                                    ? styles.activeButton
                                    : styles.button
                            }
                            onClick={() => dispatch(setFilter("completados"))}
                        >
                            <CheckCircle className={styles.headphonesIcon} />
                        </motion.button>
                    </span>
                </BootstrapTooltip>
            </motion.div>

            {filteredSongs.length === 0 ? (
                <NoResults searchTerm={searchTerm} currentFilter={currentFilter} />
            ) : (
                <motion.div
                    className={styles.playerList}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {currentSongs.map((song) => {
                        return (
                            <motion.div
                                className={styles.playerList}
                                key={song.pubDate}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                            >
                                <div className={styles.podcastCard}>
                                    <MP3Player
                                        title={song.title}
                                        url={song.audio}
                                        imageUrl={song.image}
                                        date={song.pubDate}
                                        desc={song.description}
                                        isFavorite={favoriteEpisodes.includes(song.title)}
                                        isListenLater={listenLaterEpisodes.includes(song.title)}
                                        toggleFavorite={() => dispatch(toggleFavorite(song))}
                                        toggleListenLater={() => dispatch(toggleListenLater(song))}
                                        onPlay={() => onPlayPodcast(song)}
                                        isPlaying={
                                            isPlaying &&
                                            currentPodcast &&
                                            currentPodcast.title === song.title
                                        }
                                        onClick={() => handleCardClick(song)}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
            {filteredSongs.length > 12 && (
                <div className={styles.paginationContainer}>
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={(page) => dispatch(setCurrentPage(page))}
                        songsPerPage={songsPerPage}
                        songs={filteredSongs}
                    />
                </div>
            )}
        </>
    );
};

export default PodcastList;
