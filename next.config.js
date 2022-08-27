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
    compiler: {
        nextUi: true,
    },
    images: {
        domains: ['localhost'],
    },
}