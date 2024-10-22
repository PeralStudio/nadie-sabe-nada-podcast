import { useState } from "react";

const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async (audioUrl, fileName) => {
        setIsLoading(true);
        try {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = urlBlob;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleDownload };
};

export default useDownload;
