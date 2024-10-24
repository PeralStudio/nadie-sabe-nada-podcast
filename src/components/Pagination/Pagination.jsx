import styles from "./Pagination.module.css";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { useMemo } from "react";

const Pagination = ({ currentPage, setCurrentPage, songsPerPage, songs }) => {
    const totalPages = Math.ceil(songs.length / songsPerPage);

    const indexOfFirstSong = (currentPage - 1) * songsPerPage + 1;
    const indexOfLastSong = Math.min(currentPage * songsPerPage, songs.length);

    const BootstrapTooltip = useMemo(
        () =>
            styled(({ className, ...props }) => (
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
            })),
        []
    );

    const backToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className={styles.paginationContainer}>
            <div>
                <BootstrapTooltip
                    title={currentPage !== 1 && "Primera Página"}
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <button
                        onClick={() => {
                            backToTop();
                            setCurrentPage(1);
                        }}
                        disabled={currentPage === 1}
                    >
                        <FirstPageIcon />
                    </button>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title={currentPage !== 1 && "Anterior"}
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <button
                        onClick={() => {
                            backToTop();
                            setCurrentPage(currentPage - 1);
                        }}
                        disabled={currentPage === 1}
                    >
                        <NavigateBeforeIcon />
                    </button>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title={currentPage !== totalPages && "Siguiente"}
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <button
                        onClick={() => {
                            backToTop();
                            setCurrentPage(currentPage + 1);
                        }}
                        disabled={currentPage === totalPages || currentPage > totalPages}
                    >
                        <NavigateNextIcon />
                    </button>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title={currentPage !== totalPages && "Última Página"}
                    placement="top"
                    arrow
                    TransitionComponent={Zoom}
                >
                    <button
                        onClick={() => {
                            backToTop();
                            setCurrentPage(totalPages);
                        }}
                        disabled={currentPage === totalPages || currentPage > totalPages}
                    >
                        <LastPageIcon />
                    </button>
                </BootstrapTooltip>
            </div>
            <p className={styles.paginationText}>
                Página: {currentPage} de {totalPages}
            </p>
            <span className={styles.paginationSpan}>
                {indexOfFirstSong} - {indexOfLastSong} de {songs.length}{" "}
            </span>
        </div>
    );
};

export default Pagination;
