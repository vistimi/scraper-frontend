module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/imagesPending',
                permanent: true,
            },
        ]
    }
}