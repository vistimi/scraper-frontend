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
}