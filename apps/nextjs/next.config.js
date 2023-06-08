/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["pbs.twimg.com", "api.dicebear.com"],
  },
  experimental: {
    serverActions: true,
    appDir: true,
  },
};
