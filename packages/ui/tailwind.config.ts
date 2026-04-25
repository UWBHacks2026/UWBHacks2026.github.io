import type { Config } from "tailwindcss";

const config = {
    darkMode: "class",
    content: [
        "index.html",
        "src/**/*.{ts,tsx}",
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "views/**/*.{ts,tsx}",
        "../../packages/ui/src/components/**/*.{ts,tsx}",
        "../../packages/ui/src/views/**/*.{ts,tsx}",
    ],
} satisfies Config;

export default config;
