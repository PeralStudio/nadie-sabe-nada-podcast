import { useState, useEffect } from "react";

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        // Limpiar el event listener al desmontar el componente
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowWidth;
};

export default useWindowWidth;
