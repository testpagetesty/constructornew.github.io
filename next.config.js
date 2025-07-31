/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['maps.googleapis.com'],
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.google.com https://www.gstatic.com blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://maps.googleapis.com https://www.google.com https://maps.gstatic.com; media-src 'self' data: blob:; frame-src 'self' https://www.google.com https://maps.googleapis.com; connect-src 'self' https://maps.googleapis.com https://www.google.com https://maps.gstatic.com https://api.openai.com;"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 