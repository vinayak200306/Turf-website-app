import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Field Door",
    short_name: "Field Door",
    description: "Single venue sports booking app",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#FF7A00",
    icons: [
      {
        src: "/media/brand-mark.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
