import React, { useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./PersistentPlayer.module.css";

const PersistentPlayer = ({ currentPodcast, onClose, isPlaying, onTogglePlay }) => {
    const audioRef = useRef(null);

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
        <div className={styles.persistentPlayer}>
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
        </div>
    );
};

export default PersistentPlayer;
