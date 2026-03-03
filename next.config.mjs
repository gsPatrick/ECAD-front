/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.sbacem.com.br/apidois/api/:path*',
      },
    ];
  },
};

export default nextConfig;
