module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/imagesPending',
                permanent: true,
            },
        ]
    },
    experimental: {
        // Enables the styled-components SWC transform
        styledComponents: true
    },
    images: {
        domains: ['localhost'],
    },
}