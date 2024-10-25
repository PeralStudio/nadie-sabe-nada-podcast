import React from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { GitHub, Language, Settings } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Fade } from "@mui/material";

const Header = () => {
    const headerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.2 }
        }
    };

    const logoVariants = {
        hover: {
            scale: 1.1,
            rotate: -2,
            transition: { type: "spring", stiffness: 300, damping: 8 }
        }
    };

    const ctaVariants = {
        hover: {
            scale: 1.06,
            transition: { duration: 0.3, yoyo: Infinity }
        }
    };

    const iconVariants = {
        hover: {
            scale: 1.36,
            rotate: 360,
            transition: { type: "spring", stiffness: 150, damping: 12 }
        }
    };

    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: "#14D993"
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#14DB93",
            color: "#000000",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "5px 10px",
            borderRadius: "5px"
        }
    }));

    return (
        <motion.header
            className={styles.header}
            initial="hidden"
            animate="visible"
            variants={headerVariants}
        >
            <div className={styles.logo}>
                <motion.h1 whileHover="hover" variants={logoVariants}>
                    <Link to="/" className={styles.logoLink}>
                        Nadie Sabe Nada
                    </Link>
                </motion.h1>

                <p className={styles.tagline}>
                    El podcast donde nada está claro, pero todo es divertido
                </p>
            </div>

            <div className={styles.socialIcons}>
                <BootstrapTooltip
                    title={"Página Web"}
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <motion.div whileHover="hover" variants={iconVariants}>
                        <IconButton
                            href="https://peralstudio.com"
                            target="_blank"
                            rel="noopener"
                            className={styles.iconButton}
                        >
                            <Language />
                        </IconButton>
                    </motion.div>
                </BootstrapTooltip>
                <BootstrapTooltip
                    title={"Github"}
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
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
                </BootstrapTooltip>
                <motion.div whileHover="hover" variants={ctaVariants}>
                    <Link to="/ultimo-episodio" className={styles.ctaLink}>
                        Último Episodio
                    </Link>
                </motion.div>
                <BootstrapTooltip
                    title={"Ajustes"}
                    placement="top"
                    arrow
                    disableInteractive
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <motion.div whileHover="hover" variants={iconVariants}>
                        <Link to="/settings">
                            <IconButton className={styles.iconButton}>
                                <Settings style={{ fontSize: "26px", marginBottom: "1px" }} />
                            </IconButton>
                        </Link>
                    </motion.div>
                </BootstrapTooltip>
            </div>
        </motion.header>
    );
};

export default Header;
