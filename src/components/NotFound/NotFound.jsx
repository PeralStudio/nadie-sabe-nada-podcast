import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import Seo from "../Seo/Seo";

const NotFound = () => {
    return (
        <div className={styles.notFoundContainer}>
            <Seo
                title="Nadie Sabe Nada | Podcast de Humor y Comedia con Andreu Buenafuente y Berto Romero"
                description="Escucha el podcast 'Nadie Sabe Nada', el show de humor con Andreu Buenafuente y Berto Romero. Accede a todos los episodios y disfruta de las mejores bromas."
                keywords="podcast, humor, comedia, Andreu Buenafuente, Berto Romero, nadie sabe nada, escuchar podcast"
                ogTitle="Nadie Sabe Nada - Podcast de Humor"
                ogDescription="Escucha todos los episodios del podcast 'Nadie Sabe Nada' de Andreu Buenafuente y Berto Romero. Humor y comedia en su máxima expresión."
                ogImage="https://sdmedia.playser.cadenaser.com/playser/image/20233/31/1680287953_square_image.png"
                ogUrl="https://nsn.peralstudio.com"
                twitterCard="summary_large_image"
                twitterTitle="Nadie Sabe Nada - Podcast de Humor"
                twitterDescription="Escucha el podcast más divertido de Andreu Buenafuente y Berto Romero."
                twitterImage="https://sdmedia.playser.cadenaser.com/playser/image/20233/31/1680287953_square_image.png"
            />
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
