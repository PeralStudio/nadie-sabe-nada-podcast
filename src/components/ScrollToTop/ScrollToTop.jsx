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

    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

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
                    <button className={styles.scrollButton}>
                        <ArrowUpwardIcon />
                    </button>
                </div>
            )}
        </>
    );
};

export default ScrollToTop;
