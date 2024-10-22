import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastList.module.css";
import MP3Player from "../MP3Player/MP3Player";
import Pagination from "../Pagination/Pagination";
import { slugify } from "../../utils/slugify";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { motion } from "framer-motion";
import Seo from "../Seo/Seo";

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

    // Variantes para el contenedor
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15 // Mayor separación entre animaciones
            }
        }
    };

    // Variantes para los items
    const itemVariants = {
        hidden: { y: 20, opacity: 0 }, // Aquí es donde los elementos entran desde y: 20 con opacidad 0
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
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
            <Seo
                title="Nadie Sabe Nada | Podcast de Humor y Comedia con Andreu Buenafuente y Berto Romero"
                description="Escucha el podcast 'Nadie Sabe Nada', el show de humor con Andreu Buenafuente y Berto Romero. Accede a todos los episodios y disfruta de las mejores bromas."
                keywords="podcast, humor, comedia, Andreu Buenafuente, Berto Romero, nadie sabe nada, escuchar podcast"
                ogTitle="Nadie Sabe Nada - Podcast de Humor"
                ogDescription="Escucha todos los episodios del podcast 'Nadie Sabe Nada' de Andreu Buenafuente y Berto Romero. Humor y comedia en su máxima expresión."
                ogImage="https://sdmedia.playser.cadenaser.com/playser/image/20233/31/1680287953_square_image.png"
                ogUrl="https://nsn.peralstudio.com"
                twitterCard="summary_large_image"
                twitterTitle="Nadie Sabe Nada - Podcast de Humor"
                twitterDescription="Escucha el podcast más divertido de Andreu Buenafuente y Berto Romero."
                twitterImage="https://sdmedia.playser.cadenaser.com/playser/image/20233/31/1680287953_square_image.png"
            />
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
