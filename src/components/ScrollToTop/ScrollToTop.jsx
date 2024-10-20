import React, { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const useMobileDetect = () => {
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileCheck = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
                userAgent
            );
            setIsMobile(mobileCheck);
        }, []);

        return isMobile;
    };

    const isMobile = useMobileDetect();

    // Mostrar el botón cuando se haya hecho scroll hacia abajo
    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Hacer scroll hacia arriba con efecto "smooth"
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            {isVisible && !isMobile && (
                <div className={styles.scrollToTop} onClick={scrollToTop}>
                    <div className={styles.scrollButton}>
                        <ArrowUpwardIcon />
                    </div>
                </div>
            )}
        </>
    );
};

export default ScrollToTop;
