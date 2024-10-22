import React from "react";
import { Helmet } from "react-helmet-async";

const Seo = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage
}) => {
    console.log(title);

    return (
        <Helmet>
            {/* Título y meta tags básicos */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:description" content={ogDescription || description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard || "summary_large_image"} />
            <meta name="twitter:title" content={twitterTitle || title} />
            <meta name="twitter:description" content={twitterDescription || description} />
            <meta name="twitter:image" content={twitterImage || ogImage} />

            {/* Otros meta tags importantes */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Spanish" />

            {/* Favicon y apple-touch-icon */}
            <link
                rel="icon"
                href="https://sdmedia.playser.cadenaser.com/playser/image/20233/31/1680287953_square_image.png"
            />
            <link
                rel="apple-touch-icon"
                href="https://sdmedia.playser.cadenaser.com/playser/image/20233/31/1680287953_square_image.png"
            />
        </Helmet>
    );
};

export default Seo;
