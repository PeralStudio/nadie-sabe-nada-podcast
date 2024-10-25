import React, { useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { motion } from "framer-motion";
import styles from "./PersistentPlayer.module.css";
import useWindowWidth from "../../hooks/useWindowWidth";
import { useDispatch, useSelector } from "react-redux";
import { updatePlaybackTime } from "../../store/slices/audioTimeSlice";
import { togglePlay } from "../../store/slices/playerSlice";
import { markAsCompleted, removeFromCompleted } from "../../store/slices/podcastSlice";

const PersistentPlayer = ({ onClose }) => {
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const windowWidth = useWindowWidth();
    const lastTimeUpdateRef = useRef(0);

    const { currentPodcast, isPlaying } = useSelector((state) => state.player);
    const { playbackTimes, savePlaybackTime } = useSelector((state) => state.audioTime);
    const { completedEpisodes } = useSelector((state) => state.podcast);

    useEffect(() => {
        if (audioRef.current && currentPodcast) {
            const savedTime = savePlaybackTime ? playbackTimes[currentPodcast.title] || 0 : 0;
            audioRef.current.audio.current.currentTime = savedTime;

            if (isPlaying) {
                audioRef.current.audio.current.play();
            } else {
                audioRef.current.audio.current.pause();
            }
        }
    }, [isPlaying, currentPodcast]);

    const handleTimeUpdate = (e) => {
        const currentTime = e.target.currentTime;
        const now = Date.now();

        if (now - lastTimeUpdateRef.current >= 1000) {
            dispatch(updatePlaybackTime({ title: currentPodcast.title, time: currentTime }));
            lastTimeUpdateRef.current = now;
        }
    };

    const handleEnded = () => {
        dispatch(updatePlaybackTime({ title: currentPodcast.title, time: 0 }));
        dispatch(markAsCompleted(currentPodcast.title));
    };

    const handlePlay = () => {
        if (completedEpisodes.includes(currentPodcast.title)) {
            dispatch(removeFromCompleted(currentPodcast.title));
        }
        dispatch(togglePlay(true));
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
                onPause={() => dispatch(togglePlay(false))}
                listenInterval={1000}
                onListen={handleTimeUpdate}
                onEnded={handleEnded}
            />
            <button onClick={onClose} className={styles.closeButton}>
                ×
            </button>
        </motion.div>
    );
};

export default PersistentPlayer;
