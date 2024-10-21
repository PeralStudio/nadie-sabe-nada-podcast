import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
import YouTube from "react-youtube";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { slugify } from "../../utils/slugify";

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
        <div className={styles.podcastDetail}>
            <Link to="/" className={styles.backButton}>
                <ArrowBackIcon /> Volver
            </Link>
            <h2 className={styles.title}>{podcast.title}</h2>
            {youtubeVideoId && (
                <div className={styles.youtubePlayer}>
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
                </div>
            )}
            <p className={styles.description}>{podcast.description}</p>
            <div className={styles.metadata}>
                <span className={styles.date}>{podcast.pubDate}</span>
                <div className={styles.actions}>
                    <button
                        className={`${styles.actionButton} ${
                            isListened ? styles.listenedButton : ""
                        }`}
                        onClick={() => toggleListened(podcast)}
                    >
                        {isListened ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                        {isListened ? "Marcado" : "Marcar"} como escuchado
                    </button>
                    <button className={styles.actionButton} onClick={handleShareClick}>
                        <ShareIcon /> Compartir
                    </button>
                    <button className={styles.actionButton} onClick={handlePlayClick}>
                        {isPodcastPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        {isPodcastPlaying ? "Pausar" : "Reproducir"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PodcastDetail;
