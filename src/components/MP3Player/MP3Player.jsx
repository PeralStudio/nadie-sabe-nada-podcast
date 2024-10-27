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
    CheckCircle,
    CheckCircleOutline
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Fade, Typography } from "@mui/material";
import useDownload from "../../hooks/useDownload";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { removePlaybackTime } from "../../store/slices/audioTimeSlice";
import {
    deleteEpisode,
    removeFromCompleted,
    markAsCompleted
} from "../../store/slices/podcastSlice";

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
    const { completedEpisodes } = useSelector((state) => state.podcast);
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
        if (isFavorite) {
            toast.error("Podcast eliminado de favoritos", {
                position: "bottom-center",
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        } else {
            toast.success("Podcast guardado como favorito", {
                position: "bottom-center",
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

    const handleListenLaterClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleListenLater();
        if (isListenLater) {
            toast.error("Podcast eliminado de escuchar más tarde", {
                position: "bottom-center",
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                    color: "#ffffff", // Texto blanco
                    borderRadius: "8px", // Bordes redondeados
                    padding: "10px", // Espaciado interno
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                }
            });
        } else {
            toast.success("Podcast guardado para escuchar más tarde", {
                position: "bottom-center",
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

    const handlePlayClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onPlay();
    };

    const handleCompleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isPlaying) {
            if (isCompleted) {
                dispatch(removeFromCompleted(title));
                toast.error("Podcast marcado como no completado", {
                    position: "bottom-center",
                    style: {
                        backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                        color: "#ffffff", // Texto blanco
                        borderRadius: "8px", // Bordes redondeados
                        padding: "10px", // Espaciado interno
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                    }
                });
            } else {
                dispatch(markAsCompleted(title));
                toast.success("Podcast marcado como completado", {
                    position: "bottom-center",
                    style: {
                        backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                        color: "#ffffff", // Texto blanco
                        borderRadius: "8px", // Bordes redondeados
                        padding: "10px", // Espaciado interno
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                    }
                });
            }
        }
    };

    const showConfirmToast = (message, onConfirm) => {
        toast.custom(
            (t) => (
                <div className={`${styles.confirmToast} ${t.visible ? "show" : ""}`}>
                    <div className={styles.confirmHeader}>
                        <Warning className={styles.warningIcon} />
                        <h3 className={styles.confirmTitle}>Confirmar Acción</h3>
                    </div>
                    <p className={styles.confirmMessage}>{message}</p>
                    <div className={styles.confirmButtons}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.confirmButton}
                            onClick={() => {
                                toast.dismiss(t.id);
                                onConfirm();
                            }}
                        >
                            Confirmar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.cancelButton}
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancelar
                        </motion.button>
                    </div>
                </div>
            ),
            { position: "top-center", duration: Infinity }
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
        if (!isPlaying) {
            showConfirmToast(
                "¿Estás seguro de que quieres eliminar el tiempo de reproducción guardado?",
                () => {
                    dispatch(deleteEpisode(title));
                    dispatch(removePlaybackTime(title));
                    toast.success("Tiempo de reproducción eliminado", {
                        position: "bottom-center",
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
        } else {
            toast.error(
                "No puedes eliminar el tiempo de reproducción mientras se está reproduciendo",
                {
                    position: "bottom-center",
                    style: {
                        backgroundColor: "rgba(33, 33, 33, 0.9)", // Fondo oscuro
                        color: "#ffffff", // Texto blanco
                        borderRadius: "8px", // Bordes redondeados
                        padding: "10px", // Espaciado interno
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" // Sombra
                    }
                }
            );
        }
    };

    const handleRemoveCompleted = (title, e) => {
        e.stopPropagation();
        showConfirmToast(
            "¿Estás seguro de que quieres eliminar este podcast de completados?",
            () => {
                dispatch(removeFromCompleted(title));
                toast.success("Podcast eliminado de completados", {
                    position: "bottom-center",
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

    const completeButton = (
        <BootstrapTooltip
            title={isCompleted ? "Marcar como no completado" : "Marcar como completado"}
            placement="top"
            arrow
            disableInteractive
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
        >
            <button
                onClick={handleCompleteClick}
                style={{
                    borderRadius: "25px",
                    padding: "2px 10px",
                    margin: "0 5px",
                    backgroundColor: isCompleted ? "#0f3460" : undefined,
                    color: isCompleted ? "#16db93" : undefined
                }}
                disabled={isPlaying}
            >
                {isCompleted ? (
                    <CheckCircle
                        style={{
                            fontSize: "16px"
                        }}
                    />
                ) : (
                    <CheckCircleOutline
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
            <span
                onClick={handleListenLaterClick}
                style={{
                    color: "#17D891",
                    position: "absolute",
                    top: "41px",
                    right: "3px",
                    fontSize: "22px",
                    borderRadius: "25px"
                }}
                className={styles.watchLaterIcon}
            >
                {isListenLater ? <WatchLater /> : <WatchLaterOutlined />}
            </span>
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
                                top: "78px",
                                right: "0px",
                                fontSize: "22px",
                                cursor: !isPlaying && "pointer"
                            }}
                            onClick={(e) => handleRemoveStarted(title, e)}
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
                            top: "82px",
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
            {listenLaterButton}
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
                    {downloadButton}
                    {completeButton}
                </div>
            </div>
        </div>
    );
};

export default MP3Player;
