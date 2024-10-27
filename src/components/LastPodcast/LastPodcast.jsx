import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LastPodcast.module.css";
import YouTube from "react-youtube";
import { toast } from "react-hot-toast"; // Cambiado a react-hot-toast
import {
    PlayArrow,
    ArrowBack,
    Pause,
    Share,
    Download,
    Close,
    Headphones,
    HeadsetOff,
    CheckCircle,
    Favorite,
    FavoriteBorder,
    Warning,
    WatchLater,
    WatchLaterOutlined,
    CheckCircleOutline
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FidgetSpinner } from "react-loader-spinner";
import useDownload from "../../hooks/useDownload";
import { useDispatch, useSelector } from "react-redux";
import { togglePlay } from "../../store/slices/playerSlice";
import {
    deleteEpisode,
    markAsCompleted,
    removeFromCompleted,
    toggleFavorite,
    toggleListenLater
} from "../../store/slices/podcastSlice";
import { removePlaybackTime } from "../../store/slices/audioTimeSlice";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Typography, Fade } from "@mui/material";

const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;

const LastPodcast = ({ onPlayPodcast }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [youtubeVideoId, setYoutubeVideoId] = useState("");
    const { isLoading, progress, isCancelled, handleDownload, cancelDownload } = useDownload();

    const { songs, listenedEpisodes, completedEpisodes, favoriteEpisodes, listenLaterEpisodes } =
        useSelector((state) => state.podcast);
    const { currentPodcast, isPlaying } = useSelector((state) => state.player);
    const { playbackTimes } = useSelector((state) => state.audioTime);

    const podcast = songs[0];
    const playbackTime = playbackTimes[podcast.title] || 0;

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

    const logoVariants = {
        hover: {
            scale: 1.16,
            rotate: 45,
            transition: { type: "spring", stiffness: 150, damping: 4 }
        }
    };

    const iconVariants = {
        hover: {
            scale: 1.1,
            transition: { type: "spring", stiffness: 300, damping: 10 }
        }
    };

    const showConfirmToast = (message, onConfirm) => {
        toast.custom(
            (t) => (
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
                                toast.dismiss(t.id); // Cerrar el toast de confirmación
                                onConfirm();
                            }}
                        >
                            Confirmar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.cancelButton}
                            onClick={() => toast.dismiss(t.id)} // Cerrar el toast de confirmación
                        >
                            Cancelar
                        </motion.button>
                    </div>
                </div>
            ),
            {
                duration: Infinity, // El toast permanece visible hasta que se cierra manualmente
                position: "top-center",
                className: styles.customToast,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    border: "1px solid #16db93", // Borde verde
                    borderRadius: "12px", // Bordes redondeados
                    padding: "20px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                },
                closeButton: false,
                closeOnClick: false,
                draggable: false
            }
        );
    };

    const handleRemoveStarted = (song) => {
        showConfirmToast(
            "¿Estás seguro de que quieres eliminar el tiempo de reproducción guardado?",
            () => {
                dispatch(deleteEpisode(song.title));
                dispatch(removePlaybackTime(song.title));
                toast.success("Tiempo de reproducción eliminado", {
                    position: "bottom-center",
                    duration: 3000,
                    style: {
                        backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                        color: "#ffffff", // Texto blanco
                        borderRadius: "8px", // Bordes redondeados
                        padding: "10px", // Espaciado interno
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                    }
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
                    position: "bottom-center",
                    duration: 3000,
                    style: {
                        backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                        color: "#ffffff", // Texto blanco
                        borderRadius: "8px", // Bordes redondeados
                        padding: "10px", // Espaciado interno
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                    }
                });
            }
        );
    };

    useEffect(() => {
        const fetchYoutubeVideo = async () => {
            if (podcast?.audio) {
                try {
                    const response = await fetch(
                        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                            podcast.title
                        )}&key=${YT_API_KEY}&channelId=${CHANNEL_ID}&type=video&maxResults=1`
                    );
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        setYoutubeVideoId(data.items[0].id.videoId);
                    }
                } catch (error) {
                    console.error("Error fetching YouTube video:", error);
                }
            } else {
                navigate("/404");
            }
        };

        fetchYoutubeVideo();
    }, [podcast?.audio, podcast?.title, navigate]);

    if (!podcast) {
        return null;
    }

    const isListened =
        listenedEpisodes.includes(podcast.title) ||
        (playbackTimes[podcast.title] && playbackTimes[podcast.title] > 0);
    const isPodcastPlaying = isPlaying && currentPodcast && currentPodcast.title === podcast.title;
    const isCompleted = completedEpisodes.includes(podcast.title);
    const isFavorite = favoriteEpisodes.includes(podcast.title);
    const isListenLater = listenLaterEpisodes.includes(podcast.title);

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleShareClick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: podcast.title,
                    text: podcast.description,
                    url: window.location.href
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        }
    };

    const handleListenedToggle = () => {
        if (!isPlaying) {
            if (isCompleted) {
                handleRemoveCompleted(podcast);
            } else {
                handleRemoveStarted(podcast);
            }
        }
    };

    const handlePlay = () => {
        if (isCompleted) {
            dispatch(removeFromCompleted(podcast.title));
        }
        onPlayPodcast(podcast);
    };

    const handleCompleteClick = () => {
        if (isCompleted) {
            dispatch(removeFromCompleted(podcast.title));
            toast.error("Podcast marcado como no completado", {
                position: "bottom-center",
                duration: 3000,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        } else {
            dispatch(markAsCompleted(podcast.title));
            toast.success("Podcast marcado como completado", {
                position: "bottom-center",
                duration: 3000,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        }
    };

    const handleWatchLater = () => {
        if (isListenLater) {
            dispatch(toggleListenLater(podcast));
            toast.error("Podcast eliminado de ver más tarde", {
                position: "bottom-center",
                duration: 3000,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        } else {
            dispatch(toggleListenLater(podcast));
            toast.success("Podcast agregado a ver más tarde", {
                position: "bottom-center",
                duration: 3000,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        }
    };

    const handleFavorites = () => {
        if (isFavorite) {
            dispatch(toggleFavorite(podcast));
            toast.error("Podcast eliminado favoritos", {
                position: "bottom-center",
                duration: 3000,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        } else {
            dispatch(toggleFavorite(podcast));
            toast.success("Podcast agregado a favoritos", {
                position: "bottom-center",
                duration: 3000,
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        }
    };

    const getStatusIcon = () => {
        if (isPodcastPlaying) return <Headphones />;
        if (isCompleted) return <CheckCircle />;
        if (isListened) return <Headphones />;
        return <HeadsetOff />;
    };

    const getStatusText = () => {
        if (isPodcastPlaying) return "Reproduciendo";
        if (isCompleted) return "Completado";
        if (isListened) return "Empezado";
        return "No Empezado";
    };

    const ListenedButton = () => (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${styles.listenedButton} ${
                (isListened || isCompleted) && !isPodcastPlaying ? styles.listenedButtonTrue : ""
            } ${isPodcastPlaying ? styles.listenedButtonPlaying : ""}`}
            onClick={
                !isPodcastPlaying && (isListened || isCompleted) ? handleListenedToggle : undefined
            }
            style={{
                cursor: !isPodcastPlaying && (isListened || isCompleted) ? "pointer" : "default",
                backgroundColor: isCompleted ? "#14DB93" : isListened ? "#14DB93" : "",
                color: isCompleted || isListened ? "#000000" : ""
            }}
        >
            {getStatusIcon()}
            {getStatusText()}
        </motion.button>
    );

    return (
        <motion.div
            className={styles.podcastDetail}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Helmet>
                <title>{podcast.title} - Nadie Sabe Nada Podcast</title>
            </Helmet>

            <div className={styles.headerContainer}>
                <Link to="/" className={styles.backButton}>
                    <motion.div
                        style={{ display: "flex", alignItems: "flex-start" }}
                        whileHover="hover"
                    >
                        <motion.div variants={logoVariants}>
                            <ArrowBack />
                        </motion.div>
                        <span style={{ marginLeft: "4px" }}>Volver</span>
                    </motion.div>
                </Link>

                <div className={styles.iconControls}>
                    {(isListened || isPodcastPlaying) && !isCompleted && (
                        <BootstrapTooltip
                            title={
                                <Typography
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}
                                >
                                    {`${
                                        isPodcastPlaying ? "Reproduciendo" : "Empezado"
                                    } - ${formatTime(playbackTime)}`}
                                    <br />
                                    {!isPodcastPlaying && "Clic para eliminar el tiempo"}
                                </Typography>
                            }
                            placement="top"
                            arrow
                            disableInteractive
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                        >
                            <motion.div
                                variants={iconVariants}
                                whileHover="hover"
                                onClick={() => !isPodcastPlaying && handleRemoveStarted(podcast)}
                                style={{ cursor: !isPodcastPlaying ? "pointer" : "default" }}
                            >
                                <Headphones className={styles.statusIcon} />
                            </motion.div>
                        </BootstrapTooltip>
                    )}

                    {isCompleted && !isPodcastPlaying && (
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
                                    Clic para eliminar de completados
                                </Typography>
                            }
                            placement="top"
                            arrow
                            disableInteractive
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                        >
                            <motion.div
                                variants={iconVariants}
                                whileHover="hover"
                                onClick={() => handleRemoveCompleted(podcast)}
                                style={{ cursor: "pointer" }}
                            >
                                <CheckCircle className={styles.statusIcon} />
                            </motion.div>
                        </BootstrapTooltip>
                    )}

                    <BootstrapTooltip
                        title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                        placement="top"
                        arrow
                        disableInteractive
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                    >
                        <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                            onClick={handleFavorites}
                            style={{ cursor: "pointer" }}
                        >
                            {isFavorite ? (
                                <Favorite className={styles.favoriteIcon} />
                            ) : (
                                <FavoriteBorder className={styles.favoriteIcon} />
                            )}
                        </motion.div>
                    </BootstrapTooltip>
                </div>
            </div>

            <motion.h2
                className={styles.title}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                {podcast.title}
            </motion.h2>
            {youtubeVideoId && (
                <motion.div
                    className={styles.youtubePlayer}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <YouTube
                        videoId={youtubeVideoId}
                        opts={{
                            height: "390",
                            width: "640",
                            playerVars: {
                                autoplay: 0
                            },
                            modestbranding: 1,
                            showinfo: 0
                        }}
                        className={styles.youtubePlayer}
                        onPlay={() => dispatch(togglePlay(false))}
                    />
                </motion.div>
            )}
            <motion.p
                className={styles.description}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                {podcast.description}
            </motion.p>
            <motion.div
                className={styles.metadata}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <span className={styles.date}>{podcast.pubDate}</span>
                <div className={styles.actions}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.actionButton}
                        onClick={handlePlay}
                    >
                        {isPodcastPlaying ? <Pause /> : <PlayArrow />}
                        {isPodcastPlaying ? "Pausar" : "Reproducir"}
                    </motion.button>
                    {isListened || isCompleted || isPodcastPlaying ? (
                        <BootstrapTooltip
                            title={
                                <Typography
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}
                                >
                                    {isPodcastPlaying
                                        ? `Reproduciendo - ${formatTime(playbackTime)}`
                                        : isCompleted
                                        ? "Podcast completado"
                                        : `Empezado - ${formatTime(playbackTime)}`}
                                    <br />
                                    {!isPodcastPlaying &&
                                        (isCompleted
                                            ? "Clic para eliminar de completados"
                                            : "Clic para eliminar el tiempo")}
                                </Typography>
                            }
                            placement="top"
                            arrow
                            disableInteractive
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                        >
                            <span>
                                <ListenedButton />
                            </span>
                        </BootstrapTooltip>
                    ) : (
                        <ListenedButton />
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.actionButton}
                        onClick={handleWatchLater}
                        style={{
                            backgroundColor: isListenLater ? "#0f3460" : "",
                            color: isListenLater ? "#16db93" : ""
                        }}
                    >
                        {isListenLater ? <WatchLater /> : <WatchLaterOutlined />}
                        {isListenLater ? "Quitar de escuchar más tarde" : "Escuchar más tarde"}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.actionButton}
                        onClick={handleCompleteClick}
                        style={{
                            backgroundColor: isCompleted ? "#0f3460" : "",
                            color: isCompleted ? "#16db93" : ""
                        }}
                    >
                        {isCompleted ? <CheckCircle /> : <CheckCircleOutline />}
                        {isCompleted ? "Quitar completado" : "Marcar completado"}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.actionButton}
                        onClick={handleShareClick}
                    >
                        <Share /> Compartir
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.actionButton}
                        onClick={
                            isLoading
                                ? cancelDownload
                                : () => handleDownload(podcast.audio, podcast.title)
                        }
                        disabled={isLoading && isCancelled}
                        style={{
                            backgroundColor: isLoading ? "#0f3460" : "",
                            color: isLoading ? "#16db93" : ""
                        }}
                    >
                        {isLoading ? (
                            isCancelled ? (
                                <span>Descarga cancelada</span>
                            ) : (
                                <>
                                    <FidgetSpinner
                                        height="21"
                                        width="16"
                                        radius="9"
                                        color={"#191A2E"}
                                        ariaLabel="fidget-spinner-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="fidget-spinner-wrapper"
                                    />
                                    <span>Descargando {progress}%</span>
                                    <Close
                                        style={{
                                            marginLeft: "8px",
                                            fontSize: "16px",
                                            backgroundColor: "#16db93",
                                            color: "#0f3460",
                                            borderRadius: "50%",
                                            marginBottom: "1px"
                                        }}
                                    />
                                </>
                            )
                        ) : (
                            <>
                                <Download style={{ fontSize: "16px" }} />
                                Descargar
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LastPodcast;
