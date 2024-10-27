import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, TimerOff, Warning, CheckCircle } from "@mui/icons-material";
import styles from "./SleepTimer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { togglePlay } from "../../store/slices/playerSlice";
import { toast } from "react-hot-toast"; // Cambiado de react-toastify a react-hot-toast

const SleepTimer = () => {
    const dispatch = useDispatch();
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [selectedTime, setSelectedTime] = useState(15);
    const { isPlaying } = useSelector((state) => state.player);
    const { completedEpisodes } = useSelector((state) => state.podcast);
    const { currentPodcast } = useSelector((state) => state.player);

    const timeOptions = [5, 15, 30, 45, 60];

    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 && mins === 0 ? `${hrs}h` : `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
    };

    const handleTimerStart = () => {
        if (!isPlaying) {
            toast.custom(
                <div className={styles.confirmToast}>
                    <div className={styles.confirmHeader}>
                        <Warning className={styles.warningIcon} />
                        <h3>¡Atención!</h3>
                    </div>
                    <p className={styles.confirmMessage}>
                        Inicia la reproducción primero para activar el temporizador.
                    </p>
                </div>,
                {
                    duration: 3000, // Duración en milisegundos
                    position: "bottom-center",
                    style: {
                        backgroundColor: "rgba(33, 33, 33, 0.9)",
                        border: "1px solid #16db93",
                        borderRadius: "12px",
                        color: "#ffffff"
                    }
                }
            );
            return;
        }

        setIsTimerActive(true);
        setTimeLeft(selectedTime * 60);
        toast.custom(
            <div className={styles.confirmToast}>
                <div className={styles.confirmHeader}>
                    <Timer className={styles.successIcon} />
                    <h3>Temporizador Iniciado</h3>
                </div>
                <p className={styles.confirmMessage}>
                    El podcast se detendrá en: <strong>{formatTime(selectedTime)}</strong>
                </p>
            </div>,
            {
                duration: 3000,
                position: "bottom-center",
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)",
                    border: "1px solid #16db93",
                    borderRadius: "12px",
                    color: "#ffffff"
                }
            }
        );
    };

    const showCancelToast = (isCompleted = false) => {
        toast.custom(
            <div className={styles.confirmToast}>
                <div className={styles.confirmHeader}>
                    <TimerOff className={styles.warningIcon} />
                    <h3>Temporizador Cancelado</h3>
                </div>
                <p className={styles.confirmMessage}>
                    {isCompleted
                        ? "El temporizador ha sido cancelado debido a que el podcast ha sido completado."
                        : "El temporizador ha sido cancelado correctamente."}
                </p>
            </div>,
            {
                duration: 3000,
                position: "bottom-center",
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)",
                    border: "1px solid #16db93",
                    borderRadius: "12px",
                    color: "#ffffff"
                }
            }
        );
    };

    const handleTimerCancel = useCallback((isCompleted = false) => {
        setIsTimerActive(false);
        setTimeLeft(0);
        showCancelToast(isCompleted);
    }, []);

    const handleTimerEnd = useCallback(() => {
        setIsTimerActive(false);
        setTimeLeft(0);
        dispatch(togglePlay(false));
        toast.custom(
            <div className={styles.confirmToast}>
                <div className={styles.confirmHeader}>
                    <CheckCircle className={styles.successIcon} />
                    <h3>¡Temporizador Finalizado!</h3>
                </div>
                <p className={styles.confirmMessage}>El podcast se ha detenido automáticamente.</p>
            </div>,
            {
                duration: 3000,
                position: "bottom-center",
                style: {
                    backgroundColor: "rgba(33, 33, 33, 0.9)",
                    border: "1px solid #16db93",
                    borderRadius: "12px",
                    color: "#ffffff"
                }
            }
        );
    }, [dispatch]);

    useEffect(() => {
        let interval;
        if (isTimerActive && timeLeft > 0 && isPlaying) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft, handleTimerEnd, isPlaying]);

    useEffect(() => {
        if (currentPodcast && completedEpisodes.includes(currentPodcast.title) && isTimerActive) {
            handleTimerCancel(true);
        }
    }, [completedEpisodes, currentPodcast, isTimerActive, handleTimerCancel]);

    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className={styles.sleepTimer}>
            {!isTimerActive ? (
                <>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(Number(e.target.value))}
                        className={styles.timeSelect}
                    >
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {formatTime(time)}
                            </option>
                        ))}
                    </select>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.timerButton}
                        onClick={handleTimerStart}
                    >
                        <Timer className={styles.timerIcon} />
                    </motion.button>
                </>
            ) : (
                <div className={`${styles.activeTimer} ${!isPlaying ? styles.paused : ""}`}>
                    <span className={styles.timeLeft}>{formatTimeLeft()}</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.cancelButton}
                        onClick={() => handleTimerCancel(false)}
                    >
                        <TimerOff className={styles.timerIcon} />
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default SleepTimer;
