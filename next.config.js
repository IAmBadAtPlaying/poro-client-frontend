const isDev = true;

/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        unoptimized: true,
        domains: ['127.0.0.1'] // Add the hostname(s) here
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    ...(!isDev && {
        basePath: '/static',
        assetPrefix: '/static'
    })
};

// module.exports = nextConfig;
