import React from "react";
import { motion } from "framer-motion";
import styles from "./Settings.module.css";
import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    ArrowBack,
    DeleteForever,
    Favorite,
    Headphones,
    CheckCircle,
    Timer,
    Warning,
    WatchLater
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSavePlaybackTime, clearPlaybackTimes } from "../../store/slices/audioTimeSlice";
import {
    clearFavorites,
    clearStarted,
    clearCompleted,
    clearListenLater
} from "../../store/slices/podcastSlice";
import { Bounce, toast } from "react-toastify";

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#15223E",
            "& + .MuiSwitch-track": {
                backgroundColor: "#16db93",
                opacity: 1,
                border: 0
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5
            }
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#16db93",
            border: "6px solid #fff"
        }
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500
        })
    }
}));

const iconVariants = {
    hover: {
        scale: 1.06,
        rotate: 45,
        transition: { type: "spring", stiffness: 250, damping: 3 }
    }
};

const Settings = () => {
    const dispatch = useDispatch();
    const { savePlaybackTime } = useSelector((state) => state.audioTime);

    const showSuccessToast = (message) => {
        toast.success(message, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Bounce
        });
    };

    const showConfirmToast = (message, onConfirm) => {
        toast.warn(
            <div className={styles.confirmToast}>
                <div className={styles.confirmHeader}>
                    <Warning className={styles.warningIcon} />
                    <h3>Confirmar Acción</h3>
                </div>
                <p className={styles.confirmMessage}>{message}</p>
                <div className={styles.confirmButtons}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.confirmButton}
                        onClick={() => {
                            toast.dismiss();
                            onConfirm();
                        }}
                    >
                        Confirmar
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.cancelButton}
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </motion.button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: styles.customToast,
                theme: "dark"
            }
        );
    };

    const handleClearStarted = () => {
        showConfirmToast(
            "¿Estás seguro de que quieres borrar todos los podcasts empezados?",
            () => {
                dispatch(clearStarted());
                showSuccessToast("Podcasts empezados eliminados");
            }
        );
    };

    const handleClearFavorites = () => {
        showConfirmToast(
            "¿Estás seguro de que quieres borrar todos los podcasts favoritos?",
            () => {
                dispatch(clearFavorites());
                showSuccessToast("Podcasts favoritos eliminados");
            }
        );
    };

    const handleClearListenLater = () => {
        showConfirmToast(
            "¿Estás seguro de que quieres borrar todos los podcasts guardados para escuchar más tarde?",
            () => {
                dispatch(clearListenLater());
                showSuccessToast("Podcasts guardados para escuchar más tarde eliminados");
            }
        );
    };

    const handleClearCompleted = () => {
        showConfirmToast(
            "¿Estás seguro de que quieres borrar todos los podcasts completados?",
            () => {
                dispatch(clearCompleted());
                showSuccessToast("Podcasts completados eliminados");
            }
        );
    };

    const handleClearPlaybackTimes = () => {
        showConfirmToast("¿Estás seguro de que quieres borrar todos los tiempos guardados?", () => {
            dispatch(clearPlaybackTimes());
            showSuccessToast("Tiempos guardados eliminados");
        });
    };

    const handleClearAll = () => {
        showConfirmToast(
            "¿Estás seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.",
            () => {
                dispatch(clearStarted());
                dispatch(clearFavorites());
                dispatch(clearListenLater());
                dispatch(clearCompleted());
                dispatch(clearPlaybackTimes());
                showSuccessToast("Todos los datos han sido eliminados");
            }
        );
    };

    return (
        <motion.div
            className={styles.settingsContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/" style={{ textDecoration: "none" }}>
                <motion.div whileHover="hover" className={styles.backButton}>
                    <motion.div variants={iconVariants}>
                        <ArrowBack />
                    </motion.div>
                    <span style={{ marginLeft: "2px" }}>Volver</span>
                </motion.div>
            </Link>
            <h2 className={styles.title}>Ajustes</h2>

            <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                    <h3>Recordar tiempo de reproducción</h3>
                    <p>Guarda el progreso de reproducción de cada episodio</p>
                </div>
                <div className={styles.toggleSwitch}>
                    <IOSSwitch
                        checked={savePlaybackTime}
                        onChange={() => dispatch(toggleSavePlaybackTime())}
                    />
                </div>
            </div>

            <div className={styles.buttonsContainer}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${styles.clearButton} ${styles.timeButton}`}
                    onClick={handleClearPlaybackTimes}
                >
                    <Timer className={styles.buttonIcon} />
                    Borrar tiempos guardados
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${styles.clearButton} ${styles.startedButton}`}
                    onClick={handleClearStarted}
                >
                    <Headphones className={styles.buttonIcon} />
                    Borrar podcasts empezados
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${styles.clearButton} ${styles.favoritesButton}`}
                    onClick={handleClearFavorites}
                >
                    <Favorite className={styles.buttonIcon} />
                    Borrar podcasts favoritos
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${styles.clearButton} ${styles.listenLaterButton}`}
                    onClick={handleClearListenLater}
                >
                    <WatchLater className={styles.buttonIcon} />
                    Borrar escuchar más tarde
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${styles.clearButton} ${styles.completedButton}`}
                    onClick={handleClearCompleted}
                >
                    <CheckCircle className={styles.buttonIcon} />
                    Borrar podcasts completados
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${styles.clearButton} ${styles.deleteAllButton}`}
                    onClick={handleClearAll}
                >
                    <DeleteForever className={styles.buttonIcon} />
                    Borrar todo
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Settings;
