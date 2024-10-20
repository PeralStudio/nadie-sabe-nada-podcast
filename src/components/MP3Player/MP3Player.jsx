import React from "react";
import styles from "./MP3Player.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";

const placeHolderImage2 =
    "https://sdmedia.playser.cadenaser.com/playser/image/20208/27/1593787718595_1598534487_square_img.png";

const MP3Player = ({ title, url, imageUrl, date, desc, isListened, toggleListened, onPlay, isPlaying }) => {
    const handleImageError = (event) => {
        event.target.src = placeHolderImage2;
    };

    const handleListenedClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleListened();
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

    const listenedButton = (
        <BootstrapTooltip
            title={isListened ? "Marcado como escuchado" : "Marcar como escuchado"}
            placement="top"
            arrow
            TransitionComponent={Zoom}
        >
            <button
                onClick={handleListenedClick}
                style={{
                    borderRadius: "25px",
                    padding: "2px 10px",
                    margin: "0 5px"
                }}
            >
                {isListened ? (
                    <CheckCircleIcon
                        style={{
                            fontSize: "16px"
                        }}
                    />
                ) : (
                    <CheckCircleOutlineIcon
                        style={{
                            fontSize: "16px"
                        }}
                    />
                )}
            </button>
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
                    <PauseIcon
                        style={{
                            fontSize: "16px"
                        }}
                    />
                ) : (
                    <PlayArrowIcon
                        style={{
                            fontSize: "16px"
                        }}
                    />
                )}
            </button>
        </BootstrapTooltip>
    );

    return (
        <div className={styles.card}>
            <img
                src={imageUrl || placeHolderImage2}
                alt={title}
                className={styles.image}
                onError={handleImageError}
            />

            <h3 className={styles.title}>{title}</h3>

            <span className={styles.spanDate}>
                {date} {listenedButton} {playButton}
            </span>
        </div>
    );
};

export default MP3Player;