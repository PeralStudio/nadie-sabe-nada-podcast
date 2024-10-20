import React from "react";
import { Link } from "react-router-dom";
import styles from "./PodcastList.module.css";
import MP3Player from "../MP3Player/MP3Player";
import Pagination from "../Pagination/Pagination";
import { slugify } from "../../utils/slugify";

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

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

    return (
        <>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                songsPerPage={songsPerPage}
                songs={filteredSongs}
            />
            <div
                style={{
                    display: "flex",
                    maxHeight: "2rem",
                    justifyContent: "center",
                    marginBottom: "1rem"
                }}
            >
                <button
                    className={filter === "todos" ? styles.activeButton : styles.button}
                    onClick={() => setFilter("todos")}
                >
                    Todos
                </button>
                <button
                    className={filter === "escuchados" ? styles.activeButton : styles.button}
                    onClick={() => {
                        setCurrentPage(1);
                        setFilter("escuchados");
                    }}
                >
                    Vistos
                </button>
                <button
                    className={filter === "no-escuchados" ? styles.activeButton : styles.button}
                    onClick={() => {
                        setCurrentPage(1);
                        setFilter("no-escuchados");
                    }}
                >
                    No Vistos
                </button>
            </div>
            <div className={styles.playerList}>
                {currentSongs.map((song) => (
                    <Link
                        to={`/podcast/${slugify(song.title)}`}
                        key={song.pubDate}
                        className={styles.cardLink}
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
                                isPlaying && currentPodcast && currentPodcast.title === song.title
                            }
                        />
                    </Link>
                ))}
            </div>
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
