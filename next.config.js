const isDev = true;

module.exports = {
    images: {
        unoptimized: true,
        domains: ['127.0.0.1'], // Add the hostname(s) here
    },
    ...(!isDev && {
        basePath: '/static',
        assetPrefix: '/static'
    })
};