import { useState, useEffect } from "react";

const useMobileDetect = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileCheck = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
                userAgent
            );
            setIsMobile(mobileCheck);
        };

        checkIfMobile();

        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    return isMobile;
};

export default useMobileDetect;
