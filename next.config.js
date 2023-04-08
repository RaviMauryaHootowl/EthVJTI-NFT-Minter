/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEB3_STORAGE_API: process.env.WEB3_STORAGE_API,
    BICONOMY_API: process.env.BICONOMY_API,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS
  },
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { ...config.resolve.fallback, net: false, os: false, tls: false, fs: false };
    return config;
  },
  compiler: {
    styledComponents: true,
  }
}

module.exports = nextConfig
