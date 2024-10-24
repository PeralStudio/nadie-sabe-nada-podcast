import { useState, useRef } from "react";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";
import { Download, Warning, CheckCircle, Close } from "@mui/icons-material";
import styles from "./useDownload.module.css";

const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const abortController = useRef(null);
    const toastIdRef = useRef(null);
    const retryCount = useRef(0);
    const MAX_RETRIES = 3;

    const DownloadProgressToast = ({ currentProgress, cancelDownload, fileName }) => {
        return (
            <div className={styles.confirmToast}>
                <div className={styles.confirmHeader}>
                    <Download className={styles.warningIcon} />
                    <h3>Descargando Podcast</h3>
                </div>
                <p className={styles.confirmMessage}>
                    <strong>{fileName}</strong>
                    <br />
                    Progreso: {currentProgress}%
                </p>
                <div className={styles.confirmButtons}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.cancelButton}
                        onClick={cancelDownload}
                    >
                        <Close style={{ marginRight: "5px" }} /> Cancelar
                    </motion.button>
                </div>
            </div>
        );
    };

    const DownloadCompleteToast = ({ fileName }) => (
        <div className={styles.confirmToast}>
            <div className={styles.confirmHeader}>
                <CheckCircle className={styles.successIcon} />
                <h3>Descarga Completa</h3>
            </div>
            <p className={styles.confirmMessage}>
                El Podcast <strong>{fileName}</strong> se ha descargado correctamente.
            </p>
        </div>
    );

    const DownloadCancelledToast = ({ fileName }) => (
        <div className={styles.confirmToast}>
            <div className={styles.confirmHeader}>
                <Warning className={styles.warningIconText} />
                <h3 className={styles.warningText}>Descarga Cancelada</h3>
            </div>
            <p className={styles.confirmMessage}>
                La descarga de <strong>{fileName}</strong> ha sido cancelada.
            </p>
        </div>
    );

    const resetState = () => {
        setIsLoading(false);
        setProgress(0);
        setIsCancelled(false);
        retryCount.current = 0;
        if (abortController.current) {
            abortController.current = null;
        }
    };

    const fetchWithRetry = async (url, fileName, attempt = 0) => {
        try {
            abortController.current = new AbortController();
            const response = await fetch(url, {
                method: "GET",
                redirect: "follow",
                signal: abortController.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            if (error.name === "AbortError") {
                throw error;
            }

            if (attempt < MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
                return fetchWithRetry(url, fileName, attempt + 1);
            }

            throw error;
        }
    };

    const processDownload = async (response, fileName) => {
        const contentLength = response.headers.get("content-length");
        const reader = response.body.getReader();
        const total = parseInt(contentLength, 10);
        let loaded = 0;
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            loaded += value.length;

            const currentProgress = Math.round((loaded / total) * 100);
            setProgress(currentProgress);

            if (isCancelled) {
                reader.cancel();
                break;
            }

            toast.update(toastIdRef.current, {
                render: (
                    <DownloadProgressToast
                        currentProgress={currentProgress}
                        cancelDownload={cancelDownload}
                        fileName={fileName}
                    />
                ),
                type: "info",
                isLoading: true,
                closeOnClick: false,
                autoClose: false
            });
        }

        if (!isCancelled) {
            const blob = new Blob(chunks, { type: "audio/mp3" });
            const urlBlob = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = urlBlob;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);

            toast.update(toastIdRef.current, {
                render: <DownloadCompleteToast fileName={fileName} />,
                type: "success",
                isLoading: false,
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            });
        }
    };

    const handleDownload = async (audioUrl, fileName) => {
        if (isLoading) return;

        setIsLoading(true);
        setProgress(0);
        setIsCancelled(false);

        toastIdRef.current = toast.loading(
            <DownloadProgressToast
                currentProgress={0}
                cancelDownload={cancelDownload}
                fileName={fileName}
            />,
            {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            }
        );

        try {
            const response = await fetchWithRetry(audioUrl, fileName);
            await processDownload(response, fileName);
        } catch (error) {
            if (error.name !== "AbortError") {
                toast.error(
                    <div className={styles.confirmToast}>
                        <div className={styles.confirmHeader}>
                            <Warning className={styles.warningIcon} />
                            <h3>Error de Descarga</h3>
                        </div>
                        <p className={styles.confirmMessage}>
                            Error al descargar <strong>{fileName}</strong>. Por favor, inténtalo de
                            nuevo.
                        </p>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                        transition: Bounce
                    }
                );
            }
        } finally {
            resetState();
        }
    };

    const cancelDownload = () => {
        if (abortController.current) {
            abortController.current.abort();
            setIsCancelled(true);
            toast.dismiss(toastIdRef.current);
            toast.warning(<DownloadCancelledToast />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            });
            resetState();
        }
    };

    return { isLoading, progress, isCancelled, handleDownload, cancelDownload };
};

export default useDownload;
