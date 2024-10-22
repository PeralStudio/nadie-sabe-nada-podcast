import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.errorNumber}>
                <span className={styles.number}>4</span>
                <span className={styles.icon}>🚀</span>
                <span className={styles.number}>4</span>
            </div>
            <h1 className={styles.title}>¡Ups! Página no encontrada</h1>
            <p className={styles.message}>Parece que has encontrado un fallo en la matrix.</p>
            <Link to="/" className={styles.homeButton}>
                Llévame a casa
            </Link>
        </div>
    );
};

export default NotFound;
