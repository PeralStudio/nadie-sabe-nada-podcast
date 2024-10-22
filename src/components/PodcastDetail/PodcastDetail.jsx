import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
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
import { slugify } from "../../utils/slugify";
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
    const { id } = useParams();
    const [podcast, setPodcast] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState("");
    const { isLoading, progress, isCancelled, handleDownload, cancelDownload } = useDownload();
    const navigate = useNavigate();

    useEffect(() => {
        const foundPodcast = songs.find((song) => slugify(song.title) === id);
        setPodcast(foundPodcast);

        const fetchYoutubeVideo = async () => {
            if (foundPodcast) {
                try {
                    const response = await fetch(
                        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                            foundPodcast.title
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
    }, [id, songs, navigate]);

    if (!podcast) {
        return <></>;
    }

    const isListened = listenedEpisodes.includes(podcast.title);
    const isPodcastPlaying = isPlaying && currentPodcast && currentPodcast.title === podcast.title;

    const handlePlayClick = () => {
        onPlayPodcast(podcast);
    };

    const handleShareClick = async () => {
        if (navigator.share) {
            try {
                if (navigator.canShare) {
                    await navigator.share({
                        title: podcast.titulo,
                        text: podcast.titulo,
                        url: window.location.href
                    });
                    console.log("Contenido compartido exitosamente");
                } else {
                    console.error("Este navegador no soporta compartir archivos.");
                }
            } catch (error) {
                console.error("Error al compartir: ", error);
            }
        } else {
            console.error("La API de compartir no está disponible en este navegador.");
        }
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
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {podcast.title}
            </motion.h2>
            {youtubeVideoId && (
                <motion.div
                    className={styles.youtubePlayer}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
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
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                dangerouslySetInnerHTML={{ __html: podcast.description }}
            />
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
