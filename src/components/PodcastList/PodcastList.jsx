import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastList.module.css";
import MP3Player from "../MP3Player/MP3Player";
import Pagination from "../Pagination/Pagination";
import { slugify } from "../../utils/slugify";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Bounce, toast } from "react-toastify";
import {
    Headphones,
    HeadsetOff,
    Favorite,
    FormatListBulleted,
    CheckCircle,
    Warning
} from "@mui/icons-material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Typography, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteEpisode,
    toggleFavorite,
    removeFromCompleted
} from "../../store/slices/podcastSlice";
import { setFilter, setCurrentPage } from "../../store/slices/filterSlice";
import { removePlaybackTime } from "../../store/slices/audioTimeSlice";

const PodcastList = ({ onPlayPodcast }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { songs, favoriteEpisodes, searchTerm, completedEpisodes } = useSelector(
        (state) => state.podcast
    );
    const { currentFilter, currentPage, songsPerPage } = useSelector((state) => state.filter);
    const { currentPodcast, isPlaying } = useSelector((state) => state.player);
    const { playbackTimes } = useSelector((state) => state.audioTime);

    const showConfirmToast = (message, onConfirm) => {
        toast.warn(
            <div className={styles.confirmToast}>
                <div className={styles.confirmHeader}>
                    <Warning className={styles.warningIcon} />
                    <h3>Confirmar Acción</h3>
                </div>
                <p className={styles.confirmMessage}>{message}</p>
                <div className={styles.confirmButtons}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.confirmButton}
                        onClick={() => {
                            toast.dismiss();
                            onConfirm();
                        }}
                    >
                        Confirmar
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.cancelButton}
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </motion.button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: styles.customToast,
                theme: "dark"
            }
        );
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

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

    const handleRemoveStarted = (song) => {
        showConfirmToast(
            "¿Estás seguro de que quieres eliminar el tiempo de reproducción guardado?",
            () => {
                dispatch(deleteEpisode(song.title));
                dispatch(removePlaybackTime(song.title));
                toast.success("Tiempo de reproducción eliminado", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce
                });
            }
        );
    };

    const handleRemoveCompleted = (song) => {
        showConfirmToast(
            "¿Estás seguro de que quieres eliminar este podcast de completados?",
            () => {
                dispatch(removeFromCompleted(song.title));
                toast.success("Podcast eliminado de completados", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce
                });
            }
        );
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
                    marginBottom: "2rem",
                    gap: "0.5rem"
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BootstrapTooltip
                    title="Todos los Podcasts"
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <motion.button
                        whileHover={{ scale: 1.1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className={currentFilter === "todos" ? styles.activeButton : styles.button}
                        onClick={() => dispatch(setFilter("todos"))}
                    >
                        <FormatListBulleted className={styles.headphonesIcon} />
                    </motion.button>
                </BootstrapTooltip>

                <BootstrapTooltip
                    title="Podcasts empezados"
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <motion.button
                        whileHover={{ scale: 1.1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className={
                            currentFilter === "empezados" ? styles.activeButton : styles.button
                        }
                        onClick={() => dispatch(setFilter("empezados"))}
                    >
                        <Headphones className={styles.headphonesIcon} />
                    </motion.button>
                </BootstrapTooltip>

                <BootstrapTooltip
                    title="Podcasts no empezados"
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={
                            currentFilter === "no-empezados" ? styles.activeButton : styles.button
                        }
                        onClick={() => dispatch(setFilter("no-empezados"))}
                    >
                        <HeadsetOff className={styles.headphonesIcon} />
                    </motion.button>
                </BootstrapTooltip>

                <BootstrapTooltip
                    title="Podcasts favoritos"
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
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
                </BootstrapTooltip>

                <BootstrapTooltip
                    title="Podcasts completados"
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={
                            currentFilter === "completados" ? styles.activeButton : styles.button
                        }
                        onClick={() => dispatch(setFilter("completados"))}
                    >
                        <CheckCircle className={styles.headphonesIcon} />
                    </motion.button>
                </BootstrapTooltip>
            </motion.div>
            <motion.div
                className={styles.playerList}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {currentSongs.map((song) => {
                    const isStarted = playbackTimes[song.title] > 0;
                    const playbackTime = playbackTimes[song.title] || 0;
                    const isCompleted = completedEpisodes.includes(song.title);

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
                                    toggleFavorite={() => dispatch(toggleFavorite(song))}
                                    onPlay={() => onPlayPodcast(song)}
                                    isPlaying={
                                        isPlaying &&
                                        currentPodcast &&
                                        currentPodcast.title === song.title
                                    }
                                    onClick={() => handleCardClick(song)}
                                />
                                {isStarted && !isCompleted && (
                                    <BootstrapTooltip
                                        title={
                                            <Typography
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    textAlign: "center"
                                                }}
                                            >
                                                {`Empezado - ${formatTime(playbackTime)}`}
                                                <br />
                                                {!isPlaying && "Clic para eliminar el tiempo"}
                                            </Typography>
                                        }
                                        placement="top"
                                        arrow
                                        TransitionComponent={Zoom}
                                    >
                                        <Headphones
                                            style={{
                                                color: "#17D891",
                                                position: "absolute",
                                                top: "10px",
                                                left: "6px",
                                                fontSize: "20px",
                                                cursor: !isPlaying && "pointer"
                                            }}
                                            onClick={() => {
                                                if (!isPlaying) {
                                                    handleRemoveStarted(song);
                                                }
                                            }}
                                            className={styles.headphonesIcon}
                                        />
                                    </BootstrapTooltip>
                                )}
                                {isCompleted && (
                                    <BootstrapTooltip
                                        title={
                                            <Typography
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Podcast completado
                                                <br />
                                                {!isPlaying && "Clic para eliminar de completados"}
                                            </Typography>
                                        }
                                        placement="top"
                                        arrow
                                        TransitionComponent={Zoom}
                                    >
                                        <CheckCircle
                                            style={{
                                                color: "#17D891",
                                                position: "absolute",
                                                top: "10px",
                                                left: "6px",
                                                fontSize: "20px",
                                                cursor: !isPlaying && "pointer"
                                            }}
                                            onClick={() => {
                                                if (!isPlaying) {
                                                    handleRemoveCompleted(song);
                                                }
                                            }}
                                            className={styles.completedIcon}
                                        />
                                    </BootstrapTooltip>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
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
