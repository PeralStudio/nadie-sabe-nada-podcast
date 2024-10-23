import { useState, useRef } from "react";
import { Bounce, toast } from "react-toastify";

const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const abortController = useRef(null);
    const toastIdRef = useRef(null);

    const DownloadCompleteToast = ({ fileName }) => (
        <div style={{ padding: "4px" }}>
            <h4 style={{ margin: "0", color: "#4CAF50" }}>Descarga Completa</h4>
            <p style={{ margin: "5px 0", color: "#bdbdbd" }}>
                El Podcast <strong>{fileName}</strong> se ha descargado correctamente.
            </p>
        </div>
    );

    const DownloadProgressToast = ({ currentProgress, cancelDownload, fileName }) => {
        return (
            <div
                style={{
                    padding: "10px",
                    color: "#fff",
                    borderRadius: "5px"
                }}
            >
                <h4 style={{ margin: "0", color: "#4CAF50" }}>Descargando: {currentProgress}%</h4>
                <p style={{ margin: "5px 0", color: "#bdbdbd" }}>
                    <strong>{fileName}</strong>
                </p>
                <div
                    onClick={cancelDownload}
                    style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        transition: "transform 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="red"
                        viewBox="0 0 24 24"
                        style={{ width: "24px", height: "24px" }}
                    >
                        <path d="M19.79 4.21a1 1 0 00-1.41 0L12 10.59 5.62 4.21a1 1 0 10-1.41 1.41L10.59 12l-6.38 6.38a1 1 0 001.41 1.41L12 13.41l6.38 6.38a1 1 0 001.41-1.41L13.41 12l6.38-6.38a1 1 0 000-1.41z" />
                    </svg>
                </div>
            </div>
        );
    };

    const fetchAudio = async (url) => {
        return await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: abortController.current.signal
        });
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

            if (isCancelled) {
                break;
            }
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

    const handleDownloadPrimary = async (audioUrl, fileName) => {
        try {
            const response = await fetchAudio(audioUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            toastIdRef.current = toast.loading("Iniciando descarga...", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce
            });

            await processDownload(response, fileName);
        } catch (error) {
            if (error.name === "AbortError") {
                setIsCancelled(true);
            } else {
                toast.error("Error en la descarga"),
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                        transition: Bounce
                    };
            }
        }
    };

    const handleDownloadSecondary = async (audioUrl, fileName) => {
        try {
            const response = await fetchAudio(audioUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            toastIdRef.current = toast.loading("Iniciando descarga...", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            });

            await processDownload(response, fileName);
        } catch (error) {
            toast.error("Error en la descarga", {
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
        setIsLoading(true);
        setProgress(0);
        setIsCancelled(false);
        abortController.current = new AbortController();

        try {
            await handleDownloadPrimary(audioUrl, fileName);
        } catch (error) {
            await handleDownloadSecondary(audioUrl, fileName);
            if (error.name !== "AbortError") {
                console.error("Error en la descarga:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const cancelDownload = () => {
        if (abortController.current) {
            abortController.current.abort();
            setIsCancelled(true);
            toast.dismiss(toastIdRef.current);
            toast.warning("Descarga cancelada", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            });
            setIsLoading(false);
            setProgress(0);
        }
    };

    return { isLoading, progress, isCancelled, handleDownload, cancelDownload };
};

export default useDownload;
