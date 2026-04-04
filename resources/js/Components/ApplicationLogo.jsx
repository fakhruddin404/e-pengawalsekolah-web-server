export default function ApplicationLogo({ type = 1, ...props }) {
    // 1. Create a simple "dictionary" for your images
    const logos = {
        1: "/logo1.png",
        2: "/logo2.png",
        3: "/route.png"
    };

    // 2. Select the correct image based on the 'type'. 
    // If the type is missing or invalid, it gracefully defaults to "/logo1.png"
    const imageSrc = logos[type] || "/logo1.png";

    return (
        <img {...props} src={imageSrc} alt="e-PengawalSekolah" />
    );
}

