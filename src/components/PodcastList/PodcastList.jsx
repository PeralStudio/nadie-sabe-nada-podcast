import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastList.module.css";
import MP3Player from "../MP3Player/MP3Player";
import Pagination from "../Pagination/Pagination";
import { slugify } from "../../utils/slugify";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const PodcastList = ({
    filteredSongs,
    filter,
    setFilter,
    listenedEpisodes,
    toggleListened,
    onPlayPodcast,
    isPlaying,
    currentPodcast
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [songsPerPage] = React.useState(12);
    const navigate = useNavigate();

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

    const handleCardClick = (song) => {
        navigate(`/podcast/${slugify(song.title)}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 12,
                mass: 0.95
            }
        },
        hover: {
            scale: 1.05,
            rotate: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 12
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>
                    Nadie Sabe Nada | Podcast de Humor y Comedia con Andreu Buenafuente y Berto
                    Romero
                </title>
            </Helmet>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                songsPerPage={songsPerPage}
                songs={filteredSongs}
            />
            <motion.div
                style={{
                    display: "flex",
                    maxHeight: "2rem",
                    justifyContent: "center",
                    marginBottom: "1rem"
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className={filter === "todos" ? styles.activeButton : styles.button}
                    onClick={() => setFilter("todos")}
                >
                    Todos
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className={filter === "escuchados" ? styles.activeButton : styles.button}
                    onClick={() => {
                        setCurrentPage(1);
                        setFilter("escuchados");
                    }}
                >
                    Vistos
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={filter === "no-escuchados" ? styles.activeButton : styles.button}
                    onClick={() => {
                        setCurrentPage(1);
                        setFilter("no-escuchados");
                    }}
                >
                    No Vistos
                </motion.button>
            </motion.div>
            <PhotoProvider>
                <motion.div
                    className={styles.playerList}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {currentSongs.map((song) => (
                        <motion.div
                            className={styles.playerList}
                            key={song.pubDate}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                        >
                            <MP3Player
                                title={song.title}
                                url={song.audio}
                                imageUrl={song.image}
                                date={song.pubDate}
                                desc={song.description}
                                isListened={listenedEpisodes.includes(song.title)}
                                toggleListened={() => toggleListened(song)}
                                onPlay={() => onPlayPodcast(song)}
                                isPlaying={
                                    isPlaying &&
                                    currentPodcast &&
                                    currentPodcast.title === song.title
                                }
                                onClick={() => handleCardClick(song)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </PhotoProvider>
            {filteredSongs.length > 12 && (
                <div className={styles.paginationContainer}>
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        songsPerPage={songsPerPage}
                        songs={filteredSongs}
                    />
                </div>
            )}
        </>
    );
};

export default PodcastList;
