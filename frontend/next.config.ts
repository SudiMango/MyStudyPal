import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    devIndicators: false,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/:path*"
                        : "http://backend:8000/:path*",
            },
        ];
    },
};

export default nextConfig;
