import React from "react";
import { motion } from "framer-motion";
import styles from "./NoResults.module.css";
import { SearchOff } from "@mui/icons-material";

const NoResults = ({ searchTerm, currentFilter }) => {
    const getMessage = () => {
        if (searchTerm) {
            return `No se encontraron resultados para "${searchTerm}"`;
        }

        switch (currentFilter) {
            case "empezados":
                return "No hay podcasts empezados";
            case "no-empezados":
                return "No hay podcasts sin empezar";
            case "favoritos":
                return "No hay podcasts favoritos";
            case "completados":
                return "No hay podcasts completados";
            default:
                return "No hay podcasts disponibles";
        }
    };

    return (
        <motion.div
            className={styles.noResults}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className={styles.iconContainer}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
                <SearchOff className={styles.icon} />
            </motion.div>
            <motion.h2
                className={styles.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {getMessage()}
            </motion.h2>
            <motion.p
                className={styles.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Prueba con otros filtros o términos de búsqueda
            </motion.p>
        </motion.div>
    );
};

export default NoResults;
