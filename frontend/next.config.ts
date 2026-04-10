import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    devIndicators: false,
    async rewrites() {
        return [];
    },
};

export default nextConfig;
