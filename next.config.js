module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/images',
                permanent: true,
            },
        ]
    },
    experimental: {
        // Enables the styled-components SWC transform
        styledComponents: true
      }
}