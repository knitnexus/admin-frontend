import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'knitnexus-erpnext.s3.ap-south-1.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
