import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Bounce, toast } from "react-toastify";

const AudioTimeContext = createContext();

export const useAudioTime = () => {
    const context = useContext(AudioTimeContext);
    if (!context) {
        throw new Error("useAudioTime must be used within an AudioTimeProvider");
    }
    return context;
};

export const AudioTimeProvider = ({ children }) => {
    const [playbackTimes, setPlaybackTimes] = useState({});
    const [savePlaybackTime, setSavePlaybackTime] = useState(true);

    useEffect(() => {
        const savedTimes = localStorage.getItem("nsnPlaybackTimes");
        const savedPreference = localStorage.getItem("nsnSavePlaybackTime");

        if (savedTimes) {
            setPlaybackTimes(JSON.parse(savedTimes));
        }

        if (savedPreference !== null) {
            setSavePlaybackTime(JSON.parse(savedPreference));
        }
    }, []);

    const updatePlaybackTime = useCallback(
        (audioTitle, currentTime) => {
            if (!savePlaybackTime) return;

            const newTimes = {
                ...playbackTimes,
                [audioTitle]: currentTime
            };
            setPlaybackTimes(newTimes);
            localStorage.setItem("nsnPlaybackTimes", JSON.stringify(newTimes));
        },
        [playbackTimes, savePlaybackTime]
    );

    const getPlaybackTime = (audioTitle) => {
        return savePlaybackTime ? playbackTimes[audioTitle] || 0 : 0;
    };

    const toggleSavePlaybackTime = () => {
        const newValue = !savePlaybackTime;
        setSavePlaybackTime(newValue);
        localStorage.setItem("nsnSavePlaybackTime", JSON.stringify(newValue));

        if (!newValue) {
            setPlaybackTimes({});
            localStorage.removeItem("nsnPlaybackTimes");
        }
    };

    const clearPlaybackTimes = () => {
        try {
            setPlaybackTimes({});
            localStorage.removeItem("nsnPlaybackTimes");
            toast.success("Tiempos Borrados", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            });
        } catch (error) {
            toast.error("Error al borrar los tiempos", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce
            });
            console.error("Error al borrar los tiempos de reproducción:", error);
        }
    };

    return (
        <AudioTimeContext.Provider
            value={{
                playbackTimes,
                updatePlaybackTime,
                getPlaybackTime,
                savePlaybackTime,
                toggleSavePlaybackTime,
                clearPlaybackTimes
            }}
        >
            {children}
        </AudioTimeContext.Provider>
    );
};
