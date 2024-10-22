import React, { useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { motion } from "framer-motion"; // Importa motion
import styles from "./PersistentPlayer.module.css";
import useWindowWidth from "../../hooks/useWindowWidth";

const PersistentPlayer = ({ currentPodcast, onClose, isPlaying, onTogglePlay }) => {
    const audioRef = useRef(null);
    const windowWidth = useWindowWidth();

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.audio.current.play();
            } else {
                audioRef.current.audio.current.pause();
            }
        }
    }, [isPlaying, currentPodcast]);

    const handlePlay = () => {
        onTogglePlay(true);
    };

    const handlePause = () => {
        onTogglePlay(false);
    };

    if (!currentPodcast) return null;

    return (
        <motion.div
            className={styles.persistentPlayer}
            initial={{ opacity: 0, x: windowWidth }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: windowWidth - 100, transition: { duration: 0.9 } }}
            transition={{ duration: 0.9, type: "spring", stiffness: 120, damping: 10 }}
        >
            <div className={styles.podcastInfo}>
                <img
                    src={currentPodcast.image}
                    alt={currentPodcast.title}
                    className={styles.podcastImage}
                />
                <div className={styles.podcastDetails}>
                    <h3>{currentPodcast.title}</h3>
                    <p>{currentPodcast.pubDate}</p>
                </div>
            </div>
            <AudioPlayer
                ref={audioRef}
                src={currentPodcast.audio}
                showJumpControls={true}
                layout="stacked-reverse"
                customProgressBarSection={["CURRENT_TIME", "PROGRESS_BAR", "DURATION"]}
                className={styles.audioPlayer}
                onPlay={handlePlay}
                onPause={handlePause}
            />
            <button onClick={onClose} className={styles.closeButton}>
                ×
            </button>
        </motion.div>
    );
};

export default PersistentPlayer;
