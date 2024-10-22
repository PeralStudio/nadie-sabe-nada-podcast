import { useState } from "react";

const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Añadido para rastrear el progreso

    const fetchAudio = async (url) => {
        return await fetch(url, {
            method: "GET",
            redirect: "follow"
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
            throw error;
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

        const blob = new Blob(chunks, { type: "audio/mp3" });
        const urlBlob = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = urlBlob;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
    };

    const handleDownload = async (audioUrl, fileName) => {
        setIsLoading(true);
        setProgress(0);
        try {
            await handleDownloadPrimary(audioUrl, fileName);
        } catch (error) {
            await handleDownloadSecondary(audioUrl, fileName);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, progress, handleDownload };
};

export default useDownload;
