/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '',
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json/headless-builder/v1',
    WORDPRESS_SITE_URL: process.env.WORDPRESS_SITE_URL || 'http://localhost:8080',
  },
};

module.exports = nextConfig;
