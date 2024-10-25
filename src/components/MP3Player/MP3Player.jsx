import React, { useMemo } from "react";
import styles from "./MP3Player.module.css";
import { motion } from "framer-motion";
import {
    PlayArrow,
    Pause,
    Download,
    FavoriteBorder,
    Favorite,
    WatchLater,
    WatchLaterOutlined,
    Warning,
    Headphones,
    CheckCircle
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Fade, Typography } from "@mui/material";
import useDownload from "../../hooks/useDownload";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { removePlaybackTime } from "../../store/slices/audioTimeSlice";
import { deleteEpisode, removeFromCompleted } from "../../store/slices/podcastSlice";

const placeHolderImage2 =
    "https://sdmedia.playser.cadenaser.com/playser/image/20208/27/1593787718595_1598534487_square_img.png";

const MP3Player = ({
    title,
    url,
    imageUrl,
    date,
    desc,
    isFavorite,
    isListenLater,
    toggleFavorite,
    toggleListenLater,
    onPlay,
    isPlaying,
    onClick
}) => {
    const dispatch = useDispatch();
    const { isLoading, handleDownload, progress } = useDownload();
    const { playbackTimes } = useSelector((state) => state.audioTime);
    const { /* songs, favoriteEpisodes, listenLaterEpisodes, searchTerm, */ completedEpisodes } =
        useSelector((state) => state.podcast);
    const isStarted = playbackTimes[title] > 0;
    const isCompleted = completedEpisodes.includes(title);
    const playbackTime = playbackTimes[title] || 0;

    const handleImageError = (event) => {
        event.target.src = placeHolderImage2;
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
    };

    const handleListenLaterClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleListenLater();
    };

    const handlePlayClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onPlay();
    };

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

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleRemoveStarted = (title, e) => {
        e.stopPropagation();
        showConfirmToast(
            "¿Estás seguro de que quieres eliminar el tiempo de reproducción guardado?",
            () => {
                dispatch(deleteEpisode(title));
                dispatch(removePlaybackTime(title));
                toast.success("Tiempo de reproducción eliminado", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce
                });
            }
        );
    };

    const handleRemoveCompleted = (title, e) => {
        e.stopPropagation();
        showConfirmToast(
            "¿Estás seguro de que quieres eliminar este podcast de completados?",
            () => {
                dispatch(removeFromCompleted(title));
                toast.success("Podcast eliminado de completados", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce
                });
            }
        );
    };

    const favoriteButton = (
        <BootstrapTooltip
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            placement="top"
            arrow
            disableInteractive
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
        >
            <span
                onClick={handleFavoriteClick}
                className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ""}`}
            >
                {isFavorite ? (
                    <Favorite style={{ fontSize: "22px" }} />
                ) : (
                    <FavoriteBorder style={{ fontSize: "22px" }} />
                )}
            </span>
        </BootstrapTooltip>
    );

    const playButton = (
        <BootstrapTooltip
            title={isPlaying ? "Pausar" : "Reproducir"}
            placement="top"
            arrow
            disableInteractive
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
        >
            <button
                onClick={handlePlayClick}
                style={{
                    borderRadius: "25px",
                    padding: "2px 10px",
                    margin: "0 5px"
                }}
            >
                {isPlaying ? (
                    <Pause
                        style={{
                            fontSize: "16px"
                        }}
                    />
                ) : (
                    <PlayArrow
                        style={{
                            fontSize: "16px"
                        }}
                    />
                )}
            </button>
        </BootstrapTooltip>
    );

    const downloadButton = (
        <BootstrapTooltip
            title={isLoading ? "" : "Descargar"}
            placement="top"
            arrow
            disableInteractive
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(url, title);
                }}
                style={{
                    borderRadius: "25px",
                    padding: "2px 10px",
                    margin: "0 5px",
                    backgroundColor: isLoading && "#0f3460",
                    border: isLoading && "1px solid #16db93"
                }}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span
                        style={{
                            color: "#16db93",
                            fontSize: "15px",
                            fontWeight: "bold"
                        }}
                    >
                        {progress}%
                    </span>
                ) : (
                    <Download
                        style={{
                            fontSize: "16px"
                        }}
                    />
                )}
            </button>
        </BootstrapTooltip>
    );

    const listenLaterButton = (
        <BootstrapTooltip
            title={
                isListenLater ? "Quitar de escuchar más tarde" : "Guardar para escuchar más tarde"
            }
            placement="top"
            arrow
            disableInteractive
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
        >
            <button
                onClick={handleListenLaterClick}
                style={{
                    borderRadius: "25px",
                    padding: "2px 10px",
                    margin: "0 5px",
                    backgroundColor: isListenLater ? "#0f3460" : "",
                    color: isListenLater ? "#16db93" : ""
                }}
            >
                {isListenLater ? (
                    <WatchLater style={{ fontSize: "16px" }} />
                ) : (
                    <WatchLaterOutlined style={{ fontSize: "16px" }} />
                )}
            </button>
        </BootstrapTooltip>
    );

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.favoriteContainer}>{favoriteButton}</div>
            {isStarted && !isCompleted && (
                <div className={styles.favoriteContainer}>
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
                        disableInteractive
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                    >
                        <Headphones
                            style={{
                                color: "#17D891",
                                position: "absolute",
                                top: "38px",
                                right: "0px",
                                fontSize: "22px",
                                cursor: !isPlaying && "pointer"
                            }}
                            onClick={(e) => {
                                if (!isPlaying) {
                                    handleRemoveStarted(title, e);
                                }
                            }}
                            className={styles.headphonesIcon}
                        />
                    </BootstrapTooltip>
                </div>
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
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <CheckCircle
                        style={{
                            color: "#17D891",
                            position: "absolute",
                            top: "42px",
                            right: "4px",
                            fontSize: "22px",
                            cursor: !isPlaying && "pointer"
                        }}
                        onClick={(e) => {
                            if (!isPlaying) {
                                handleRemoveCompleted(title, e);
                            }
                        }}
                        className={styles.completedIcon}
                    />
                </BootstrapTooltip>
            )}
            <img
                src={imageUrl || placeHolderImage2}
                alt={title}
                className={styles.image}
                onError={handleImageError}
                loading="lazy"
                onClick={onClick}
            />
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.spanDate}>
                <span className={styles.date}>{date}</span>
                <div className={styles.controls}>
                    {playButton}
                    {listenLaterButton}
                    {downloadButton}
                </div>
            </div>
        </div>
    );
};

export default MP3Player;
