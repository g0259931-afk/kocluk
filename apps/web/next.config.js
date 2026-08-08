/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@saas-coach/types", "@saas-coach/utils", "@saas-coach/shared", "@saas-coach/auth", "@saas-coach/database", "@saas-coach/ai", "@saas-coach/backend"]
};

module.exports = nextConfig;
