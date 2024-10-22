import { useState, useRef } from "react";

const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const abortController = useRef(null);

    const fetchAudio = async (url) => {
        return await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: abortController.current.signal
        });
    };

    const handleDownloadPrimary = async (audioUrl, fileName) => {
        try {
            const response = await fetchAudio(audioUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await processDownload(response, fileName);
        } catch (error) {
            if (error.name === "AbortError") {
                setIsCancelled(true);
            } else {
                throw error;
            }
        }
    };

    const handleDownloadSecondary = async (audioUrl, fileName) => {
        try {
            const response = await fetchAudio(audioUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await processDownload(response, fileName);
        } catch (error) {
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

            setProgress(Math.round((loaded / total) * 100));
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
        }
    };

    return { isLoading, progress, isCancelled, handleDownload, cancelDownload };
};

export default useDownload;
