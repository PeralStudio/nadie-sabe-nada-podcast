import React from "react";
import styles from "./Header.module.css";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { GitHub } from "@mui/icons-material";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1>
                    <Link to="/" className={styles.logoLink}>
                        Nadie Sabe Nada
                    </Link>
                </h1>

                <p className={styles.tagline}>
                    El podcast donde nada está claro, pero todo es divertido
                </p>
            </div>

            <div className={styles.socialIcons}>
                <IconButton
                    href="https://github.com/PeralStudio"
                    target="_blank"
                    rel="noopener"
                    className={styles.iconButton}
                >
                    <GitHub />
                </IconButton>
                <Link to="/ultimo-episodio" className={styles.ctaLink}>
                    Último Episodio
                </Link>
            </div>
        </header>
    );
};

export default Header;
