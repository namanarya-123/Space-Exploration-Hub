/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.britannica.com",
      },
    ],
  },
};

module.exports = nextConfig;