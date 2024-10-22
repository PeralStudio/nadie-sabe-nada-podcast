import { useState } from "react";

const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);

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
        const blob = await response.blob();
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
        try {
            await handleDownloadPrimary(audioUrl, fileName);
        } catch (error) {
            await handleDownloadSecondary(audioUrl, fileName);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleDownload };
};

export default useDownload;
