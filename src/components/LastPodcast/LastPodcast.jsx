import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LastPodcast.module.css";
import YouTube from "react-youtube";
import {
    CheckCircleOutline,
    CheckCircle,
    PlayArrow,
    ArrowBack,
    Pause,
    Share,
    Download,
    Close
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FidgetSpinner } from "react-loader-spinner";
import useDownload from "../../hooks/useDownload";

const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;
const CHANNEL_ID = process.env.REACT_APP_CHANNEL_ID;

const PodcastDetail = ({
    songs,
    listenedEpisodes,
    toggleListened,
    onPlayPodcast,
    isPlaying,
    currentPodcast,
    stopPlayingAudio
}) => {
    const podcast = songs[0];
    const [youtubeVideoId, setYoutubeVideoId] = useState("");
    const { isLoading, progress, isCancelled, handleDownload, cancelDownload } = useDownload();

    useEffect(() => {
        const fetchYoutubeVideo = async () => {
            if (podcast.audio) {
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
            }
        };

        fetchYoutubeVideo();
    }, [podcast.audio, podcast.title]);

    if (!podcast) {
        return <div>Loading...</div>;
    }

    const handleShareClick = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: podcast.title,
                    text: podcast.description,
                    url: window.location.href
                })
                .then(() => console.log("Shared successfully"))
                .catch((error) => console.error("Error sharing", error));
        } else {
            alert("Web Share API not supported in your browser. Please copy the URL manually.");
        }
    };

    const isListened = listenedEpisodes.includes(podcast.title);
    const isPodcastPlaying = isPlaying && currentPodcast && currentPodcast.title === podcast.title;

    const handlePlayClick = () => {
        onPlayPodcast(podcast);
    };

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

            <Link to="/" className={styles.backButton}>
                <ArrowBack /> Volver
            </Link>
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
                        onPlay={stopPlayingAudio}
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
                        className={`${styles.actionButton} ${
                            isListened ? styles.listenedButton : ""
                        }`}
                        onClick={() => toggleListened(podcast)}
                    >
                        {isListened ? <CheckCircle /> : <CheckCircleOutline />}
                        {isListened ? "Marcado" : "Marcar"} como escuchado
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
                        onClick={handlePlayClick}
                    >
                        {isPodcastPlaying ? <Pause /> : <PlayArrow />}
                        {isPodcastPlaying ? "Pausar" : "Reproducir"}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.actionButton}
                        onClick={
                            isLoading
                                ? cancelDownload
                                : () => handleDownload(podcast.audio, podcast.title)
                        } // Si está descargando, mostramos la opción de cancelar
                        disabled={isLoading && isCancelled} // Deshabilitamos el botón si ya se ha cancelado
                        style={{
                            backgroundColor: isLoading ? "#0f3460" : "" // Cambiar el color si está descargando
                        }}
                    >
                        {isLoading ? (
                            isCancelled ? (
                                <span>Descarga cancelada</span> // Mensaje si la descarga se ha cancelado
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

export default PodcastDetail;
