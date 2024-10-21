import React from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { GitHub } from "@mui/icons-material";

const Header = () => {
    // Variantes para la animación de la cabecera
    const headerVariants = {
        hidden: { opacity: 0, y: -50 }, // Aparece desde arriba
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.2 }
        }
    };

    // Variantes para la animación del logo
    const logoVariants = {
        hover: {
            scale: 1.05,
            rotate: -2,
            transition: { type: "spring", stiffness: 300, damping: 8 }
        }
    };

    // Variantes para el botón del último episodio
    const ctaVariants = {
        hover: {
            scale: 1.06,
            transition: { duration: 0.3, yoyo: Infinity } // Repite la animación mientras está en hover
        }
    };

    // Variantes para la animación del ícono de GitHub
    const iconVariants = {
        hover: {
            rotate: 360, // Rotación completa en hover
            transition: { type: "spring", stiffness: 150, damping: 12 }
        }
    };

    return (
        <motion.header
            className={styles.header}
            initial="hidden"
            animate="visible"
            variants={headerVariants}
        >
            <div className={styles.logo}>
                <motion.h1
                    whileHover="hover"
                    variants={logoVariants} // Aplica la animación en hover
                >
                    <Link to="/" className={styles.logoLink}>
                        Nadie Sabe Nada
                    </Link>
                </motion.h1>

                <p className={styles.tagline}>
                    El podcast donde nada está claro, pero todo es divertido
                </p>
            </div>

            <div className={styles.socialIcons}>
                <motion.div whileHover="hover" variants={iconVariants}>
                    <IconButton
                        href="https://github.com/PeralStudio"
                        target="_blank"
                        rel="noopener"
                        className={styles.iconButton}
                    >
                        <GitHub />
                    </IconButton>
                </motion.div>

                <motion.div whileHover="hover" variants={ctaVariants}>
                    <Link to="/ultimo-episodio" className={styles.ctaLink}>
                        Último Episodio
                    </Link>
                </motion.div>
            </div>
        </motion.header>
    );
};

export default Header;
