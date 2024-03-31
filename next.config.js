/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["pages", "utils"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["picsum.photos"],
  },
};

// module.exports = {
//   images: {
//     hostname: ["picsum.photos"],
//   },
// };

module.exports = nextConfig;
module.exports = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};
