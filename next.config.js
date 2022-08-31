/** @type {import('next').NextConfig} */
const Dotenv = require("dotenv-webpack");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    config.plugins.push(new Dotenv({ silent: true }));
    return config;
  }
}

module.exports = nextConfig
