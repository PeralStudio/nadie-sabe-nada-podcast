import React from "react";
import styles from "./MP3Player.module.css";
import { PlayArrow, Pause, Download, FavoriteBorder, Favorite } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import useDownload from "../../hooks/useDownload";

const placeHolderImage2 =
    "https://sdmedia.playser.cadenaser.com/playser/image/20208/27/1593787718595_1598534487_square_img.png";

const MP3Player = ({
    title,
    url,
    imageUrl,
    date,
    desc,
    isFavorite,
    toggleFavorite,
    onPlay,
    isPlaying,
    onClick
}) => {
    const { isLoading, handleDownload, progress } = useDownload();

    const handleImageError = (event) => {
        event.target.src = placeHolderImage2;
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
    };

    const handlePlayClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onPlay();
    };

    const BootstrapTooltip = styled(({ className, ...props }) => (
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
    }));

    const favoriteButton = (
        <BootstrapTooltip
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            placement="top"
            arrow
            TransitionComponent={Zoom}
        >
            <span
                onClick={handleFavoriteClick}
                className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ""}`}
            >
                {isFavorite ? (
                    <Favorite style={{ fontSize: "20px" }} />
                ) : (
                    <FavoriteBorder style={{ fontSize: "20px" }} />
                )}
            </span>
        </BootstrapTooltip>
    );

    const playButton = (
        <BootstrapTooltip
            title={isPlaying ? "Pausar" : "Reproducir"}
            placement="top"
            arrow
            TransitionComponent={Zoom}
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
            TransitionComponent={Zoom}
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

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.favoriteContainer}>{favoriteButton}</div>
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
                    {playButton} {downloadButton}
                </div>
            </div>
        </div>
    );
};

export default MP3Player;
